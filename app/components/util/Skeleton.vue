<script setup lang="ts">
export interface SkeletonProps {
	type?: 'text' | 'title' | 'avatar' | 'card' | 'image'
	width?: string
	height?: string
	lines?: number
}

const props = withDefaults(defineProps<SkeletonProps>(), {
	type: 'text',
	lines: 1,
})

const computedWidth = computed(() => props.width || '100%')
const computedHeight = computed(() => props.height || '1em')
</script>

<template>
<div class="skeleton-wrapper">
	<template v-if="type === 'text'">
		<div
			v-for="i in lines"
			:key="i"
			class="skeleton skeleton-text"
			:style="{
				width: i === lines ? '70%' : computedWidth,
				height: computedHeight,
			}"
		/>
	</template>

	<div
		v-else-if="type === 'title'"
		class="skeleton skeleton-title"
		:style="{ width: computedWidth, height: computedHeight }"
	/>

	<div
		v-else-if="type === 'avatar'"
		class="skeleton skeleton-avatar"
	/>

	<div v-else-if="type === 'card'" class="skeleton-card">
		<div class="skeleton skeleton-image" />
		<div class="skeleton skeleton-title" />
		<div class="skeleton skeleton-text" />
		<div class="skeleton skeleton-text" />
	</div>

	<div
		v-else-if="type === 'image'"
		class="skeleton skeleton-image"
		:style="{ width: computedWidth, height: computedHeight }"
	/>
</div>
</template>

<style lang="scss" scoped>
.skeleton-wrapper {
	display: contents;
}
</style>