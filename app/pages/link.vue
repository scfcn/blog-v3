<script setup lang="ts">
import blogConfig, { myFeed } from '~~/blog.config'
import feeds from '~/feeds'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside([])

const { data: postLink } = await useAsyncData(
	'/link',
	() => queryCollection('content').path('/link').first(),
)

useSeoMeta({
	title: '友链：收集了添加他为友链的网站和他订阅的网站列表',
	ogType: 'profile',
	description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})

const copyFields = {
	博主: myFeed.author,
	标题: myFeed.title,
	介绍: myFeed.desc,
	网址: myFeed.link,
	头像: myFeed.avatar,
}

const githubIssueUrl = computed(() => {
	if (!blogConfig.github?.repo)
		return null
	return `https://github.com/${blogConfig.github.repo}/issues/new?labels=friend-link/add&template=friend-link.yml&title=%E5%8F%8B%E9%93%BE%E7%94%B3%E8%AF%B7%3A+`
})
</script>

<template>
<div class="mobile-only">
	<BlogHeader to="/" suffix="友链" tag="h1" />
</div>

<FeedGroup
	v-for="group in feeds"
	:key="group.name"
	v-bind="group"
	:shuffle="appConfig.link.randomInGroup"
/>

<Tab :tabs="['我的博客信息', '申请友链']" center>
	<template #tab1>
		<div class="link-tab">
			<FeedCard v-bind="myFeed" />
			<Copy v-for="(code, prompt) in copyFields" :key="prompt" :prompt :code />
		</div>
	</template>
	<template #tab2>
		<div class="link-tab">
			<div v-if="githubIssueUrl" class="apply-section">
				<p class="apply-hint">
					欢迎通过以下方式申请友链：
				</p>
				<a
					:href="githubIssueUrl"
					target="_blank"
					rel="noopener noreferrer"
					class="github-issue-btn"
				>
					<span class="iconify" data-icon="mdi:github" />
					<span>GitHub Issue 申请</span>
				</a>
			</div>
			<ContentRenderer
				v-if="postLink"
				:value="postLink"
				class="article"
			/>
			<p v-else class="text-center">
				可于 link.md 配置友链补充说明。
			</p>
		</div>
	</template>
</Tab>

<PostComment />
</template>

<style lang="scss" scoped>
.link-tab {
	margin: 1rem;
}

.apply-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 1rem;
	padding: 1.5rem;
	border: 1px solid var(--border-color, #E9ECEF);
	border-radius: 12px;
	background: var(--card-bg, #F8F9FA);
}

.apply-hint {
	margin: 0 0 1rem;
	font-size: 0.9rem;
	color: var(--text-secondary, #6C757D);
}

.github-issue-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
	background: linear-gradient(135deg, #24292E 0%, #1A1E22 100%);
	font-size: 0.95rem;
	font-weight: 500;
	text-decoration: none;
	color: #FFF;
	transition: all 0.3s ease;

	&:hover {
		box-shadow: 0 4px 16px rgb(0 0 0 / 25%);
		background: linear-gradient(135deg, #2F363D 0%, #24292E 100%);
		color: #FFF;
		transform: translateY(-2px);
	}

	.iconify {
		font-size: 1.25rem;
	}
}

:global(.dark) {
	.apply-section {
		border-color: var(--border-color, #333);
		background: var(--card-bg, #1E1E1E);
	}

	.apply-hint {
		color: var(--text-secondary, #999);
	}
}
</style>
