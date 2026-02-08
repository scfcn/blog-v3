<script setup lang="ts">
defineProps<{ to?: string, nofollow?: boolean }>()
</script>

<template>
<a v-if="to?.startsWith('#')" :href="to"><slot /></a>
<span v-else-if="typeof to === 'undefined'"><slot /></span>
<NuxtLink v-else :to="to" :target="isExtLink(to) ? '_blank' : undefined" :rel="nofollow ? 'nofollow noopener' : undefined">
	<slot />
</NuxtLink>
</template>
