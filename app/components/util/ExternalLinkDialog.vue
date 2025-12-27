<script setup lang="ts">
import Button from '~/components/partial/Button.vue'

const props = defineProps<{
	show?: boolean
	url?: string
}>()

const emit = defineEmits<{
	confirm: []
	cancel: []
}>()

const displayUrl = computed(() => {
	try {
		const urlObj = new URL(props.url || '')
		return urlObj.hostname
	}
	catch {
		return props.url || ''
	}
})

// 倒计时状态
const countdown = ref(5)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
	countdown.value = 5

	countdownTimer = setInterval(() => {
		if (countdown.value > 0) {
			countdown.value--
		}
		else {
			clearCountdown()
			handleConfirm()
		}
	}, 1000)
}

function clearCountdown() {
	if (countdownTimer) {
		clearInterval(countdownTimer)
		countdownTimer = null
	}
}

function handleConfirm() {
	clearCountdown()
	emit('confirm')
}

function handleCancel() {
	clearCountdown()
	emit('cancel')
}

// 组件挂载时开始倒计时
onMounted(() => {
	startCountdown()
})

// 组件卸载时清除倒计时
onUnmounted(() => {
	clearCountdown()
})

useEventListener('keydown', (e) => {
	if (props.show && e.key === 'Escape') {
		e.preventDefault()
		handleCancel()
	}
})
</script>

<template>
<BlogMask
	:show
	blur
	@click="handleCancel"
/>

<Transition>
	<div v-if="show" class="dialog">
		<div class="dialog-header">
			<Icon name="ph:warning-circle-bold" class="icon" />
			<h3 class="title">
				即将离开本站
			</h3>
		</div>

		<div class="dialog-body">
			<p class="message">
				您即将访问外部链接，请确认是否继续：
			</p>
			<div class="url-display">
				<Icon name="ph:link-bold" class="url-icon" />
				<span class="url-text">{{ displayUrl }}</span>
			</div>
			<div class="countdown">
				<Icon name="ph:clock-bold" class="countdown-icon" />
				<span class="countdown-text">将在 <span class="countdown-number">{{ countdown }}</span> 秒后自动跳转...</span>
			</div>
			<p class="warning">
				注意：外部链接的内容与本站无关，请谨慎访问。
			</p>
		</div>

		<div class="dialog-footer">
			<Button text="取消" @click="handleCancel" />
			<Button text="继续访问" primary @click="handleConfirm" />
		</div>
	</div>
</Transition>
</template>

<style lang="scss" scoped>
.dialog {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: min(90%, 32rem);
	max-width: 90%;
	padding: 1.5rem;
	border-radius: 0.75rem;
	box-shadow: 0 0.5em 1em var(--ld-shadow), 0 0 0 1px var(--c-border);
	background-color: var(--ld-bg-card);
	z-index: calc(var(--z-index-popover) + 1);
	transition: all var(--delay);
}

.dialog-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1.25rem;
}

.icon {
	flex-shrink: 0;
	width: 2rem;
	height: 2rem;
	color: #f59e0b;
}

.title {
	margin: 0;
	font-size: 1.25rem;
	font-weight: 600;
	color: var(--c-text);
}

.dialog-body {
	margin-bottom: 1.5rem;
}

.message {
	margin: 0 0 1rem 0;
	font-size: 0.95rem;
	color: var(--c-text-1);
}

.url-display {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	margin-bottom: 1rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background-color: var(--c-bg-2);
	transition: all var(--delay);

	&:hover {
		border-color: var(--c-primary);
		background-color: var(--c-bg);
	}
}

.url-icon {
	flex-shrink: 0;
	width: 1.25rem;
	height: 1.25rem;
	color: var(--c-text-2);
}

.url-text {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-family: var(--font-monospace);
	font-size: 0.9rem;
	color: var(--c-text);
}

.warning {
	margin: 0;
	font-size: 0.85rem;
	color: var(--c-text-2);
}

.countdown {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 1rem 0;
	padding: 0.75rem 1rem;
	border-radius: 0.5rem;
	background-color: var(--c-primary-soft);
	border-left: 3px solid var(--c-primary);
	transition: all var(--delay);

	.countdown-icon {
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--c-primary);
	}

	.countdown-text {
		flex: 1;
		font-size: 0.9rem;
		color: var(--c-text-1);

		.countdown-number {
			font-weight: 600;
			color: var(--c-primary);
			transition: all 0.3s ease;
			font-size: 1rem;
		}
	}
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	padding-top: 1rem;
	border-top: 1px solid var(--c-border);
	margin-top: 1rem;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translate(-50%, -45%) scale(0.95);
}

.v-enter-active,
.v-leave-active {
	transition: all var(--delay);
}
</style>
