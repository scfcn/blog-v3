<script setup lang="ts">
import { useAppConfig } from 'nuxt/app'

const props = defineProps<{
	href: string
	icon?: string
}>()

const appConfig = useAppConfig()
const whitelist = appConfig.component?.externalLink?.whitelist || []

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
	if (!isExternalLink(href) || isInWhitelist(href)) {
		return href
	}
	const encodedUrl = encodeUrl(href)
	return `/go?url=${encodedUrl}`
}

const linkUrl = computed(() => getLinkUrl(props.href))
const icon = computed(() => props.icon || getDomainIcon(props.href))
const tip = computed(() => ({
	content: isExtLink(props.href) ? getDomain(props.href) : decodeURIComponent(props.href),
	inlinePositioning: true,
}))
</script>

<template>
<UtilLink v-tip="tip" class="z-link" :to="linkUrl">
	<Icon v-if="icon" class="domain-icon" :name="icon" />
	<slot />
</UtilLink>
</template>

<style lang="scss" scoped>
.z-link[href] {
	margin: -0.1em -0.2em;
	padding: 0.1em 0.2em;
	background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
	color: var(--c-primary);
	transition: all 0.2s;

	&:hover {
		border-radius: 0.3em;
		background-size: 100% 100%;
	}

	.domain-icon {
		margin-inline-end: 0.1em;
	}
}
</style>
