<script setup lang="ts">
const props = defineProps<{ to?: string, nofollow?: boolean }>()

const isExternal = ref(false)

onMounted(() => {
	isExternal.value = isExtLink(props.to)
})
</script>

<template>
<a v-if="to?.startsWith('#')" :href="to"><slot /></a>
<span v-else-if="typeof to === 'undefined'"><slot /></span>
<NuxtLink v-else :to="to" :target="isExternal ? '_blank' : undefined" :rel="nofollow ? 'nofollow noopener' : undefined">
	<slot />
</NuxtLink>
</template>
