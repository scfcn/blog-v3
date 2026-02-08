<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
<footer class="blog-footer">
	<nav class="footer-nav">
		<div v-for="(group, groupIndex) in appConfig.footer.nav" :key="groupIndex" class="footer-nav-group">
			<h3 v-if="group.title">
				{{ group.title }}
			</h3>
			<menu>
				<li v-for="(item, itemIndex) in group.items" :key="itemIndex">
					<UtilLink :to="item.url">
						<Icon :name="item.icon" />
						<span class="nav-text">{{ item.text }}</span>
					</UtilLink>
				</li>
			</menu>
		</div>
	</nav>
	<div class="footer-bottom">
		<p v-html="appConfig.footer.copyright" />
		<ClientOnly>
			<template #fallback>
				<span class="uptime-status unknown">
					<Icon name="ph:question-bold" />
					<span class="status-text">加载中...</span>
				</span>
			</template>
			<UtilUptimeStatus />
		</ClientOnly>
	</div>
</footer>
</template>

<style lang="scss" scoped>
.blog-footer {
	margin: 3rem 1rem;
	font-size: 0.9em;
	color: var(--c-text-2);

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 5vw clamp(2rem, 5%, 5vw);
		padding-block: 3rem;

		h3 {
			margin: 0.5em;
			font: inherit;
		}

		a {
			display: flex;
			align-items: center;
			gap: 0.3em;
			width: fit-content;
			padding: 0.3em 0.5em;
			border-radius: 0.5em;
			font-size: 0.9em;
			transition: background-color 0.2s, color 0.1s;

			&:hover {
				background-color: var(--c-bg-soft);
				color: var(--c-text);
			}
		}
	}

	.footer-bottom {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;
		flex-wrap: wrap;

		p {
			margin: 0.5em;
		}
	}
}
</style>
