import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

export function createLazyComponent<T extends Component>(
	componentLoader: () => Promise<{ default: T }>,
	options?: {
		loadingComponent?: Component
		errorComponent?: Component
		delay?: number
		timeout?: number
		suspensible?: boolean
	},
) {
	return defineAsyncComponent({
		loader: componentLoader,
		loadingComponent: options?.loadingComponent,
		errorComponent: options?.errorComponent,
		delay: options?.delay ?? 200,
		timeout: options?.timeout ?? 30000,
		suspensible: options?.suspensible ?? false,
	})
}
