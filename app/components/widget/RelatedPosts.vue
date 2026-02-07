<script setup lang="ts">
const route = useRoute()

const { data: currentPost } = await useAsyncData(
	`current-post-for-related-${route.path}`,
	() => queryCollection('content').path(route.path).first(),
)

const currentTags = computed(() => currentPost.value?.tags ?? [])
const currentCategory = computed(() => currentPost.value?.categories?.[0])
const currentPath = computed(() => currentPost.value?.path)

const { data: relatedPosts } = await useAsyncData(
	`related-posts-${route.path}`,
	async () => {
		if (!currentTags.value.length && !currentCategory.value) {
			return []
		}

		try {
			const query = queryCollection('content')
				.where('stem', 'LIKE', 'posts/%')
				.order('date', 'DESC')
				.limit(10)

			if (currentTags.value.length > 0) {
				query.where('tags', 'IN', currentTags.value)
			} else if (currentCategory.value) {
				query.where('categories', 'IN', [currentCategory.value])
			}

			const posts = await query.all()
			return posts.filter((post: any) => post.path !== currentPath.value).slice(0, 8)
		}
		catch (error) {
			console.error('Failed to fetch related posts:', error)
			return []
		}
	},
)

const displayPosts = computed(() => relatedPosts.value?.slice(0, 8) ?? [])

function getExcerpt(post: any): string {
	return post.description || ''
}

function formatDate(date: string | undefined): string {
	if (!date) return ''
	return new Date(date).toLocaleDateString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
}
</script>

<template>
<div v-if="displayPosts.length > 0">
	<BlogWidget title="相关文章">
		<div class="related-posts-list">
				<UtilLink
						v-for="post in displayPosts"
						:key="post.path"
						:to="post.path"
						class="related-post-item"
					>
					<div v-if="post.image" class="post-thumbnail">
						<NuxtImg
								:src="post.image"
								:alt="post.title"
								width="120"
								height="80"
								loading="lazy"
								format="webp"
							/>
					</div>
					<div class="post-content">
						<h3 class="post-title">{{ post.title }}</h3>
						<p class="post-excerpt">{{ getExcerpt(post) }}</p>
						<div class="post-meta">
							<span class="post-date">
								<Icon name="ph:calendar-dots-bold" />
								{{ formatDate(post.date) }}
							</span>
							<span v-if="post.categories?.[0]" class="post-category">
								<Icon name="ph:folder-bold" />
								{{ post.categories[0] }}
							</span>
						</div>
					</div>
				</UtilLink>
		</div>
	</BlogWidget>
</div>
<p v-else class="no-related-posts">
	暂无相关文章
</p>
</template>

<style lang="scss" scoped>
.related-posts-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.related-post-item {
	display: flex;
	gap: 0.75rem;
	padding: 0.75rem;
	border-radius: 0.75rem;
	background-color: var(--c-bg-soft);
	transition: all 0.2s ease-out;

	&:hover {
		transform: translateY(-2px);
		background-color: var(--c-bg-2);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.post-thumbnail {
		flex-shrink: 0;
		width: 120px;
		height: 80px;
		overflow: hidden;
		border-radius: 0.5rem;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.2s ease-out;
		}

		&:hover img {
			transform: scale(1.05);
		}
	}

	.post-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-width: 0;

		.post-title {
			font-size: 0.95rem;
			font-weight: 600;
			line-height: 1.4;
			color: var(--c-text);
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			transition: color 0.2s;
		}

		.post-excerpt {
			font-size: 0.8rem;
			line-height: 1.4;
			color: var(--c-text-2);
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.post-meta {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			margin-top: auto;
			font-size: 0.75rem;
			color: var(--c-text-3);

			.post-date,
			.post-category {
				display: flex;
				align-items: center;
				gap: 0.25rem;
			}

			.iconify {
				font-size: 0.9rem;
			}
		}
	}

	&:hover .post-title {
		color: var(--c-primary);
	}
}

.no-related-posts {
	padding: 1rem;
	text-align: center;
	color: var(--c-text-3);
}

@media (max-width: 768px) {
	.related-post-item {
		.post-thumbnail {
			width: 100px;
			height: 70px;
		}

		.post-content {
			.post-title {
				font-size: 0.9rem;
			}

			.post-excerpt {
				font-size: 0.75rem;
				-webkit-line-clamp: 1;
			}
		}
	}
}
</style>
