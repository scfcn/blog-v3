import { useIntersectionObserver } from '@vueuse/core'

export function useScrollAnimation(
	target: Ref<HTMLElement | undefined>,
	options?: {
		threshold?: number
		rootMargin?: string
		animationClass?: string
		once?: boolean
	},
) {
	const {
		threshold = 0.1,
		rootMargin = '0px',
		animationClass = 'scroll-animate',
		once = true,
	} = options || {}

	const isVisible = ref(false)
	const hasAnimated = ref(false)

	const { stop } = useIntersectionObserver(
		target,
		([{ isIntersecting }]) => {
			if (isIntersecting) {
				isVisible.value = true
				if (once) {
					hasAnimated.value = true
					stop()
				}
			}
			else if (!once) {
				isVisible.value = false
			}
		},
		{
			threshold,
			rootMargin,
		},
	)

	return {
		isVisible,
		hasAnimated,
		animationClass,
	}
}

export function useScrollReveal() {
	const elements = ref<HTMLElement[]>([])

	const observeElements = (selector = '.scroll-reveal') => {
		if (import.meta.client) {
			elements.value = Array.from(document.querySelectorAll(selector))
			elements.value.forEach((el) => {
				el.classList.add('scroll-reveal-hidden')
			})

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.remove('scroll-reveal-hidden')
							entry.target.classList.add('scroll-reveal-visible')
						}
					})
				},
				{
					threshold: 0.1,
					rootMargin: '0px 0px -50px 0px',
				},
			)

			elements.value.forEach((el) => observer.observe(el))

			return observer
		}
		return null
	}

	return {
		observeElements,
	}
}
