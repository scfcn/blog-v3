<script setup lang="ts">
const externalLinkStore = useExternalLinkStore()
const { state } = storeToRefs(externalLinkStore)
const route = useRoute()

const displayUrl = computed(() => {
	try {
		const urlObj = new URL(state.value.url || '')
		return urlObj.hostname
	}
	catch {
		return state.value.url || ''
	}
})

const position = computed(() => {
	if (!state.value.linkRect)
		return {}

	const popoverWidth = 280
	const popoverHeight = 50

	let top = state.value.linkRect.bottom + 8
	let left = state.value.linkRect.left + state.value.linkRect.width / 2 - popoverWidth / 2

	if (left < 8)
		left = 8
	if (left + popoverWidth > window.innerWidth - 8)
		left = window.innerWidth - popoverWidth - 8

	if (top + popoverHeight > window.innerHeight - 8)
		top = state.value.linkRect.top - popoverHeight - 8

	return {
		top: `${top}px`,
		left: `${left}px`,
	}
})

useEventListener('keydown', (e) => {
	if (state.value.show && e.key === 'Escape') {
		e.preventDefault()
		externalLinkStore.close()
	}
})

watch(() => route.path, () => {
	externalLinkStore.close()
})

useEventListener('scroll', () => {
	if (state.value.show) {
		externalLinkStore.close()
	}
}, { passive: true })
</script>

<template>
<Teleport to="body">
	<Transition>
		<div v-if="state.show" class="external-popover" :style="position">
			<span class="popover-text">
				<Icon name="ph:link-bold" class="link-icon" />
				<span class="domain">{{ displayUrl }}</span>
			</span>
			<div class="popover-actions">
				<button class="btn-cancel" @click="externalLinkStore.close">
					取消
				</button>
				<button class="btn-confirm" @click="externalLinkStore.confirm">
					前往
				</button>
			</div>
		</div>
	</Transition>
</Teleport>
</template>

<style lang="scss" scoped>
.external-popover {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	position: fixed;
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
	box-shadow: 0 0.25em 0.75em var(--ld-shadow), 0 0 0 1px var(--c-border);
	background-color: var(--ld-bg-card);
	font-size: 0.875rem;
	white-space: nowrap;
	z-index: 9998;
}

.popover-text {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	color: var(--c-text-1);

	.link-icon {
		flex-shrink: 0;
		width: 1em;
		height: 1em;
		color: var(--c-text-2);
	}

	.domain {
		overflow: hidden;
		max-width: 10em;
		font-family: var(--font-monospace);
		text-overflow: ellipsis;
	}
}

.popover-actions {
	display: flex;
	gap: 0.25rem;
	margin-inline-start: auto;

	button {
		padding: 0.25rem 0.6rem;
		border-radius: 0.25rem;
		font-size: 0.8rem;
		transition: all 0.15s;
		cursor: pointer;
	}

	.btn-cancel {
		border: 1px solid var(--c-border);
		background-color: var(--c-bg-2);
		color: var(--c-text-1);

		&:hover {
			background-color: var(--c-bg-3);
		}
	}

	.btn-confirm {
		border: 1px solid var(--c-primary);
		background-color: var(--c-primary);
		color: white;

		&:hover {
			border-color: var(--c-primary-soft);
			background-color: var(--c-primary-soft);
		}
	}
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

.v-enter-active,
.v-leave-active {
	transition: all 0.15s ease;
}
</style>
