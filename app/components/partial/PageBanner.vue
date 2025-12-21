<script setup lang="ts">
defineProps<{
	image: string
	title: string
	description?: string
}>()
</script>

<template>
<div class="page-banner" :style="{ backgroundImage: `url(${image})` }">
	<div class="banner-content">
		<h1>{{ title }}</h1>
		<p v-if="description">
			{{ description }}
		</p>
	</div>
	<div class="banner-extra">
		<slot />
	</div>
</div>
</template>

<style lang="scss" scoped>
.page-banner {
	position: relative;
	overflow: hidden;
	min-height: 256px;
	max-height: 320px;
	margin: 1rem;
	border-radius: 8px;
	background-position: 50%;
	background-size: cover;

	.banner-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		padding: 1rem;
		text-shadow: 0 4px 5px rgba(#000, 0.5);
		color: #EEE;

		p {
			opacity: 0.9;
		}
	}

	.banner-extra {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		position: absolute;
		right: 0;
		bottom: 0;
		margin: 1rem;
	}
}
</style>
