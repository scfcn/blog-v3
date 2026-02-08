<script setup lang="ts">
import type ArticleProps from '~/types/article'
import { ZButton } from '#components'

defineOptions({ inheritAttrs: false })

const props = defineProps<ArticleProps>()
const appConfig = useAppConfig()
const { donation } = appConfig
const title = `${props.title} | ${appConfig.title}`
const href = props.path ? new URL(props.path, appConfig.url).href : appConfig.url
const { copy, copied } = useCopy(href)
</script>

<template>
<div class="post-footer">
	<section v-if="references" class="reference">
		<div id="references" class="title text-creative">
			参考链接
		</div>

		<div class="content">
			<ul>
				<li v-for="{ title, link }, i in references" :key="i">
					<ProseA :href="link || ''">
						{{ title ?? link }}
					</ProseA>
				</li>
			</ul>
		</div>
	</section>

	<section class="license">
		<div class="title text-creative">
			许可协议
		</div>

		<div class="content">
			<p>
				本文采用 <ProseA :href="appConfig.copyright.url">
					{{ appConfig.copyright.name }}
				</ProseA>
				许可协议，转载请注明出处。
			</p>
		</div>
	</section>

	<section class="share">
		<div class="title text-creative">
			分享文章
		</div>

		<div class="content">
			<ZButton
				v-tip="'QQ'"
				class="share-button"
				icon="ri:qq-line"
				:to="`https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(title)}&url=${encodeURIComponent(href)}`"
			/>
			<ZButton
				v-tip="'微博'"
				class="share-button"
				icon="ri:weibo-fill"
				:to="`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(href)}`"
			/>
			<ZButton
				v-tip="'邮件'"
				class="share-button"
				icon="ph:envelope-simple-bold"
				:to="`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(href)}`"
			/>
			<ZButton
				v-tip="{
					content: copied ? '已复制链接' : '复制链接',
					hideOnClick: false,
				}"
				class="share-button"
				icon="ph:link"
				@click="copy()"
			/>
			<div class="donate-container">
				<UtilHydrateSafe>
					<Tooltip v-if="donation?.enable" :delay="200" interactive :hide-on-click="false" max-width="">
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
				</UtilHydrateSafe>
			</div>
		</div>
	</section>
</div>
</template>

<style lang="scss" scoped>
.post-footer {
	margin: 2rem 0.5rem;
	border: 1px solid var(--c-border);
	border-radius: 1rem;
	background-color: var(--c-bg-2);
}

section {
	padding: 1rem;

	& + section {
		border-top: 1px solid var(--c-border);
	}
}

.title {
	font-weight: bold;
	color: var(--c-text);
}

.content {
	margin-top: 0.5em;
	font-size: 0.9rem;

	li {
		margin: 0.5em 0;
	}
}

.content {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.donate-container {
	margin-left: auto;
}

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
			object-fit: cover;
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
</style>
