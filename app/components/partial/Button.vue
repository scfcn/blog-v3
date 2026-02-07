<script setup lang="ts">
import { UtilLink } from '#components'

export interface ButtonProps {
	icon?: string
	text?: string
	to?: string
	desc?: string
	primary?: boolean
}
defineProps<ButtonProps>()
</script>

<template>
<component :is="to ? UtilLink : 'button'" :to class="button" :class="{ primary }">
	<div class="button-main">
		<Icon v-if="icon" :name="icon" />
		<slot>{{ text }}</slot>
	</div>
	<div v-if="desc" class="button-desc">
		{{ desc }}
	</div>
</component>
</template>

<style lang="scss" scoped>
.button {
	display: inline-block;
	padding: 0.4em 0.6em;
	border: 1px solid var(--c-bg-soft);
	border-radius: 0.5em;
	box-shadow: 0 2px 0.5em var(--ld-shadow);
	background-color: var(--ld-bg-card);
	line-height: 1.2;
	vertical-align: middle;
	transition: color 0.1s, background-color 0.2s, transform 0.2s, box-shadow 0.2s;
	cursor: pointer;
	position: relative;
	overflow: hidden;

	&.primary {
		background-color: var(--c-primary);
		color: var(--c-bg);
	}

	&:hover {
		background-color: var(--c-bg-2);
		color: var(--c-text);
		transform: translateY(-2px);
		box-shadow: 0 4px 0.8em var(--ld-shadow);
	}

	&:active {
		background-color: var(--ld-shadow);
		transform: translateY(0);
		box-shadow: 0 2px 0.5em var(--ld-shadow);
	}

	&:disabled {
		background-color: var(--c-bg-1);
		color: var(--c-text-3);
		cursor: not-allowed;
		transform: none;
		box-shadow: 0 2px 0.5em var(--ld-shadow);
	}

	& + .button {
		margin-inline-start: 0.8em;
	}
}

.button-main {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.2em;

	> .icon {
		transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	&:hover > .icon {
		transform: scale(1.2);
	}
}

.button-desc {
	font-size: 0.75em;
	text-align: center;
	color: var(--c-text-2);
}
</style>
