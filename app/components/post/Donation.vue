<script setup lang="ts">
import { ZButton } from '#components'

const { donation } = useAppConfig()
</script>

<template>
<UtilHydrateSafe>
	<div v-if="donation?.enable" class="donation">
		<Tooltip :delay="200" interactive :hide-on-click="false" max-width="">
			<ZButton class="donate-button" icon="ph:heart-fill" text="赞赏作者" />
			<template #content>
				<div class="donation-content">
					<div v-if="Object.keys(donation.items).length" class="donation-list">
						<figure v-for="(image, label) in donation.items" :key="label" class="donation-item">
							<UtilImg class="image" width="160" height="160" :src="image" />
							<figcaption class="label">
								{{ label }}
							</figcaption>
						</figure>
					</div>
					<p v-if="donation.message" class="donation-message">
						{{ donation.message }}
					</p>
				</div>
			</template>
		</Tooltip>
	</div>
</UtilHydrateSafe>
</template>

<style lang="scss" scoped>
.donation {
	display: flex;
	justify-content: center;

	.donate-button {
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--c-border);
		box-shadow: none;
	}

	.donation-content {
		padding: 0.5rem 0.6rem;
		text-align: center;

		.donation-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 1.5rem;
			padding: 0.5rem 0;
		}

		.donation-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;

			.image {
				border-radius: 0.5rem;
			}

			.label {
				color: var(--c-text-2);
			}
		}

		.donation-message {
			color: var(--c-text-1);
		}
	}

	:deep([data-tippy-root]) {
		max-width: calc(100% - 1rem);

		.tippy-box {
			border: 1px solid var(--c-border);
			background-color: var(--c-bg-2);
		}

		.tippy-svg-arrow {
			fill: var(--c-bg-2);
		}
	}
}
</style>
