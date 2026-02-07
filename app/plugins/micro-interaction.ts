import { vMicroInteraction } from '~/directives/microInteraction'

export default defineNuxtPlugin((nuxtApp: any) => {
	nuxtApp.vueApp.directive('micro', vMicroInteraction)
})
