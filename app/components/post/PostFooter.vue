<script setup lang="ts">
import type ArticleProps from '~/types/article'

defineOptions({ inheritAttrs: false })

const props = defineProps<ArticleProps>()
const appConfig = useAppConfig()
const title = `${props.title} | ${appConfig.title}`
const href = new URL(props.path!, appConfig.url).href
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

.share-button {
	display: inline-flex;
	aspect-ratio: 1;
	border: 1px solid var(--c-border);
	border-radius: 50%;
	box-shadow: none;
}
</style>
