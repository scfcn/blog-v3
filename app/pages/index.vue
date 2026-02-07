<script setup lang="ts">
import { sort } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
	description: appConfig.description,
	ogImage: appConfig.author.avatar,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group', 'welcome-visitor'])

const { data: listRaw } = await useAsyncData('index_posts', () => useArticleIndexOptions(), { default: () => [] })
const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw, { bindDirectionQuery: 'asc', bindOrderQuery: 'sort' })
const { category, categories, listCategorized } = useCategory(listSorted, { bindQuery: 'category' })
const { page, totalPages, listPaged } = usePagination(listCategorized, { bindQuery: 'page' })

watch(category, () => {
	page.value = 1
})

useSeoMeta({ title: () => (page.value > 1 ? `第${page.value}页` : '') })

const listRecommended = computed(() => sort(
	(listRaw.value || []).filter(item => item?.recommend),
	post => post.recommend || 0,
	true,
))

const isClient = process.client
</script>

<template>
<BlogHeader class="mobile-only" to="/" tag="h1" />

<ClientOnly>
	<PostSlide v-if="listRecommended.length && page === 1 && !category" :list="listRecommended" />
	<template #fallback>
		<UtilSkeleton type="image" />
	</template>
</ClientOnly>

<div class="post-list">
	<div class="toolbar">
		<div>
			<!-- 外层元素用于占位 -->
			<UtilLink to="/preview" class="preview-entrance">
				<Icon name="ph:file-lock-bold" />
				查看预览文章
			</UtilLink>
		</div>

		<PostOrderToggle
			v-model:is-ascending="isAscending"
			v-model:sort-order="sortOrder"
			v-model:category="category"
			:categories
		/>
	</div>

	<TransitionGroup tag="menu" class="proper-height" name="float-in">
	<template v-if="listPaged.length">
		<PostArticle
			v-for="article in listPaged"
			:key="article.path"
			v-bind="article"
			:to="article.path"
			:use-updated="sortOrder === 'updated'"
		/>
	</template>
	<template v-else>
		<UtilSkeleton
			v-for="i in 5"
			:key="`skeleton-${i}`"
			type="card"
			:style="{ margin: '1rem 0' }"
		/>
	</template>
</TransitionGroup>

	<ZPagination v-model="page" sticky :total-pages="totalPages" />
</div>
</template>

<style lang="scss" scoped>
.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.preview-entrance {
	position: relative;
	opacity: 0;
	transition: all 0.2s 1s, color 0.2s;
	z-index: -1;

	:hover > &,
	:focus-within > & {
		opacity: 1;
		color: var(--c-primary);
		z-index: 0;
	}
}

.post-list {
	margin: 1rem;
}
</style>
