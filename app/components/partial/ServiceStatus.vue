<script setup lang="ts">
const MONITOR_IDS = [2, 3, 4, 5, 6, 8, 9, 10, 13]
const STATUS_PAGE_URL = 'https://up.qixz.cn/status/qxz'
const API_URL = 'https://up.qixz.cn/api/status-page/heartbeat/qxz'

interface Heartbeat {
	status: number
	time: string
	msg: string
	ping: number
}

interface HeartbeatResponse {
	heartbeatList: Record<string, Heartbeat[]>
}

const isLoading = ref(true)
const hasError = ref(false)
const data = ref<HeartbeatResponse | null>(null)
let refreshTimer: ReturnType<typeof setInterval> | null = null

async function fetchData() {
	try {
		const response = await $fetch<HeartbeatResponse>(API_URL)
		if (response?.heartbeatList) {
			const hasValidData = MONITOR_IDS.some((id) => {
				const heartbeats = response.heartbeatList[id.toString()]
				return heartbeats && heartbeats.length > 0
			})
			if (hasValidData) {
				data.value = response
				hasError.value = false
			}
			else {
				hasError.value = true
			}
		}
		else {
			hasError.value = true
		}
	}
	catch (e) {
		console.error('Failed to fetch service status:', e)
		hasError.value = true
	}
	finally {
		isLoading.value = false
	}
}

onMounted(async () => {
	await fetchData()
	refreshTimer = setInterval(fetchData, 30000)
})

onUnmounted(() => {
	if (refreshTimer) {
		clearInterval(refreshTimer)
	}
})

const failedCount = computed(() => {
	if (!data.value?.heartbeatList)
		return 0
	let count = 0
	for (const id of MONITOR_IDS) {
		const heartbeats = data.value.heartbeatList[id.toString()]
		if (!heartbeats || heartbeats.length === 0) {
			count++
			continue
		}
		const latest = heartbeats.at(-1)
		if (!latest || latest.status !== 1) {
			count++
		}
	}
	return count
})

const statusType = computed(() => {
	if (isLoading.value)
		return 'loading'
	if (hasError.value)
		return 'error'
	if (!data.value)
		return 'normal'
	if (failedCount.value === 0)
		return 'normal'
	if (failedCount.value === MONITOR_IDS.length)
		return 'all-failed'
	return 'partial-failed'
})

const statusText = computed(() => {
	if (isLoading.value)
		return '监察御史汇报中'
	if (hasError.value)
		return '监察御史开小差了'
	if (!data.value)
		return '所有服务正常'
	if (failedCount.value === 0)
		return '所有服务正常'
	if (failedCount.value === MONITOR_IDS.length)
		return '所有服务故障'
	return `共 ${failedCount.value} 个服务故障`
})
</script>

<template>
<ClientOnly>
	<Tooltip :delay="200" placement="top">
		<NuxtLink
			:to="STATUS_PAGE_URL"
			target="_blank"
			class="service-status"
			:class="`is-${statusType}`"
		>
			<span class="status-indicator">
				<span class="status-dot" />
			</span>
			<span class="status-text">{{ statusText }}</span>
		</NuxtLink>
		<template #content>
			<span>点击查看服务状态</span>
		</template>
	</Tooltip>
	<template #fallback>
		<span class="service-status is-loading">
			<span class="status-indicator">
				<span class="status-dot" />
			</span>
			<span class="status-text">监察御史汇报中</span>
		</span>
	</template>
</ClientOnly>
</template>

<style lang="scss" scoped>
@keyframes pulse {
	0%, 100% {
		opacity: 0.4;
	}

	50% {
		opacity: 1;
	}
}

.service-status {
	display: inline-flex;
	align-items: center;
	gap: 0.5em;
	margin-left: 1em;
	font-size: inherit;
	text-decoration: none;
	transition: color 0.2s;

	.status-indicator {
		position: relative;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.status-dot {
		position: absolute;
		opacity: 1;
		top: 50%;
		left: 50%;
		width: 0.6em;
		height: 0.6em;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	&.is-loading {
		.status-indicator {
			background-color: rgb(108 117 125 / 40%);
		}

		.status-dot {
			background-color: #6C757D;
		}
	}

	&.is-normal {
		.status-indicator {
			background-color: rgb(92 221 139 / 40%);
		}

		.status-dot {
			background-color: #5CDD8B;
		}

		&:hover {
			color: #5CDD8B;
		}
	}

	&.is-partial-failed, &.is-all-failed {
		.status-indicator {
			background-color: rgb(220 53 69 / 40%);
		}

		.status-dot {
			background-color: #DC3545;
		}

		&:hover {
			color: #DC3545;
		}
	}

	&.is-error {
		.status-indicator {
			background-color: rgb(255 193 7 / 40%);
		}

		.status-dot {
			background-color: #FFC107;
		}

		&:hover {
			color: #FFC107;
		}
	}
}
</style>
