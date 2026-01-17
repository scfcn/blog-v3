interface ExternalLinkOptions {
	whitelist?: string[]
	enabled?: boolean
	/** 页面白名单，支持指定页面路径或正则表达式 */
	pageWhitelist?: (string | RegExp)[]
	/** 页面黑名单，支持指定页面路径或正则表达式 */
	pageBlacklist?: (string | RegExp)[]
}

const defaultWhitelist = [
	'qixz.cn',
	'localhost',
]

let ExternalLinkDialog: any

async function getExternalLinkDialog() {
	if (!ExternalLinkDialog) {
		const module = await import('~/components/util/ExternalLinkDialog.vue')
		ExternalLinkDialog = module.default || module
	}
	return ExternalLinkDialog
}

export function useExternalLink(options: ExternalLinkOptions = {}) {
	const appConfig = useAppConfig()
	const {
		whitelist = appConfig.component?.externalLink?.whitelist ?? defaultWhitelist,
		enabled = appConfig.component?.externalLink?.enabled ?? true,
		pageWhitelist = appConfig.component?.externalLink?.pageWhitelist ?? [],
		pageBlacklist = appConfig.component?.externalLink?.pageBlacklist ?? [],
	} = options

	const popoverStore = usePopoverStore()
	const currentUrl = ref<string>()
	let dialog: ReturnType<typeof popoverStore.use> | null = null

	function isExternalLink(url: string): boolean {
		try {
			const urlObj = new URL(url, window.location.origin)
			const currentHost = window.location.hostname
			return urlObj.hostname !== currentHost
		}
		catch {
			return false
		}
	}

	function isInWhitelist(url: string): boolean {
		try {
			const urlObj = new URL(url, window.location.origin)
			return whitelist.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`))
		}
		catch {
			return false
		}
	}

	function isCurrentPageAllowed(): boolean {
		const router = useRouter()
		const currentPath = router.currentRoute.value.path
		
		// 检查是否在页面黑名单中
		const isInBlacklist = pageBlacklist.some(pattern => {
			if (typeof pattern === 'string') {
				return currentPath === pattern
			}
			return pattern.test(currentPath)
		})
		
		if (isInBlacklist) {
			return false
		}
		
		// 检查是否在页面白名单中，如果白名单为空则默认允许所有页面
		if (pageWhitelist.length === 0) {
			return true
		}
		
		return pageWhitelist.some(pattern => {
			if (typeof pattern === 'string') {
				return currentPath === pattern
			}
			return pattern.test(currentPath)
		})
	}
	
	function shouldShowDialog(url: string): boolean {
		return enabled && isCurrentPageAllowed() && isExternalLink(url) && !isInWhitelist(url)
	}

	function encodeUrl(url: string): string {
		try {
			// 使用 base64 编码 URL，确保安全传递
			return btoa(encodeURIComponent(url))
		} catch {
			// 如果编码失败，使用 URI 编码
			return encodeURIComponent(url)
		}
	}

	async function handleExternalLink(url: string, target?: string) {
		if (!shouldShowDialog(url)) {
			window.open(url, target || '_blank', 'noopener,noreferrer')
			return
		}

		// 重定向到跳转页面（使用查询参数）
		const encodedUrl = encodeUrl(url)
		const goUrl = `/go?url=${encodedUrl}`
		
		// 在新标签页打开跳转页面
		window.open(goUrl, target || '_blank', 'noopener,noreferrer')
	}

	function setupGlobalInterceptor() {
	useEventListener(document, 'click', (e) => {
		const target = e.target as HTMLElement
		const link = target.closest('a') as HTMLAnchorElement | null

		if (!link)
			return

		const href = link.getAttribute('href')
		if (!href)
			return

		// 跳过内部锚点链接
		if (href.startsWith('#'))
			return

		// 跳过邮件链接
		if (href.startsWith('mailto:'))
			return

		// 跳过电话链接
		if (href.startsWith('tel:'))
			return

		// 跳过javascript链接
		if (href.startsWith('javascript:'))
			return

		if (shouldShowDialog(href)) {
			e.preventDefault()
			const targetAttr = link.getAttribute('target') as string | undefined
			handleExternalLink(href, targetAttr)
		}
	}, { capture: true })
}

	return {
		handleExternalLink,
		setupGlobalInterceptor,
		isExternalLink,
		isInWhitelist,
		shouldShowDialog,
	}
}
