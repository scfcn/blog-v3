import type { ContentCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
	const posts = await queryCollection(event, 'content')
		.where('stem', 'LIKE', 'posts/%')
		.where('draft', '!=', true)
		.all()

	const totalWords = posts.reduce((sum: number, post: ContentCollectionItem) => {
		return sum + (post.readingTime?.words || 0)
	}, 0)

	const annualStats: Record<string, { posts: number, words: number }> = {}

	posts.forEach((post: ContentCollectionItem) => {
		const year = post.date?.substring(0, 4) || '未知'
		if (!annualStats[year]) {
			annualStats[year] = { posts: 0, words: 0 }
		}
		annualStats[year].posts++
		annualStats[year].words += post.readingTime?.words || 0
	})

	return {
		total: {
			posts: posts.length,
			words: totalWords,
		},
		annual: annualStats,
	}
})
