<!-- SSG 下让客户端抛弃预渲染结果重新 CSR -->
<template>
<ClientOnly>
	<slot />

	<template #fallback>
		<!-- 空的fallback，避免服务器端渲染与客户端渲染不一致 -->
	</template>
</ClientOnly>
</template>
