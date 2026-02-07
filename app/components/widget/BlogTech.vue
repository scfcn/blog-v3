<script setup lang="ts">
import { packageManager, version } from '~~/package.json'
import pnpmWorkspace from '~~/pnpm-workspace.yaml'

const appConfig = useAppConfig()
const { public: { arch, ci, nodeVersion, platform } } = useRuntimeConfig()

const packages = Object.assign({}, ...Object.values(pnpmWorkspace.catalogs as any)) as Record<string, string>
const [pm, pmVersion] = packageManager.split('@') as [string, string]

const service = computed(() => ([
	{ label: '全球加速', value: () => [h('img', { src: 'https://i.p-i.vip/135/20260207-6986bf2082a42.webp', alt: 'EdgeOne' }), 'EdgeOne'] },
	{ label: '构建平台', value: () => [h('img', { src: 'https://i.p-i.vip/135/20260207-6986be1f61735.webp', alt: 'ESA Pages' }), 'ESA Pages'] },
	{ label: '图片存储', value: () => [h('img', { src: 'https://i.p-i.vip/135/20260117-696b7c21a3374.png', alt: 'baiwulin' }), '白雾林'] },
	{ label: '文章许可', value: appConfig.copyright.abbr },
	{ label: '规范域名', value: getDomain(appConfig.url) },
]))

const techstack = computed(() => ([
	{ label: 'Blog', value: version },
	{ label: 'Vue', value: packages.vue },
	{ label: 'Nuxt', value: packages.nuxt },
	{ label: 'Content', value: packages['@nuxt/content'] },
	{ label: 'Node', value: nodeVersion },
	{ label: pm, value: pmVersion },
	{ label: 'OS', value: platform },
	{ label: 'Arch', value: arch },
]))

const expand = ref(false)
</script>

<template>
<BlogWidget card title="技术信息">
	<ZDlGroup :items="service" />
	<ZExpand v-model="expand" in-place name="构建信息">
		<ZDlGroup size="small" :items="techstack" />
	</ZExpand>
</BlogWidget>
</template>

<style lang="scss" scoped>
.z-expand {
	margin-top: 0.2em;
}

.dl-group :deep(img) {
	height: 1.2em;
	vertical-align: sub;
}
</style>
