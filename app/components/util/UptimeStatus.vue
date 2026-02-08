<script setup lang="ts">
interface UptimeStatus {
	name: string
	status: number
	uptime: string
	ping: number
}

interface UptimeResponse {
	monitorList: UptimeStatus[]
}

const appConfig = useAppConfig()

const uptimeUrl = appConfig.uptime?.url || ''
const { data: uptimeData, pending, error } = await useAsyncData<UptimeResponse>('uptime-status', async () => {
	if (!uptimeUrl)
		return { monitorList: [] }

	try {
		const response = await $fetch<UptimeResponse>(uptimeUrl)
		return response
	}
	catch (e) {
		console.error('Uptime Kuma API error:', e)
		return { monitorList: [] }
	}
}, {
	server: false,
	default: () => ({ monitorList: [] }),
})

const overallStatus = computed(() => {
	if (!uptimeData.value?.monitorList?.length)
		return { text: '未知', class: 'unknown', icon: 'ph:question-bold' }

	const allUp = uptimeData.value.monitorList.every(m => m.status === 1)
	const someDown = uptimeData.value.monitorList.some(m => m.status !== 1)

	if (allUp)
		return { text: '正常', class: 'up', icon: 'ph:check-circle-bold' }
	if (someDown)
		return { text: '异常', class: 'down', icon: 'ph:x-circle-bold' }

	return { text: '未知', class: 'unknown', icon: 'ph:question-bold' }
})

const uptimePercentage = computed(() => {
	if (!uptimeData.value?.monitorList?.length)
		return '--'

	const totalUptime = uptimeData.value.monitorList.reduce((sum, m) => {
		const match = m.uptime.match(/[\d.]+/)
		return sum + (match ? Number.parseFloat(match[0]) : 0)
	}, 0)

	return `${(totalUptime / uptimeData.value.monitorList.length).toFixed(2)}%`
})
</script>

<template>
	<span v-if="pending" class="uptime-status loading">
		<Icon name="ph:spinner-bold" class="animate-spin" />
		<span class="status-text">加载中...</span>
	</span>
	<span v-else-if="error || !uptimeUrl" class="uptime-status unknown">
		<Icon name="ph:question-bold" />
		<span class="status-text">状态未知</span>
	</span>
	<span v-else-if="!uptimeData?.monitorList?.length" class="uptime-status unknown">
		<Icon name="ph:question-bold" />
		<span class="status-text">无监控数据</span>
	</span>
	<span v-else class="uptime-status" :class="overallStatus.class">
		<Icon :name="overallStatus.icon" />
		<span class="status-text">{{ overallStatus.text }}</span>
		<span class="uptime-percent">{{ uptimePercentage }}</span>
	</span>
</template>

<style lang="scss" scoped>
.uptime-status {
	display: inline-flex;
	align-items: center;
	gap: 0.3em;
	padding: 0.2em 0.5em;
	border-radius: 0.3em;
	font-size: 0.85em;
	transition: all 0.2s;

	.status-text {
		font-weight: 500;
	}

	.uptime-percent {
		color: var(--c-text-2);
		font-size: 0.9em;
	}

	&.up {
		background-color: rgba(34, 197, 94, 0.1);
		color: rgb(34, 197, 94);

		.uptime-percent {
			color: rgba(34, 197, 94, 0.7);
		}
	}

	&.down {
		background-color: rgba(239, 68, 68, 0.1);
		color: rgb(239, 68, 68);

		.uptime-percent {
			color: rgba(239, 68, 68, 0.7);
		}
	}

	&.unknown {
		background-color: rgba(156, 163, 175, 0.1);
		color: rgb(156, 163, 175);
	}

	&.loading {
		color: var(--c-text-2);
	}

	&.error {
		background-color: rgba(251, 191, 36, 0.1);
		color: rgb(251, 191, 36);
	}
}
</style>
