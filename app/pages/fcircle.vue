<script setup lang="ts">
import { toDate } from 'date-fns-tz'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'blog-log', 'comm-group'])

const title = '朋友圈：发现更多有趣的博主'
const description = '发现更多有趣的博主。'
const image = 'https://s3.qixz.cn/ywty/2026/04/19/69e44192c7c0c.webp'
useSeoMeta({ title, description, ogImage: image })

// 类型定义
interface Article {
	id: string
	title: string
	link: string
	author: string
	created: string
	avatar: string
}

interface UserConfigType {
	api_url: string
	page_size: number
}

// 配置选项
const UserConfig = reactive<UserConfigType>({
	api_url: 'https://fc.qixz.cn/',
	page_size: 20,
})

// 状态管理
const allArticles = ref<Article[]>([])
const displayCount = ref<number>(20)
const isLoading = ref<boolean>(true)
const randomArticle = ref<Article | null>(null)
const showAvatarPopup = ref<boolean>(false)
const selectedAuthor = ref<string>('')
const selectedAuthorAvatar = ref<string>('')
const selectedArticleLink = ref<string>('')
const articlesByAuthor = ref<Record<string, Article[]>>({})
const lastUpdatedDate = ref<string>('')
const errorMessage = ref<string>('')

// 计算属性
const displayedArticles = computed(() => allArticles.value.slice(0, displayCount.value))
const hasMoreArticles = computed(() => allArticles.value.length > displayCount.value)
const selectedAuthorArticles = computed(() => {
	if (!selectedAuthor.value) {
		return []
	}
	return articlesByAuthor.value[selectedAuthor.value] || []
})
const hasSelectedAuthorArticles = computed(() => selectedAuthorArticles.value.length > 0)

