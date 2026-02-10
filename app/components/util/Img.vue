<script setup lang="ts">
import ImageComponent from '#build/mdc-image-component.mjs'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

const props = withDefaults(defineProps<{
	src: string
	width?: string | number
	height?: string | number
	alt?: string
	mirror?: ImgService
}>(), {
	alt: '',
})

const refinedSrc = ref(props.src)
const referrerPolicy = ref<'no-referrer' | undefined>(undefined)

onMounted(() => {
	let src = props.src
	if (src.startsWith('/') && !src.startsWith('//')) {
		const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
		if (_base !== '/' && !src.startsWith(_base))
			src = joinURL(_base, src)
	}
	if (props.mirror)
		src = getImgUrl(src, props.mirror)
	refinedSrc.value = src
	referrerPolicy.value = props.mirror ? 'no-referrer' : undefined
})
</script>

<template>
<component
	:is="ImageComponent"
	:src="refinedSrc"
	:alt="alt"
	:width="width"
	:height="height"
	:referrerpolicy="referrerPolicy"
/>
</template>
