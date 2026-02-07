import type { Directive, DirectiveBinding } from 'vue'

interface ScrollAnimationBinding extends DirectiveBinding<string> {
  value: string
}

export const vScrollAnimation: Directive<HTMLElement, string> = {
  mounted(el: HTMLElement, binding: ScrollAnimationBinding) {
    const animationClass = binding.value || 'scroll-animate'
    
    el.classList.add(animationClass)
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    )
    
    observer.observe(el)
  },
}

export default vScrollAnimation
