#!/usr/bin/env ts-node

import fs from 'node:fs'
import path from 'node:path'

// 定义必要的接口
export interface Friend {
	title: string
	desc: string
	link: string
	avatar: string
}

interface FeedEntry {
	author: string
	sitenick?: string
	title?: string
	link: string
	avatar: string
	error?: string
}

interface FeedGroup {
	entries: FeedEntry[]
}

// 模拟各类头像获取函数
function mockGetGhAvatar(name: string, { size = 92, mask } = {}) {
	return `https://wsrv.nl/?url=github.com/${name}.png?size=${size}${mask ? '&mask=circle' : ''}`
}

const mockGetGhIcon = (name: string) => mockGetGhAvatar(name, { size: 32, mask: 'circle' })

function mockGetQqAvatar(qq: string, size = 140) {
	return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`
}

function mockGetFavicon(domain: string, { provider = 'google', size = 32 } = {}) {
	return `https://unavatar.webp.se/${provider}/${domain}?w=${size}`
}

// 从feeds.ts生成friend.json
export function generateFcircleJson() {
	// 不想订阅的友链
	const blacklist = ['名称1', '名称2']

	const __dirname = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname))
	const feedsPath = path.resolve(__dirname, '../app/feeds.ts')
	const outputPath = path.resolve(__dirname, '../public/friend.json')

	try {
		// 读取并提取feeds.ts中的数组内容
		const content = fs.readFileSync(feedsPath, 'utf-8')
		const startIndex = content.indexOf('export default [')
		const endIndex = content.lastIndexOf(']')

		if (startIndex === -1 || endIndex === -1) {
			throw new Error('无法找到feeds.ts中的默认导出数组')
		}

		// 处理数组内容，替换函数调用为模拟结果
		const arrayContent = content.substring(startIndex + 15, endIndex + 1)
			.replace(/\s+satisfies\s+[^\s;]+/g, '')
			.replace(/getGhAvatar\('([^']+)'\)(?:\s*,\s*\{[^}]+\})?/g, (_, name) => `"${mockGetGhAvatar(name)}"`)
			.replace(/getGhIcon\('([^']+)'\)/g, (_, name) => `"${mockGetGhIcon(name)}"`)
			.replace(/getQqAvatar\('([^']+)'\)(?:\s*,[^)]+)?/g, (_, qq) => `"${mockGetQqAvatar(qq)}"`)
			.replace(/getFavicon\('([^']+)'\)(?:\s*,\s*\{[^}]+\})?/g, (_, domain) => `"${mockGetFavicon(domain)}"`)
			.replace(/QqAvatarSize\.Size\d+/g, '140')

		// 解析feed组数据
		const feedGroups: FeedGroup[] = eval(`(${arrayContent})`)

		// 提取有效友链数据
		const friends = feedGroups.flatMap(group =>
			group.entries
				.filter(entry => !entry.error) // 跳过有错误的条目
				.map((entry) => {
					const siteName = entry.title || entry.sitenick || entry.author
					// 跳过黑名单站点
					if (blacklist.includes(siteName)) {
						console.log(`跳过黑名单站点: ${siteName}`)
						return null
					}
					return [siteName, entry.link, entry.avatar]
				})
				.filter(Boolean) as [string, string, string][],
		)

		// 确保public目录存在并写入文件
		const publicDir = path.resolve(__dirname, '../public')
		if (!fs.existsSync(publicDir))
			fs.mkdirSync(publicDir, { recursive: true })

		const friendData = { friends }
		fs.writeFileSync(outputPath, JSON.stringify(friendData, null, 2), 'utf-8')

		console.log(`成功生成friend.json文件，共${friends.length}个友链`)
		console.log(`文件路径: ${outputPath}`)

		return friendData
	}
	catch (error) {
		console.error('生成friend.json时出错:', error instanceof Error ? error.message : String(error))
		process.exit(1)
	}
}

// 直接运行时执行
if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
	generateFcircleJson()
}
