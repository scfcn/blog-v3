<script setup lang="ts">
const readingProgress = ref(0)
const isVisible = ref(false)

onMounted(() => {
	const handleScroll = () => {
		const scrollTop = window.scrollY
		const docHeight = document.documentElement.scrollHeight - window.innerHeight
		readingProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
		isVisible.value = scrollTop > 300
	}

	window.addEventListener('scroll', handleScroll, { passive: true })
	handleScroll()

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})
})

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
<Transition name="fade">
	<button
		v-if="isVisible"
		class="back-to-top"
		:aria-label="`返回顶部 - 已阅读 ${Math.round(readingProgress)}%`"
		@click="scrollToTop"
	>
		<svg class="progress-ring" viewBox="0 0 50 50">
			<circle
				class="progress-ring-circle-bg"
				cx="25"
				cy="25"
				r="22"
			/>
			<circle
				class="progress-ring-circle"
				cx="25"
				cy="25"
				r="22"
				:stroke-dasharray="138.23"
				:stroke-dashoffset="138.23 - (138.23 * readingProgress) / 100"
			/>
		</svg>
		<Icon name="ph:arrow-up-bold" class="arrow-icon" />
	</button>
</Transition>
</template>

<style lang="scss" scoped>
.back-to-top {
	position: fixed;
	bottom: 2rem;
	right: 2rem;
	width: 3.5rem;
	height: 3.5rem;
	border: none;
	border-radius: 50%;
	background-color: var(--c-bg-card);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	z-index: 9998;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}

	&:active {
		transform: translateY(-2px);
	}
}

.progress-ring {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transform: rotate(-90deg);
}

.progress-ring-circle-bg {
	fill: none;
	stroke: var(--c-bg-3);
	stroke-width: 3;
}

.progress-ring-circle {
	fill: none;
	stroke: var(--c-primary);
	stroke-width: 3;
	stroke-linecap: round;
	transition: stroke-dashoffset 0.1s ease-out;
}

.arrow-icon {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 1.5rem;
	color: var(--c-primary);
	transition: transform 0.3s ease;
}

.back-to-top:hover .arrow-icon {
	transform: translate(-50%, -50%) translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

@media (max-width: $breakpoint-mobile) {
	.back-to-top {
		bottom: 1.5rem;
		right: 1.5rem;
		width: 3rem;
		height: 3rem;
	}

	.arrow-icon {
		font-size: 1.25rem;
	}
}
</style>
