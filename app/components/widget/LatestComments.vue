<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Twikoo配置
const TWIKOO_URL = 'https://twikoo.qxzhan.cn'
const ADMIN_MAIL_MD5 = '363633a813a34ce39db7bc1139bc46bea134ef571e6ad20d32d309ff3a3c2c2d'

// 评论数据类型定义
interface Comment {
	id: string
	content: string
	author: string
	date: string
	avatar: string
	isAdmin: boolean
	url: string
}

interface LatestCommentsState {
	comments: Comment[]
	loading: boolean
	error: boolean
	lastFetchTime: number
}

// 评论数据状态
const latestComments = ref<LatestCommentsState>({
	comments: [],
	loading: true,
	error: false,
	lastFetchTime: 0,
})

const comments = computed(() => latestComments.value.comments)
const loading = computed(() => latestComments.value.loading)
const error = computed(() => latestComments.value.error)

// 时间单位类型定义
interface TimeUnit {
	max: number
	div?: number
	unit?: string
	text?: string
}

// 格式化时间
function formatTime(timestamp: number): string {
	const now = Date.now()
	const diffSeconds = Math.floor((now - timestamp) / 1000)
	const timeUnits: TimeUnit[] = [
		{ max: 60, text: '刚刚' },
		{ max: 3600, div: 60, unit: '分钟前' },
		{ max: 86400, div: 3600, unit: '小时前' },
		{ max: 604800, div: 86400, unit: '天前' },
	]

	const unit = timeUnits.find(u => diffSeconds < u.max)
	if (unit) {
		if (unit.div && unit.unit) {
			return `${Math.floor(diffSeconds / unit.div)}${unit.unit}`
		}
		if (unit.text) {
			return unit.text
		}
	}

	return new Intl.DateTimeFormat('zh-CN', {
		month: 'numeric',
		day: 'numeric',
	}).format(timestamp)
}

// 清理评论内容，移除HTML标签
function cleanContent(content: string): string {
	if (!content)
		return ''

	const replacements: [RegExp, string][] = [
		[/<pre><code>[\s\S]*?<\/code><\/pre>/g, '[代码块]'],
		[/<code>([^<]{4,})<\/code>/g, '[代码]'],
		[/<code>([^<]{1,3})<\/code>/g, '$1'],
		[/<img(?![^>]*class="tk-owo-emotion")[^>]*>/g, '[图片]'],
		[/<a[^>]*>[\s\S]*?<\/a>/g, '[链接]'],
		[/<(?!img[^>]*class="tk-owo-emotion")[^>]+>/g, ''],
	]

	return replacements.reduce((text, [regex, replacement]) =>
		text.replace(regex, replacement), content).trim()
}

// 获取最新评论
async function fetchLatestComments() {
	const now = Date.now()
	// 10分钟内不重复请求
	if (now - latestComments.value.lastFetchTime < 10 * 60 * 1000) {
		return
	}

	try {
		latestComments.value.loading = true
		latestComments.value.error = false

		// 使用 AbortController 实现超时机制
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000)

		const response = await fetch(TWIKOO_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				event: 'GET_RECENT_COMMENTS',
				includeReply: true,
				pageSize: 10,
			}),
			signal: controller.signal,
		})

		clearTimeout(timeoutId)

		const data = await response.json()

		if (!data.data) {
			throw new Error('No data')
		}

		// 处理评论数据
		latestComments.value.comments = data.data
			.filter((comment: any) => comment.url !== '/')
			.slice(0, 5)
			.map((comment: any) => ({
				content: cleanContent(comment.comment),
				author: comment.nick,
				date: formatTime(comment.created),
				avatar: comment.avatar,
				isAdmin: comment.mailMd5 === ADMIN_MAIL_MD5,
				url: comment.url,
				id: comment.id,
			}))

		latestComments.value.lastFetchTime = now
	}
	catch (err) {
		console.error('Failed to fetch comments:', err)
		latestComments.value.error = true
	}
	finally {
		latestComments.value.loading = false
	}
}

// 导航到评论
function navigateToComment(comment: any) {
	window.open(`${comment.url}#${comment.id}`, '_self')
}

// 生命周期钩子
let interval: number | null = null

onMounted(() => {
	fetchLatestComments()
	// 每10分钟刷新一次
	interval = window.setInterval(fetchLatestComments, 10 * 60 * 1000)
})

onUnmounted(() => {
	if (interval) {
		clearInterval(interval)
	}
})
</script>

<template>
<BlogWidget card title="最新评论">
	<div class="comments-container">
		<transition name="fade" mode="out-in">
			<template v-if="loading">
				<div class="loading">
					<div class="loading-spinner" />
					<p>加载中...</p>
				</div>
			</template>

			<template v-else-if="error">
				<div class="error">
					<span class="error-icon">⚠️</span>
					<span>评论加载失败</span>
				</div>
			</template>

			<template v-else>
				<ul class="comments-list">
					<li
						v-for="comment in comments"
						:key="comment.id"
						class="comment-item"
						@click="navigateToComment(comment)"
					>
						<div class="comment-meta">
							<div class="author-info">
								<img :src="comment.avatar" :alt="comment.author" class="avatar">
								<span class="author">{{ comment.author }}</span>
								<Icon v-if="comment.isAdmin" class="admin-badge" name="i-material-symbols:verified" />
							</div>
							<time class="date">{{ comment.date }}</time>
						</div>
						<p class="comment-content" :innerHTML="comment.content" title="点击查看完整评论" />
					</li>
				</ul>
			</template>
		</transition>
	</div>
</BlogWidget>
</template>

<style lang="scss" scoped>
.comments-container {
	position: relative;
	min-height: 343px;
}

.loading,
.error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	position: absolute;
	inset: 0;
	text-align: center;
	color: var(--c-text-2);
}

.loading-spinner {
	width: 40px;
	height: 40px;
	margin: 0 auto 0.5rem;
	border: 3px solid var(--c-bg-3);
	border-top-color: var(--c-primary);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.error-icon {
	font-size: 3rem;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.comments-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.comment-item {
	padding: 0.5rem 0;
	border-bottom: 1px solid var(--c-border);
	cursor: pointer;

	&:last-child {
		border-bottom: none;
	}
}

.comment-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.3rem;
	font-size: 0.8em;
	color: var(--c-text-2);
}

.author-info {
	display: flex;
	align-items: center;
	gap: 6px;
}

.avatar {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	object-fit: cover;
}

.author {
	font-weight: 500;
	color: var(--c-text-1);
}

.admin-badge {
	font-size: 1.1em;
	color: var(--c-primary);
}

.date {
	color: var(--c-text-3);
}

.comment-content {
	overflow: hidden;
	margin: 0;
	padding: 6px 10px;
	border-radius: 4px;
	background-color: var(--c-bg-1);
	font-size: 0.9em;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--c-text-2);
	transition: color 0.2s;

	&:hover {
		color: var(--c-text-1);
	}

	img.tk-owo-emotion {
		width: 16px;
		height: 16px;
		margin: 0 5px;
		vertical-align: text-bottom;
	}
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
