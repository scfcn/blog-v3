<script setup lang="ts">
const props = defineProps<{ to?: string, nofollow?: boolean }>()

const isExternal = ref(false)

onMounted(() => {
	isExternal.value = isExtLink(props.to)
})

const isStaticFile = computed(() => /\.(xml|json|txt|pdf|zip)$/i.test(props.to || ''))
</script>

<template>
<a v-if="to?.startsWith('#')" :href="to"><slot /></a>
<span v-else-if="typeof to === 'undefined'"><slot /></span>
<a v-else-if="isStaticFile" :href="to" :target="isExternal ? '_blank' : undefined" :rel="nofollow ? 'nofollow noopener' : undefined">
	<slot />
</a>
<NuxtLink v-else :to="to" :target="isExternal ? '_blank' : undefined" :rel="nofollow ? 'nofollow noopener' : undefined">
	<slot />
</NuxtLink>
</template>
