<script setup lang="ts">
const readingProgress = ref(0)
const isVisible = ref(false)

onMounted(() => {
	const handleScroll = () => {
		const scrollTop = window.scrollY
		const docHeight = document.documentElement.scrollHeight - window.innerHeight
		const maxScroll = docHeight > 0 ? docHeight : 1
		let progress = (scrollTop / maxScroll) * 100

		if (progress > 100) progress = 100
		if (progress < 0) progress = 0

		readingProgress.value = progress

		if (scrollTop > 50) {
			isVisible.value = true
		}
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					isVisible.value = true
				}
			})
		},
		{ threshold: 0.1 }
	)

	const article = document.querySelector('article')
	if (article) {
		observer.observe(article)
	}

	window.addEventListener('scroll', handleScroll, { passive: true })
	handleScroll()

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
		observer.disconnect()
	})
})
</script>

<template>
<div v-if="isVisible" class="reading-progress-bar">
	<div class="progress" :style="{ width: `${readingProgress}%` }" />
	<div class="progress-text">{{ Math.round(readingProgress) }}%</div>
</div>
</template>

<style lang="scss" scoped>
.reading-progress-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 4px;
	z-index: 9999;
	background-color: transparent;

	.progress {
		height: 100%;
		background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
		transition: width 0.15s ease-out;
		border-radius: 0 2px 2px 0;
	}

	.progress-text {
		position: absolute;
		top: 8px;
		right: 1rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--c-primary);
		background-color: var(--c-bg-2);
		border: 1px solid var(--c-border);
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.15s ease-out;

		@media (max-width: 768px) {
			font-size: 0.7rem;
			padding: 0.2rem 0.4rem;
		}
	}
}
</style>
