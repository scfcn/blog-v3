<script setup lang="ts">
const appConfig = useAppConfig()

// 获取侧边栏广告配置
const ads = computed(() => appConfig.ads?.aside || [])
</script>

<template>
<div v-if="ads.length">
	<BlogWidget card title="广告">
		<div class="ad-container">
			<div v-for="(ad, index) in ads" :key="ad.id" class="ad-item" :class="{ 'ad-item-separated': index > 0 }">
				<a
					v-if="ad.url"
					:href="ad.url"
					:target="ad.target"
					:rel="ad.nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer'"
					class="ad-link"
				>
					<h4 v-if="ad.title" class="ad-title">{{ ad.title }}</h4>
					<img
						v-if="ad.type === 'image' && ad.image"
						:src="ad.image"
						:alt="ad.title || '广告'"
						class="ad-image"
					>
					<div
						v-if="ad.type === 'html' && ad.content"
						class="ad-content"
						v-html="ad.content"
					/>
					<p v-else-if="ad.content" class="ad-content">{{ ad.content }}</p>
				</a>
				<div v-else>
					<h4 v-if="ad.title" class="ad-title">
						{{ ad.title }}
					</h4>
					<img
						v-if="ad.type === 'image' && ad.image"
						:src="ad.image"
						:alt="ad.title || '广告'"
						class="ad-image"
					>
					<div
						v-if="ad.type === 'html' && ad.content"
						class="ad-content"
						v-html="ad.content"
					/>
					<p v-else-if="ad.content" class="ad-content">
						{{ ad.content }}
					</p>
				</div>
			</div>
		</div>
	</BlogWidget>
</div>
</template>

<style lang="scss" scoped>
.ad-link {
	display: block;
	text-decoration: none;
	color: var(--c-text);
	transition: color 0.2s;

	&:hover {
		color: var(--c-primary);
	}
}

.ad-title {
	margin: 0 0 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	color: var(--c-text);
}

.ad-image {
	width: 100%;
	height: auto;
	margin: 0.5rem 0;
	border-radius: 0.5rem;
	object-fit: cover;
}

.ad-content {
	margin: 0;
	font-size: 0.9em;
	line-height: 1.5;
	color: var(--c-text-2);

	:deep(p) {
		margin: 0;
	}
}

.ad-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.ad-item {
	transition: all 0.2s;
}

.ad-item-separated {
	padding-top: 1rem;
	border-top: 1px solid var(--c-border);
}
</style>
