import vScrollAnimation from '~/directives/scrollAnimation'

export default defineNuxtPlugin((nuxtApp: any) => {
	nuxtApp.vueApp.directive('scroll-animation', vScrollAnimation)
})
