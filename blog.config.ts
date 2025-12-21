import type { FeedEntry } from './app/types/feed'

const basicConfig = {
	title: '青序栈',
	subtitle: '青序成栈·向简而生',
	// 长 description 利好于 SEO
	description: '青序栈：代码与远方交汇的小站。这里记录网站部署的实战经验、技术学习的点滴思考，也分享旅途中的风景与感悟。欢迎驻足，交换故事。',
	author: {
		name: '筱序二十',
		avatar: 'https://q.qlogo.cn/g?b=qq&nk=2907713872&s=640',
		email: 'qxbk@qq.com',
		homepage: 'https://me.qxzhan.cn/',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: 'https://qxzhan.cn/favicon.ico',
	language: 'zh-CN',
	timeEstablished: '2024-07-18',
	timezone: 'Asia/Shanghai',
	url: 'https://qxzhan.cn/',
	defaultCategory: '未分类',
}

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	article: {
		categories: {
			[basicConfig.defaultCategory]: { icon: 'ph:folder-dotted-bold' },
			技术干货: { icon: 'ph:cpu-bold', color: '#3af' },
			随笔杂谈: { icon: 'ph:pen-nib-bold', color: '#3ba' },
			游览河山: { icon: 'ph:mountains-bold', color: '#f77' },
			学习笔记: { icon: 'ph:notebook-bold', color: '#77f' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 文章版式，首个为默认版式 */
		types: {
			tech: {},
			story: {},
		},
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: ['/preview', '/previews/*'],
	},

	/** 赞赏配置 */
	donation: {
		enable: true,
		message: '感谢您的支持，这将激励我创作更多优质内容！',
		items: {
			支付宝: 'https://image.lolimi.cn/2025/10/07/68e47ecc3e3a9.jpg',
			微信: 'https://image.lolimi.cn/2025/10/07/68e47ecc450c5.png',
		},
	},

	/** 博客 Atom 订阅源 */
	feed: {
		/** 订阅源最大文章数量 */
		limit: 50,
		/** 订阅源是否启用XSLT样式 */
		enableStyle: true,
	},

	/** 向 <head> 中添加脚本 */
	scripts: [
		// 自己部署的 Umami 统计服务
		{ 'src': 'https://um.qxzhan.cn/script.js', 'data-website-id': 'a1997c81-a42b-46f6-8d1d-8fbd67a8ef41', 'defer': true, 'crossorigin': 'anonymous' },
		// Twikoo 评论系统
		{ src: 'https://lib.baomitu.com/twikoo/1.6.44/twikoo.min.js', defer: true, crossorigin: 'anonymous' },
	],

	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: 'https://twikoo.qxzhan.cn/',
		preload: 'https://twikoo.qxzhan.cn/',
	},
}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: '青序栈',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'EdgeOne'],
	date: blogConfig.timeEstablished,
	comment: '栈主本栈啦~',
}

export default blogConfig
