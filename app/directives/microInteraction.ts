import type { Directive, DirectiveBinding } from 'vue'

interface MicroInteractionOptions {
	type?: 'hover-lift' | 'hover-scale' | 'hover-glow' | 'click-effect' | 'icon-bounce'
	delay?: number
}

export const vMicroInteraction: Directive<HTMLElement, MicroInteractionOptions> = {
	mounted(el: HTMLElement, binding: DirectiveBinding<MicroInteractionOptions>) {
		const { type = 'hover-lift', delay = 0 } = binding.value || {}

		el.style.transitionDelay = `${delay}ms`

		switch (type) {
			case 'hover-lift':
				el.classList.add('hover-lift')
				break
			case 'hover-scale':
				el.classList.add('hover-scale')
				break
			case 'hover-glow':
				el.classList.add('hover-glow')
				break
			case 'click-effect':
				el.classList.add('click-effect')
				break
			case 'icon-bounce':
				el.classList.add('icon-bounce')
				break
		}
	},
}

export default vMicroInteraction