// 格式化日期
function formatDate(dateString: string): string {
	if (!dateString)
		return ''

	try {
		const appConfig = useAppConfig()
		return toDate(dateString, { timeZone: appConfig.timezone })
			.toLocaleDateString(undefined, {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			})
			.replace(/\//g, '-')
	}
	catch (error) {
		console.error('日期格式化失败:', error)
		return dateString
	}
}

// 刷新随机文章
function refreshRandomArticle() {
	if (allArticles.value.length > 0) {
		const randomIndex = Math.floor(Math.random() * allArticles.value.length)
		const article = allArticles.value[randomIndex]
		randomArticle.value = article || null
	}
	else {
		randomArticle.value = null
	}
}

// 加载更多
function loadMore() {
	displayCount.value += UserConfig.page_size
}

// 模态框相关
function showAvatarPosts(author: string, avatar: string, articleLink: string) {
	selectedAuthor.value = author
	selectedAuthorAvatar.value = avatar
	selectedArticleLink.value = articleLink
	showAvatarPopup.value = true
}

function closeAvatarPopup() {
	showAvatarPopup.value = false
}

// 监听点击外部关闭弹窗
function handleClickOutside(event: MouseEvent) {
	const popup = document.getElementById('avatar-popup')
	if (popup && event.target instanceof Node && !popup.contains(event.target) && showAvatarPopup.value) {
		closeAvatarPopup()
	}
}

// 获取数据
async function fetchData() {
	try {
		isLoading.value = true
		errorMessage.value = ''
		const response = await fetch(`${UserConfig.api_url}all.json`)

		if (!response.ok) {
			throw new Error(`HTTP错误! 状态码: ${response.status}`)
		}

		const data = await response.json()

		// 验证数据格式
		if (!data || !Array.isArray(data.article_data)) {
			throw new Error('数据格式错误: 缺少article_data数组')
		}

		// 处理数据 - 使用更可靠的ID生成方式
		allArticles.value = data.article_data.map((item: any, index: number) => ({
			id: `${item.link}-${index}-${new Date(item.created).getTime()}`, // 更可靠的唯一ID
			title: item.title || '无标题',
			link: item.link || '#',
			author: item.author || '未知作者',
			created: item.created || new Date().toISOString(),
			avatar: item.avatar || '',
		}))

		// 按作者分组
		articlesByAuthor.value = allArticles.value.reduce((acc: Record<string, Article[]>, article: Article) => {
			const author = article.author
			if (!acc[author]) {
				acc[author] = []
			}
			acc[author].push(article)
			return acc
		}, {})

		// 初始化随机文章
		refreshRandomArticle()

		// 设置最新更新日期
		if (allArticles.value.length > 0) {
			const sortedArticles = [...allArticles.value].sort((a, b) =>
				new Date(b.created).getTime() - new Date(a.created).getTime(),
			)
			if (sortedArticles[0]) {
				lastUpdatedDate.value = formatDate(sortedArticles[0].created)
			}
		}
	}
	catch (error) {
		console.error('加载文章失败:', error)
		errorMessage.value = error instanceof Error ? error.message : '加载文章失败，请稍后重试'
		allArticles.value = [] // 确保错误时文章列表为空
	}
	finally {
		isLoading.value = false
	}
}

// 生命周期钩子
onMounted(() => {
	fetchData()
	document.addEventListener('click', handleClickOutside) // 添加事件监听
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
<ZPageBanner :title :description :image>
	<div class="fcircle-stats">
		<div class="fcircle-stats__update-time">
			Updated at {{ lastUpdatedDate || '2025-07-17' }}
		</div>
		<div class="fcircle-stats__powered-by">
			Powered by FriendCircleLite
		</div>
	</div>
</ZPageBanner>

<div class="page-fcircle">
	<div class="fcircle">
		<!-- 加载指示器 -->
		<div v-if="isLoading" class="loading-container">
			<div class="loading-spinner" />
			<p>加载中...</p>
		</div>

		<!-- 随机文章区域 -->
		<div v-else-if="randomArticle" class="fcircle__random-article">
			<div class="fcircle__random-title">
				随机文章
			</div>
			<div class="article-item">
				<a
					:href="randomArticle.link"
					target="_blank"
					rel="noopener noreferrer"
					class="article-item__container gradient-card"
				>
					<span class="article-item__author">{{ randomArticle.author }}</span>
					<span class="article-item__title">{{ randomArticle.title }}</span>
					<span class="article-item__date">{{ formatDate(randomArticle.created) }}</span>
				</a>
			</div>
			<ZButton
				class="btn-refresh gradient-card"
				icon="uim:process"
				@click="refreshRandomArticle"
			/>
		</div>

		<!-- 文章列表区域 -->
		<div class="fcircle__articles">
			<div
				v-for="(article, index) in displayedArticles"
				:key="article.id"
				class="article-item article-item--new"
				:style="{ '--delay': `${(index % UserConfig.page_size) * 0.05}s` }"
			>
				<div class="article-item__image" @click="showAvatarPosts(article.author, article.avatar, article.link)">
					<NuxtImg
						v-if="article.avatar"
						:src="article.avatar"
						:alt="article.author"
						loading="lazy"
					/>
				</div>
				<a
					:href="article.link"
					target="_blank"
					rel="noopener noreferrer"
					class="article-item__container gradient-card"
				>
					<span class="article-item__author">{{ article.author }}</span>
					<span class="article-item__title">{{ article.title }}</span>
					<span class="article-item__date">{{ formatDate(article.created) }}</span>
				</a>
			</div>
		</div>

		<!-- 加载更多按钮 -->
		<ZButton
			v-show="hasMoreArticles"
			class="btn-load-more gradient-card"
			text="加载更多"
			@click="loadMore"
		/>

		<!-- 空状态和错误状态 -->
		<div v-if="!isLoading && allArticles.length === 0" class="error-container">
			<Icon class="error-container__icon" :name="errorMessage ? 'ph:warning-circle-bold' : 'ph:file-text-bold'" />
			<p>{{ errorMessage || '暂无文章数据' }}</p>
			<p class="empty-hint">
				{{ errorMessage ? '请检查网络连接或稍后再试' : '请稍后再试' }}
			</p>
			<ZButton v-if="errorMessage" class="btn-retry" text="重试" @click="fetchData" />
		</div>

		<!-- 作者模态框 - 时间线样式 -->
		<Transition name="modal">
			<div
				v-if="showAvatarPopup && selectedAuthor"
				id="avatar-popup"
				class="modal"
				@click="closeAvatarPopup"
			>
				<div class="modal__content" @click.stop>
					<div class="modal__header">
						<NuxtImg
							v-if="selectedAuthorAvatar"
							:src="selectedAuthorAvatar"
							:alt="selectedAuthor"
							loading="lazy"
							class="modal__avatar-img"
						/>
						<h3>{{ selectedAuthor }}</h3>
						<a
							:href="selectedArticleLink || '#'"
							target="_blank"
							rel="noopener noreferrer"
							class="modal__author-link"
						>
							<Icon name="lucide:external-link" />
						</a>
					</div>
					<div class="modal__body">
						<div v-if="hasSelectedAuthorArticles" class="timeline">
							<div
								v-for="(article, index) in selectedAuthorArticles.slice(0, 10)"
								:key="article.id"
								class="timeline__item"
								:style="{ '--delay': `${0.2 + index * 0.1}s` }"
							>
								<span class="timeline__date">{{ formatDate(article.created) }}</span>
								<a
									:href="article.link"
									target="_blank"
									rel="noopener noreferrer"
									class="timeline__title"
									@click="closeAvatarPopup"
								>
									{{ article.title }}
								</a>
							</div>
						</div>
						<div v-else class="timeline-empty">
							<p>该作者暂无文章</p>
						</div>
					</div>
					<div class="modal__avatar">
						<NuxtImg
							v-if="selectedAuthorAvatar"
							:src="selectedAuthorAvatar"
							:alt="selectedAuthor"
							loading="lazy"
						/>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</div>
</template>

<style lang="scss" scoped>
/* 动画定义 */
@keyframes pulse-fade {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

@keyframes slide-in-up {
	0% {
		opacity: 0;
		transform: translateY(20px);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 主要样式 */
.page-fcircle {
	margin: 1rem;
	animation: float-in 0.2s backwards;
}

.fcircle-stats {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.1rem;
	opacity: 0.7;
	font-family: var(--font-monospace);
	font-size: 0.7rem;
	text-shadow: 0 4px 5px rgb(0 0 0 / 50%);
	color: #EEE;

	.fcircle-stats__update-time { opacity: 1; }
	.fcircle-stats__powered-by { opacity: 0.8; }
}

.fcircle {
	.fcircle__random-article {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin: 1rem 0;

		.fcircle__random-title {
			font-size: 1.2rem;
			white-space: nowrap;
		}

		.article-item {
			flex: 1;
			min-width: 0;

			.article-item__container {
				min-width: 0;

				.article-item__title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.fcircle__articles {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
}

/* 文章项样式 */
.article-item {
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;

	&.article-item--new { animation: float-in 0.2s var(--delay) backwards; }

	.article-item__image {
		display: flex;
		flex-shrink: 0;
		overflow: hidden;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		box-shadow: 0 0 0 1px var(--c-bg-soft);

		img {
			opacity: 0.8;
			width: 100%;
			height: 100%;
			transition: all 0.2s;
			object-fit: cover;
		}
	}

	.article-item__container {
		display: flex;
		align-items: center;
		gap: 5px;
		overflow: hidden;
		width: 100%;
		height: 2.5rem;
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);

		&:hover .article-item__title { color: var(--c-text); }

		.article-item__author {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			font-size: 0.85rem;
			color: var(--c-text-3);
		}

		.article-item__title {
			display: flex;
			flex: 1;
			align-items: center;
			overflow: hidden;
			font-size: 0.9375rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			color: var(--c-text-2);
			transition: color 0.2s;
		}

		.article-item__date {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			font-family: var(--font-monospace);
			font-size: 0.75rem;
			color: var(--c-text-3);
		}
	}
}

/* 按钮样式 */
.btn-refresh {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 8px;
	box-shadow: none;
	background-color: unset;
	color: var(--c-text-2);
	transition: all 0.2s ease;
	cursor: pointer;

	&:hover {
		background-color: unset;
	}
}

.btn-load-more {
	display: block;
	width: 200px;
	height: 42px;
	margin: 1rem auto;
	padding: 0.75rem;
	border-radius: 8px;
	box-shadow: 0.1em 0.2em 0.5rem var(--ld-shadow);
	background-color: var(--ld-bg-card);
	font-size: 0.875rem;

	&:hover { color: var(--c-text); }
}

/* 模态框样式 */
.modal {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	inset: 0;
	backdrop-filter: blur(20px);
	z-index: 100;

	.modal__content {
		position: relative;
		overflow-y: auto;
		width: 90%;
		max-width: 500px;
		max-height: 80vh;
		padding: 1.25rem;
		border-radius: 12px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		background-color: var(--c-bg-a50);

		.modal__header {
			display: flex;
			align-items: center;
			gap: 15px;
			margin-bottom: 20px;
			padding-bottom: 15px;
			border-bottom: 1px solid var(--c-bg-soft);

			img {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				object-fit: cover;
			}

			h3 {
				flex: 1;
				margin: 0;
				font-size: 1.2rem;
			}

			.modal__author-link {
				padding: 8px;
				border-radius: 8px;
				color: var(--c-text-2);
				transition: all 0.3s;

				&:hover {
					background: var(--c-bg-soft);
					color: var(--c-text);
				}
			}
		}

		.modal__body {
			.timeline {
				position: relative;

				&::after {
					content: "";
					position: absolute;
					top: 0.5rem;
					bottom: 0;
					left: 0.25rem;
					width: 2px;
					background-color: var(--c-bg-soft);
					transform: translate(-50%);
				}

				.timeline__item {
					position: relative;
					padding: 0 0 1rem 1.25rem;
					color: var(--c-text-2);
					animation: float-in 0.3s var(--delay) backwards;

					&::before {
						content: "";
						position: absolute;
						top: 0.5rem;
						left: 0.25rem;
						width: 0.5rem;
						height: 0.5rem;
						border-radius: 50%;
						background-color: var(--c-text-2);
						transform: translateY(-50%) translate(-50%);
						transition: transform 0.3s ease, box-shadow 0.3s ease;
						z-index: 1;
					}

					&:hover::before {
						box-shadow: 0 0 8px var(--c-text-2);
						transform: translateY(-50%) translate(-50%) scale(1.5);
					}

					.timeline__date {
						display: block;
						margin-bottom: 0.3rem;
						font-family: var(--font-monospace);
						font-size: 0.875rem;
						color: var(--c-text-3);
					}

					.timeline__title {
						line-height: 1.4;
						color: var(--c-text-2);
						transition: color 0.3s;

						&:hover { color: var(--c-text); }
					}
				}
			}
		}

		.modal__avatar {
			position: absolute;
			overflow: hidden;
			opacity: 0.6;
			right: 1.25rem;
			bottom: 1.25rem;
			width: 128px;
			height: 128px;
			border-radius: 50%;
			filter: blur(5px);
			pointer-events: none;
			z-index: 1;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
}

/* 模态框过渡 */
.modal-enter-active,
.modal-enter-active .modal__content,
.modal-leave-active,
.modal-leave-active .modal__content {
	transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal__content,
.modal-leave-to .modal__content {
	transform: translateY(-20px);
}

.modal-enter-to,
.modal-leave-from {
	opacity: 1;
}

.modal-enter-to .modal__content,
.modal-leave-from .modal__content {
	transform: translateY(0);
}

/* 错误容器 */
.error-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	height: 400px;
	color: var(--c-text-2);

	.error-container__icon {
		font-size: 4rem;
		color: var(--color-primary);
	}

	p {
		margin: 0.5rem 0;
	}

	.btn-retry {
		margin-top: 1rem;
	}
}

/* 加载容器 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	height: 400px;
	color: var(--c-text-2);
}

.loading-spinner {
	width: 40px;
	height: 40px;
	border: 4px solid rgb(255 255 255 / 30%);
	border-top: 4px solid var(--color-primary);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.empty-hint {
	font-size: 0.9rem;
	color: #BBB;
}

.timeline-empty {
	padding: 2rem;
	font-style: italic;
	text-align: center;
	color: #999;
}

/* 移动端适配 */
@media (max-width: 768px) {
	.fcircle__random-article .fcircle__random-title { display: none; }

	.page-fcircle .article-item .article-item__container {
		flex-wrap: wrap;
		height: auto;
	}

	.page-fcircle .article-item .article-item__container .article-item__author {
		flex-grow: 1;
	}

	.page-fcircle .article-item .article-item__container .article-item__title {
		flex-basis: 100%;
		order: 3;
		white-space: normal;
	}
}
</style>
