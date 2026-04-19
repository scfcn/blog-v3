import type { TalkItem } from './types/talk'

export interface ApiResponse {
	code: number
	msg: string
	data: {
		total: number
		items: ApiTalkItem[]
	}
}

export interface ApiTalkItem {
	id: string
	content: string
	username: string
	layout: string
	private: boolean
	user_id: string
	tags?: {
		id: string
		name: string
		usage_count: number
		created_at: string | number
	}[]
	echo_files?: {
		id: string
		echo_id: string
		file_id: string
		file: {
			id: string
			key: string
			storage_type: string
			provider: string
			url: string
			name: string
			content_type: string
			size: number
			width: number
			height: number
			category: string
			created_at: string | number
		}
		sort_order: number
	}[]
	extension?: {
		id: string
		type: string
		echo_id: string
		payload?: Record<string, unknown>
	}
	fav_count: number
	created_at: string | number
}

export interface FetchTalksOptions {
	page?: number
	pageSize?: number
}

export async function fetchTalks(options: FetchTalksOptions = {}): Promise<TalkItem[]> {
	const { page = 1, pageSize = 20 } = options
	const baseUrl = 'https://mm.qixz.cn'

	function normalizeDate(date: string | number | undefined): string {
		if (!date)
			return new Date().toISOString()
		if (typeof date === 'number') {
			return new Date(date * 1000).toISOString()
		}
		return date
	}

	try {
		const response = await fetch(`${baseUrl}/api/echo/page?page=${page}&pageSize=${pageSize}`)
		const data: ApiResponse = await response.json()

		if (data.code !== 1) {
			throw new Error(data.msg || '获取数据失败')
		}

		return data.data.items.map((item) => {
			const talkItem: TalkItem = {
				id: Number.parseInt(item.id.replace(/-/g, '').slice(0, 8), 16),
				text: item.content,
				date: normalizeDate(item.created_at),
				tags: item.tags?.map(tag => tag.name) || [],
			}

			if (item.echo_files && item.echo_files.length > 0) {
				const imageFiles = item.echo_files.filter(f => f.file?.category === 'image')
				if (imageFiles.length > 0) {
					talkItem.images = imageFiles.map(f => f.file?.url || '').filter(Boolean)
				}
			}

			if (item.extension) {
				const extType = item.extension.type?.toUpperCase()
				if (extType === 'VIDEO') {
					const payload = item.extension.payload as { type?: string, id?: string } | undefined
					const videoId = item.extension.echo_id || item.extension.id
					const videoTypeRaw = payload?.type?.toLowerCase() || 'bilibili'
					const videoType: 'raw' | 'bilibili' | 'bilibili-nano' | 'youtube' | 'douyin' | 'douyin-wide' | 'tiktok' = ['raw', 'bilibili', 'bilibili-nano', 'youtube', 'douyin', 'douyin-wide', 'tiktok'].includes(videoTypeRaw) ? videoTypeRaw as any : 'bilibili'

					talkItem.video = {
						type: videoType,
						id: payload?.id || videoId,
					}
				}
				else if (extType === 'MUSIC') {
					const payload = item.extension.payload as { type?: string, id?: string, author?: string, title?: string, url?: string, cover?: string } | undefined
					const musicTypeRaw = payload?.type || 'netease'
					const musicType: 'netease' | 'qq' | 'kugou' | 'kuwo' | 'xiami' | 'apple' | 'spotify' = ['netease', 'qq', 'kugou', 'kuwo', 'xiami', 'apple', 'spotify'].includes(musicTypeRaw) ? musicTypeRaw as any : 'netease'

					talkItem.music = {
						type: musicType,
						id: payload?.id || item.extension.id,
						author: payload?.author,
						title: payload?.title,
						url: payload?.url,
						cover: payload?.cover,
					}
				}
				else if (extType === 'LINK') {
					const payload = item.extension.payload as { url?: string, title?: string, image?: string, description?: string } | undefined
					talkItem.link = {
						url: payload?.url || item.extension.echo_id,
						title: payload?.title,
						image: payload?.image,
						description: payload?.description,
					}
				}
			}

			return talkItem
		})
	}
	catch (error) {
		console.error('获取说说数据失败:', error)
		return []
	}
}

export default [] satisfies TalkItem[]
