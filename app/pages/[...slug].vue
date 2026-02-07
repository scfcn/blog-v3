<script setup lang="ts">
const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc', 'related-posts'])

const { data: post, pending } = await useAsyncData(
	route.path,
	() => queryCollection('content').path(route.path).first(),
)

const contentStore = useContentStore()
const { toc, meta } = storeToRefs(contentStore)

const excerpt = computed(() => post.value?.description || '')

function setTocAndMeta() {
	if (post.value) {
		toc.value = post.value?.body.toc
		meta.value = post.value?.meta
	}
}

setTocAndMeta()

if (post.value) {
	useSeoMeta({
		title: post.value.title,
		ogType: 'article',
		ogImage: post.value.image,
		description: post.value.description,
	})
	layoutStore.setAside(post.value.meta?.aside as WidgetName[] | undefined)
}
else if (!pending.value) {
	const event = useRequestEvent()
	event && setResponseStatus(event, 404)
	layoutStore.setAside(['blog-log'])
}

if (import.meta.dev) {
	watchEffect(() => setTocAndMeta())
}
</script>

<template>
<PostReadingProgress />
<template v-if="post">
	<PostHeader v-bind="post" />
	<PostExcerpt v-if="excerpt" :excerpt />
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(post?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/>

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<template v-else-if="pending">
	<div class="loading-placeholder">
		<Icon name="ph:spinner-bold" class="spin" />
		<p>加载中...</p>
	</div>
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>

<style lang="scss" scoped>
.loading-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 4rem 2rem;
	min-height: 50vh;
	font-size: 1.2rem;
	color: var(--c-text-2);

	.spin {
		font-size: 3rem;
	}
}
</style>
