import { useRoute, useRouter } from '#app'

interface UseRouteQueryOptions<T> {
	transform?: ((value: string | undefined) => T) | {
		get: (value: string | undefined) => T
		set: (value: T) => string
	}
	mode?: 'push' | 'replace' | ComputedRef<'push' | 'replace'>
}

export function useRouteQuery<T = string>(
	name: string,
	defaultValue?: T,
	options?: UseRouteQueryOptions<T>,
) {
	const route = useRoute()
	const router = useRouter()
	const { transform, mode = 'push' } = options || {}

	const query = customRef<T>((track, trigger) => ({
		get() {
			track()
			const value = route.query[name]
			if (transform) {
				if (typeof transform === 'function')
					return transform(value === undefined || value === null || value === '' ? undefined : value as string)
				return transform.get(value === undefined || value === null || value === '' ? undefined : value as string)
			}
			if (value === undefined || value === null || value === '')
				return defaultValue as T
			return value as T
		},
		set(value: T) {
			let newValue: string | undefined
			if (transform) {
				if (typeof transform === 'function')
					newValue = value === undefined || value === defaultValue ? undefined : String(value)
				else
					newValue = value === undefined || value === defaultValue ? undefined : transform.set(value)
			}
			else {
				newValue = value === undefined || value === defaultValue ? undefined : String(value)
			}
			const currentMode = typeof mode === 'function' ? mode.value : mode
			router[currentMode]({ query: { ...route.query, [name]: newValue } })
			trigger()
		},
	}))

	return query
}
