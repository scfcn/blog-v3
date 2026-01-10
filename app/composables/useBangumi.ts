import type { BangumiApiResponse } from '~/types/bangumi'

export type ContentType = keyof typeof TYPE_SUBJECT_MAP
export type CollectionType = keyof typeof TYPE_ID_MAP

export const ITEMS_PER_PAGE = 20

const TYPE_SUBJECT_MAP = {
	book: 1,
	anime: 2,
	music: 3,
	game: 4,
} as const

const TYPE_ID_MAP = {
	wish: 1,
	collect: 2,
	do: 3,
	on_hold: 4,
	dropped: 5,
} as const

export default function useBangumiCollection(
	contentType: Ref<ContentType> = ref('anime'),
	collectionType: Ref<CollectionType> = ref('wish'),
	page: Ref<number> = ref(1),
) {
	const username = '1152095'

	const subjectType = computed(() => TYPE_SUBJECT_MAP[toValue(contentType)])
	const typeId = computed(() => TYPE_ID_MAP[toValue(collectionType)])
	const offset = computed(() => (page.value - 1) * ITEMS_PER_PAGE)

	const { data, status, error, refresh } = useFetch<BangumiApiResponse>(
		() => {
			return `https://api.bgm.tv/v0/users/${username}/collections?subject_type=${subjectType.value}&type=${typeId.value}&limit=${ITEMS_PER_PAGE}&offset=${offset.value}`
		},
		{
			key: () =>
				`bangumi-${contentType}-${collectionType.value}-page-${page.value}`,
		},
	)

	const totalPages = computed(() =>
		data.value ? Math.ceil(data.value.total / ITEMS_PER_PAGE) : 0,
	)

	return {
		data,
		status,
		error,
		totalPages,
		refresh,
	}
}