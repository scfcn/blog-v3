import type { Nav, NavItem } from '~/types/nav'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'

// 图标查询：https://yesicon.app/ph?s=bold
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,

	component: {
		alert: {
			/** 默认使用卡片风格还是扁平风格 */
			defaultStyle: 'card' as 'card' | 'flat',
		},

		/** 外链安全提示 */
		externalLink: {
		/** 是否启用外链安全提示 */
		enabled: true,
		/** 白名单域名，这些域名不会触发安全提示 */
		whitelist: [
			'qixz.cn',
			'localhost',
			'wudu.ltd',
			'xnet.ren',
			'github.com',
			'qq.com',
			'travellings.cn',
			'jiuchan.org',
			'blogscn.fun',
			'blogsclub.org',
		],
		/** 强制跳转页面，支持字符串路径或正则表达式，这些页面会启用外链安全提示 */
		pageWhitelist: [],
		/** 禁用跳转页面，支持字符串路径或正则表达式，这些页面会禁用外链安全提示 */
		pageBlacklist: [/link/],
		/** 跳转提示页面配置 */
		go: {
			/** 跳转倒计时秒数 */
			countdown: 5,
			/** 页面标题 */
			title: '跳转提示',
			/** 错误状态文本 */
			errorText: {
				invalidLink: '链接无效',
				decodeFailed: '链接解码失败',
				missingParam: '缺少链接参数',
			},
			/** 正常状态文本 */
			normalText: {
				leaving: '安全提醒',
				description: '您正在离开本站点',
				countingDown: '自动跳转中...',
				cancel: '取消',
				jumpNow: '立即跳转',
			},
		},
	},

		codeblock: {
			/** 代码块触发折叠的行数 */
			triggerRows: 32,
			/** 代码块折叠后的行数 */
			collapsedRows: 16,
			/** 启用代码块缩进导航会关闭空格渲染 */
			enableIndentGuide: true,
			/** 代码块缩进导航(Indent Guige)竖线匹配空格数 */
			indent: 4,
			/** tab渲染宽度 */
			tabSize: 3,
		},

		/** 文章开头摘要 */
		excerpt: {
			animation: false,
			caret: '_',
		},

		stats: {
			/** 归档页面每年标题对应的年龄 */
			birthYear: 2010,
			/** blog-stats widget 的预置文本 */
			wordCount: '约10万',
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: `© ${new Date().getFullYear()} ${blogConfig.author.name}`,
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '个人主页', url: blogConfig.author.homepage },
			{ icon: 'ri:qq-line', text: '交流群: 665751334', url: 'https://qm.qq.com/q/veCtZrS51e' },
			{ icon: 'ph:github-logo-bold', text: 'GitHub: scfcn', url: 'https://github.com/scfcn' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/plain.html' },
		] satisfies NavItem[],
		/** 页脚站点地图 */
		nav: [
			{
				title: '探索',
				items: [
					{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/plain.html' },
					{ icon: 'ph:bug-droid-bold', text: '揪蝉', url: 'https://www.jiuchan.org/' },
					{ icon: 'streamline-ultimate-color:blogger-logo', text: 'BlogsClub', url: 'https://www.blogsclub.org/' },
					{ icon: 'logos:blogger', text: '笔墨迹', url: 'https://blogscn.fun/' }
				],
			},
			{
				title: '社交',
				items: [
					{ icon: 'ph:github-logo-bold', text: 'scfcn', url: 'https://github.com/scfcn' },
					{ icon: 'ri:qq-line', text: '群: 665751334', url: 'https://qm.qq.com/q/veCtZrS51e' },
					{ icon: 'ph:envelope-simple-bold', text: blogConfig.author.email, url: `mailto:${blogConfig.author.email}` },
					{ icon: 'ph:telegram-logo-bold', text: 'TG群组', url: 'https://t.me/qxzhan' },
				],
			},
			{
				title: '信息',
				items: [
					{ icon: 'simple-icons:nuxtdotjs', text: `主题: Clarity ${version}`, url: 'https://github.com/L33Z22L11/blog-v3' },
					{ icon: 'ph:swatches-bold', text: '主题和组件文档', url: '/theme' },
					{ icon: 'ph:copyright-bold', text: '版权信息', url: '/copyright' },
					{ icon: 'ph:file-text-bold', text: '隐私协议', url: '/privacy' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: blogConfig.author.avatar,
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['🌞', '🤫', '🕊️', '🎍', '👋🏻'],
	},

	/** 友链页面 */
	link: {
		/** 无订阅源展示静音图标 */
		remindNoFeed: true,
		/** 友链分组内随机排序 */
		randomInGroup: false,
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '文章', url: '/' },
				{ icon: 'ph:archive-bold', text: '归档', url: '/archive' },
				{ icon: 'ph:tag-bold', text: '标签', url: '/tags' },
				{ icon: 'ph:link-bold', text: '友链', url: '/link' },
				{ icon: 'ph:fish-bold', text: '鱼塘', url: '/fcircle' },
				{ icon: 'ph:chat-centered-dots-bold', text: '即刻', url: '/essay' },
				{ icon: 'ph:laptop-bold', text: '装备', url: '/devices' },
				{ icon: 'ri:bilibili-fill', text: '追番', url: '/bangumi' },
			],
		},
	] satisfies Nav,

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as keyof typeof blogConfig.article.order,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	themes: {
		light: {
			icon: 'ph:sun-bold',
			tip: '浅色模式',
		},
		system: {
			icon: 'ph:monitor-bold',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ph:moon-bold',
			tip: '深色模式',
		},
	},
})
