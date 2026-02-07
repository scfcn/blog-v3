<script setup lang="ts">
import { createLazyComponent } from './utils/lazy'

const BlogPanel = createLazyComponent(() => import('./components/blog/BlogPanel.vue'))
const BlogPopover = createLazyComponent(() => import('./components/blog/BlogPopover.vue'))

if (import.meta.client) {
	const { setupGlobalInterceptor } = useExternalLink({ enabled: true })
	setupGlobalInterceptor()
}
</script>

<template>
<NuxtLoadingIndicator />
<NuxtRouteAnnouncer :style="{ position: 'absolute' }" />
<BlogSkipToContent />
<BlogSidebar />
<div id="content">
	<main id="main-content">
		<NuxtPage />
		<BlogFooter />
	</main>
	<BlogAside />
</div>
<BlogPanel />
<BlogPopover />
</template>

<style>
@keyframes page-in {
	0% {
		opacity: 0;
		transform: translateY(20px) scale(0.98);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.page-enter-active {
	animation: page-in 0.4s ease-out;
}

.page-leave-active {
	transition: opacity 0.2s ease;
}

.page-enter-from {
	opacity: 0;
}

.page-leave-to {
	opacity: 0;
}
</style>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
#z-root {
	display: flex;
	justify-content: center;
	gap: 1rem;
	min-width: 0;
}

#blog-sidebar, #blog-aside {
	flex-shrink: 0;
	position: sticky;
	top: 0;
	width: 280px;
	height: 100vh;
	height: 100dvh;
	scrollbar-width: thin;

	@media (max-width: $breakpoint-widescreen) {
		flex-shrink: 0.2;
	}
}

#content {
	display: flex;
	gap: 1rem;

	// 若设置的是 max-width，则内部 main 宽度为 fit-content，可能无法撑满
	// 此时即使设置 flex-grow，也会影响 #sidebar 无法正确 shrink
	width: $breakpoint-widescreen;
	min-width: 0; // 解决父级 flexbox 设置 justify-content: center 时溢出左侧消失的问题

	// 此处不建议给内容设置 padding
	> #main-content {
		flex-grow: 1; // 使较小宽度的内容占满

		// overflow: hidden; // 会使一部分元素吸顶失效

		// 使内容正确计算宽度而不横向溢出
		// 也可设置 width: 0 或者 width contain: inline-size（兼容性不佳）;
		min-width: 0;
	}
}
</style>
