export interface TalkItem {
	id?: number | string
	text?: string
	date: string
	images?: string[]
	video?: {
		type?: 'raw' | 'bilibili' | 'bilibili-nano' | 'youtube' | 'douyin' | 'douyin-wide' | 'tiktok'
		id: string
		ratio?: string | number
		poster?: string
	}
	music?: {
		type?: 'netease' | 'qq' | 'kugou' | 'kuwo' | 'xiami' | 'apple' | 'spotify'
		id: string
		author?: string
		title?: string
		url?: string
		cover?: string
	}
	link?: {
		url: string
		title?: string
		image?: string
		description?: string
	}
	tags?: string[]
	location?: string
}
