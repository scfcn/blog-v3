<script setup lang="ts">
import { useAppConfig } from 'nuxt/app'

const props = defineProps<{
	link: string
	title: string
	description?: string
	icon?: string
	mirror?: ImgService
}>()

const appConfig = useAppConfig()
const whitelist = appConfig.component?.externalLink?.whitelist || []

const linkUrl = ref(props.link)

onMounted(() => {
	function isExternalLink(url: string): boolean {
		try {
			const urlObj = new URL(url, window.location.origin)
			const currentHost = window.location.hostname
			return urlObj.hostname !== currentHost
		}
		catch {
			return false
		}
	}

	function isInWhitelist(url: string): boolean {
		try {
			const urlObj = new URL(url, window.location.origin)
			return whitelist.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`))
		}
		catch {
			return false
		}
	}

	function encodeUrl(url: string): string {
		try {
			return btoa(encodeURIComponent(url))
		}
		catch {
			return encodeURIComponent(url)
		}
	}

	function getLinkUrl(href: string): string {
		if (!href || !isExternalLink(href) || isInWhitelist(href)) {
			return href
		}
		const encodedUrl = encodeUrl(href)
		return `/go?url=${encodedUrl}`
	}

	linkUrl.value = getLinkUrl(props.link)
})
</script>

<template>
<UtilLink :to="linkUrl" class="link-card card" :title="joinWith([title, description, link])">
	<div class="link-card-info">
		<div class="link-card-title">
			{{ title }}
		</div>
		<div class="link-card-description">
			{{ description ?? getDomain(link) }}
		</div>
	</div>
	<slot name="icon" class="link-card-icon-slot">
		<UtilImg v-if="icon" class="link-card-icon" :src="icon" :mirror />
	</slot>
</UtilLink>
</template>

<style lang="scss" scoped>
.link-card {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 20rem;
	max-width: 90%;
	margin: 2rem auto;
	padding: 0.5em 0.8em;
	font-size: 0.9em;
	line-height: 1.4;

	// 溢出显示省略号
	.link-card-info {
		flex-grow: 1;
		overflow: hidden;
	}

	.link-card-title {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	// 内部需要是块元素
	.link-card-description {
		overflow: hidden;
		opacity: 0.5;
		margin-top: 0.2em;
		font-size: 0.9em;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.link-card-icon {
		flex-shrink: 0;
		height: 3rem;
		max-width: 5rem;
		border-radius: 0.5rem;
		object-fit: cover;
	}
}
</style>
