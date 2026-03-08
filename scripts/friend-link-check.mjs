import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

const MY_SITE_URL = process.env.MY_SITE_URL || 'https://www.qixz.cn/'
const TIMEOUT = 15000

const VALID_ARCHS = [
	'服务器',
	'国内 CDN',
	'虚拟主机',
	'Astro',
	'Cloudflare',
	'Deno Deploy',
	'EdgeOne',
	'Esa',
	'GitHub Pages',
	'Golang',
	'Gridea',
	'Halo',
	'Hexo',
	'HTML',
	'Hugo',
	'Jekyll',
	'Mix Space',
	'Netlify',
	'Next.js',
	'NotionNext',
	'Nuxt',
	'PHP',
	'Python',
	'React',
	'Typecho',
	'Vercel',
	'VitePress',
	'Vue',
	'VuePress',
	'WordPress',
	'Zebaur',
]

async function fetchWithTimeout(url, options = {}) {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), TIMEOUT)

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
			redirect: 'follow',
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; FriendLinkChecker/1.0)',
				...options.headers,
			},
		})
		clearTimeout(timeout)
		return response
	}
	catch (error) {
		clearTimeout(timeout)
		throw error
	}
}

async function checkSiteConnectivity(url) {
	try {
		const response = await fetchWithTimeout(url)
		if (response.ok) {
			return {
				status: 'pass',
				message: `HTTP ${response.status}`,
			}
		}
		return {
			status: 'fail',
			message: `HTTP ${response.status}`,
		}
	}
	catch (error) {
		if (error.name === 'AbortError') {
			return {
				status: 'fail',
				message: '请求超时',
			}
		}
		return {
			status: 'fail',
			message: error.message || '无法访问',
		}
	}
}

async function checkLinkBack(linkPageUrl, mySiteUrl) {
	if (!linkPageUrl) {
		return {
			status: 'fail',
			message: '未提供友链页面地址',
		}
	}

	try {
		const response = await fetchWithTimeout(linkPageUrl)
		if (!response.ok) {
			return {
				status: 'fail',
				message: `友链页面无法访问 (HTTP ${response.status})`,
			}
		}

		const html = await response.text()
		const myUrlWithoutProtocol = mySiteUrl.replace(/^https?:\/\//, '')

		const patterns = [
			mySiteUrl,
			myUrlWithoutProtocol,
			mySiteUrl.replace(/\/$/, ''),
			myUrlWithoutProtocol.replace(/\/$/, ''),
		]

		const found = patterns.some(pattern =>
			html.toLowerCase().includes(pattern.toLowerCase()),
		)

		if (found) {
			return {
				status: 'pass',
				message: '已找到本站链接',
			}
		}

		return {
			status: 'fail',
			message: '未找到本站链接',
		}
	}
	catch (error) {
		if (error.name === 'AbortError') {
			return {
				status: 'fail',
				message: '友链页面请求超时',
			}
		}
		return {
			status: 'fail',
			message: error.message || '无法访问友链页面',
		}
	}
}

async function checkAvatarValid(avatarUrl) {
	if (!avatarUrl) {
		return {
			status: 'fail',
			message: '未提供头像链接',
		}
	}

	try {
		const response = await fetchWithTimeout(avatarUrl, { method: 'HEAD' })
		if (response.ok) {
			const contentType = response.headers.get('content-type')
			if (contentType && contentType.startsWith('image/')) {
				return {
					status: 'pass',
					message: '头像可访问',
				}
			}
			return {
				status: 'warn',
				message: `非图片类型: ${contentType || 'unknown'}`,
			}
		}
		return {
			status: 'fail',
			message: `HTTP ${response.status}`,
		}
	}
	catch (error) {
		if (error.name === 'AbortError') {
			return {
				status: 'fail',
				message: '请求超时',
			}
		}
		return {
			status: 'fail',
			message: error.message || '无法访问',
		}
	}
}

async function checkSSL(url) {
	try {
		const urlObj = new URL(url)
		if (urlObj.protocol !== 'https:') {
			return {
				status: 'warn',
				message: '未使用 HTTPS',
			}
		}
		return {
			status: 'pass',
			message: 'HTTPS 已启用',
		}
	}
	catch {
		return {
			status: 'fail',
			message: '无效的 URL',
		}
	}
}

function checkArchs(archsStr) {
	if (!archsStr || archsStr.trim() === '') {
		return {
			status: 'pass',
			message: '未填写技术架构',
			validArchs: [],
			invalidArchs: [],
		}
	}

	const archs = archsStr.split(',').map(a => a.trim()).filter(a => a)
	const validArchs = []
	const invalidArchs = []

	for (const arch of archs) {
		if (VALID_ARCHS.includes(arch)) {
			validArchs.push(arch)
		}
		else {
			invalidArchs.push(arch)
		}
	}

	if (invalidArchs.length === 0) {
		return {
			status: 'pass',
			message: validArchs.length > 0 ? `有效: ${validArchs.join(', ')}` : '未填写技术架构',
			validArchs,
			invalidArchs,
		}
	}

	return {
		status: 'fail',
		message: `无效的技术架构: ${invalidArchs.join(', ')}。有效选项: ${VALID_ARCHS.join(', ')}`,
		validArchs,
		invalidArchs,
	}
}

async function main() {
	let data = {}
	try {
		data = JSON.parse(readFileSync('issue-data.json', 'utf8'))
	}
	catch (e) {
		console.error('Failed to read issue-data.json:', e.message)
	}

	console.log('Checking friend link for:', data.link)
	console.log('Link page:', data.linkPage)

	const [siteConnectivity, linkBack, avatarValid, sslValid, archsValid] = await Promise.all([
		checkSiteConnectivity(data.link),
		checkLinkBack(data.linkPage, MY_SITE_URL),
		checkAvatarValid(data.avatar),
		checkSSL(data.link),
		Promise.resolve(checkArchs(data.archs)),
	])

	const allPassed
		= siteConnectivity.status === 'pass'
			&& linkBack.status === 'pass'
			&& avatarValid.status !== 'fail'
			&& archsValid.status === 'pass'

	const result = {
		data,
		siteConnectivity,
		linkBack,
		avatarValid,
		sslValid,
		archsValid,
		allPassed,
		checkedAt: new Date().toISOString(),
	}

	writeFileSync('check-result.json', JSON.stringify(result, null, 2))
	console.log('Check result:', JSON.stringify(result, null, 2))
}

main().catch(console.error)
