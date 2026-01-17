<script setup lang="ts">
import { useAppConfig } from 'nuxt/app'
// 即使 boolean 可选，其值也不会是 undefined
const props = defineProps<{
	img?: string
	text?: string
	link?: string
	round?: boolean
	square?: boolean
}>()

const appConfig = useAppConfig()
const whitelist = appConfig.component?.externalLink?.whitelist || []

function isExternalLink(url: string): boolean {
	try {
		const urlObj = new URL(url, window.location.origin)
		const currentHost = window.location.hostname
		return urlObj.hostname !== currentHost
	} catch {
		return false
	}
}

function isInWhitelist(url: string): boolean {
	try {
		const urlObj = new URL(url, window.location.origin)
		return whitelist.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`))
	} catch {
		return false
	}
}

function encodeUrl(url: string): string {
	try {
		return btoa(encodeURIComponent(url))
	} catch {
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

const linkUrl = computed(() => getLinkUrl(props.link || ''))

const img = computed(() => {
	if (props.img)
		return props.img
	const ghUsername = getGhUsername(props.link)
	if (ghUsername)
		return getGhAvatar(ghUsername)
	if (props.link && isExtLink(props.link))
		return getFavicon(getDomain(props.link))
	return ''
})

// 有图时默认为圆形样式，除非指定为方形
// 无图时默认为方形样式，除非指定为圆形
const round = computed(() => img.value ? !props.square : props.round)

const tip = computed(() => {
	if (!props.link)
		return ''
	if (isExtLink(props.link))
		return getDomain(props.link)
	return decodeURIComponent(props.link)
})
</script>

<template>
<UtilLink v-tip="tip" class="badge" :class="{ round }" :to="linkUrl">
	<NuxtImg v-if="img" class="badge-icon" :src="img" :alt="img" />
	<span class="badge-text">
		<slot>{{ text }}</slot>
	</span>
</UtilLink>
</template>

<style lang="scss" scoped>
// 对齐到基线，同时保持图片垂直居中
.badge {
	display: inline-flex;
	align-items: baseline;
	margin: 0.1em;
	border: 1px solid var(--c-border);
	border-radius: 4px;
	box-sizing: content-box;
	background-color: var(--c-bg-2);
	font-size: 0.875em;
	transition: color 0.2s;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		border-color: color-mix(in srgb, currentcolor 10%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
		color: color-mix(in srgb, currentcolor 80%, transparent);
	}

	&[href]:hover {
		color: var(--c-text);
	}

	&.round, &.round > .badge-icon {
		border-radius: 0.8em;
	}
}

.badge-icon {
	align-self: normal;
	height: 1.6em;
	border-radius: 3.5px;

	+ .badge-text {
		margin-inline-start: -0.1em;
	}
}

.badge-text {
	padding: 0.2em 0.4em;
	line-height: 1.2;

	&:empty {
		display: none;
	}
}
</style>
