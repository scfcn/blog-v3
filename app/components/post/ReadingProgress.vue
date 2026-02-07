<script setup lang="ts">
const readingProgress = ref(0)

onMounted(() => {
	const handleScroll = () => {
		const scrollTop = window.scrollY
		const docHeight = document.documentElement.scrollHeight - window.innerHeight
		readingProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
	}

	window.addEventListener('scroll', handleScroll, { passive: true })
	handleScroll()

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})
})
</script>

<template>
	<div class="reading-progress-bar">
		<div class="progress" :style="{ width: `${readingProgress}%` }" />
	</div>
</template>

<style lang="scss" scoped>
.reading-progress-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	z-index: 9999;
	background-color: transparent;

	.progress {
		height: 100%;
		background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
		transition: width 0.1s ease-out;
	}
}
</style>
