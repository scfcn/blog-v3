<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
	{ label: '2025-12-20', value: '博客迁移blog-v3' },
	{ label: '2025-07-13', value: '博客迁移 Typecho，并启用域名 qxzhan.cn' },
	{ label: timeEstablished, value: '发布第一篇文章' },
	{ label: '2024-07-22', value: '启用雾.top及scfc.top，SCFCの博客启航' },
	{ label: '2024-07-10', value: '筹划上线第一个Hexo博客' },
	{ label: '2020-08-24', value: '开始接触互联网' },
]
</script>

<template>
<BlogWidget card title="更新日志">
	<ZDlGroup size="large" :items="blogLog" />
</BlogWidget>
</template>
