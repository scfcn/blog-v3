<script setup lang="ts">
import type { ChronoFramePhoto } from '~/types/chronoframe'

const layoutStore = useLayoutStore()
layoutStore.setAside([])

useSeoMeta({
	title: '青序图驿 - 记录美好瞬间',
	description: '青序图驿，记录生活中的美好瞬间，用镜头捕捉世界的精彩。Light traces, time stays.',
	ogTitle: '青序图驿',
	ogDescription: '记录生活中的美好瞬间，用镜头捕捉世界的精彩。',
})

const {
	isConfigured,
	fetchPhotos,
	getPhotoUrl,
	formatDate,
	formatFileSize,
} = useChronoframe()

const photos = ref<ChronoFramePhoto[]>([])
const isLoading = ref(true)
const loadError = ref(false)
const selectedPhoto = ref<ChronoFramePhoto | null>(null)
const showLightbox = ref(false)
const lightboxImageLoaded = ref(false)
const showBoundaryTip = ref('')
const isLivePlaying = ref(false)
const liveVideoRef = useTemplateRef<HTMLVideoElement>('liveVideoRef')
let boundaryTipTimer: ReturnType<typeof setTimeout> | null = null

const currentIndex = computed(() => {
	if (!selectedPhoto.value)
		return -1
	return photos.value.findIndex(p => p.id === selectedPhoto.value?.id)
})

async function loadPhotos() {
	if (!isConfigured.value) {
		isLoading.value = false
		return
	}

	isLoading.value = true
	loadError.value = false

	try {
		photos.value = await fetchPhotos()
	}
	catch (error) {
		console.error('获取图片数据失败:', error)
		loadError.value = true
	}
	finally {
		isLoading.value = false
	}
}

function openPhoto(photo: ChronoFramePhoto) {
	selectedPhoto.value = photo
	showLightbox.value = true
	lightboxImageLoaded.value = false
	isLivePlaying.value = false
}

function closeLightbox() {
	showLightbox.value = false
	selectedPhoto.value = null
	lightboxImageLoaded.value = false
	isLivePlaying.value = false
}

function toggleLivePhoto() {
	if (!liveVideoRef.value)
		return

	if (isLivePlaying.value) {
		liveVideoRef.value.pause()
		isLivePlaying.value = false
	}
	else {
		liveVideoRef.value.play()
		isLivePlaying.value = true
	}
}

function showTip(tip: string) {
	showBoundaryTip.value = tip
	if (boundaryTipTimer) {
		clearTimeout(boundaryTipTimer)
	}
	boundaryTipTimer = setTimeout(() => {
		showBoundaryTip.value = ''
	}, 1500)
}

function navigatePhoto(direction: 'prev' | 'next') {
	if (!selectedPhoto.value || photos.value.length === 0)
		return

	const index = currentIndex.value
	if (index === -1)
		return

	let newIndex: number

	if (direction === 'prev') {
		if (index === 0) {
			showTip('已经是第一张了')
			return
		}
		newIndex = index - 1
	}
	else {
		if (index === photos.value.length - 1) {
			showTip('已经是最后一张了')
			return
		}
		newIndex = index + 1
	}

	const newPhoto = photos.value[newIndex]
	if (newPhoto) {
		selectedPhoto.value = newPhoto
		lightboxImageLoaded.value = false
	}
}

function handleKeydown(e: KeyboardEvent) {
	if (!showLightbox.value)
		return

	if (e.key === 'Escape') {
		closeLightbox()
	}
	else if (e.key === 'ArrowLeft') {
		navigatePhoto('prev')
	}
	else if (e.key === 'ArrowRight') {
		navigatePhoto('next')
	}
}

onMounted(() => {
	loadPhotos()
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
	if (boundaryTipTimer) {
		clearTimeout(boundaryTipTimer)
	}
})
</script>

<template>
<div class="gallery-page">
	<header class="gallery-header">
		<h1 class="gallery-title">
			青序图驿
		</h1>
		<p class="gallery-slogan">
			Light traces, time stays.
		</p>
	</header>

	<div class="gallery-container">
		<template v-if="!isConfigured">
			<div class="not-configured">
				<Icon name="ph:image-broken-bold" class="icon" />
				<h3>图驿服务未配置</h3>
				<p>请在 blog.config.ts 中配置 chronoframe.baseUrl</p>
			</div>
		</template>

		<template v-else-if="isLoading">
			<div class="loading-state">
				<div v-for="i in 12" :key="`skeleton-${i}`" class="skeleton-item">
					<div class="skeleton-image" />
				</div>
			</div>
		</template>

		<template v-else-if="loadError">
			<div class="error-state">
				<div class="error-content">
					<Icon name="ph:alert-circle-bold" class="error-icon" />
					<h3>加载失败</h3>
					<p>获取图片数据时出现错误，请稍后重试</p>
					<button class="retry-btn" @click="loadPhotos">
						<Icon name="ph:refresh-bold" />
						重试
					</button>
				</div>
			</div>
		</template>

		<template v-else-if="photos.length === 0">
			<div class="empty-state">
				<Icon name="ph:images-bold" class="empty-icon" />
				<p>暂无图片</p>
			</div>
		</template>

		<template v-else>
			<div class="masonry-grid">
				<div
					v-for="(photo, index) in photos"
					:key="photo.id"
					class="masonry-item"
					:style="{ '--delay': `${index * 0.03}s` }"
					@click="openPhoto(photo)"
				>
					<div class="image-wrapper">
						<img
							:src="getPhotoUrl(photo, 'thumbnail')"
							:alt="photo.title || '照片'"
							class="image-thumb"
							loading="lazy"
						>
						<div class="gallery-overlay">
							<div class="overlay-content">
								<Icon name="ph:arrows-out-bold" class="expand-icon" />
								<div v-if="photo.title" class="photo-title">
									{{ photo.title }}
								</div>
								<div v-if="photo.dateTaken" class="photo-date">
									{{ formatDate(photo.dateTaken) }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="gallery-footer">
				<p>共 {{ photos.length }} 张照片</p>
			</div>
		</template>
	</div>
</div>

<Teleport to="body">
	<Transition name="lightbox">
		<div v-if="showLightbox && selectedPhoto" class="lightbox" @click.self="closeLightbox">
			<button class="lightbox-close" @click="closeLightbox">
				<Icon name="ph:x-bold" />
			</button>

			<button class="lightbox-nav prev" @click="navigatePhoto('prev')">
				<Icon name="ph:caret-left-bold" />
			</button>

			<button class="lightbox-nav next" @click="navigatePhoto('next')">
				<Icon name="ph:caret-right-bold" />
			</button>

			<Transition name="tip">
				<div v-if="showBoundaryTip" class="boundary-tip">
					{{ showBoundaryTip }}
				</div>
			</Transition>

			<div class="lightbox-content">
				<div class="lightbox-image-container">
					<img
						:src="getPhotoUrl(selectedPhoto, 'thumbnail')"
						:alt="selectedPhoto.title || '照片'"
						class="lightbox-image thumb"
						:class="{ hidden: lightboxImageLoaded || isLivePlaying }"
					>
					<img
						v-show="lightboxImageLoaded && !isLivePlaying"
						:src="getPhotoUrl(selectedPhoto, 'original')"
						:alt="selectedPhoto.title || '照片'"
						class="lightbox-image full"
						:class="{ visible: lightboxImageLoaded && !isLivePlaying }"
						@load="lightboxImageLoaded = true"
					>
					<video
						v-if="selectedPhoto.isLivePhoto && selectedPhoto.livePhotoVideoUrl"
						ref="liveVideoRef"
						:src="selectedPhoto.livePhotoVideoUrl"
						class="lightbox-image full"
						:class="{ visible: isLivePlaying }"
						playsinline
						muted
						@ended="isLivePlaying = false"
					/>
					<div v-if="!lightboxImageLoaded && !isLivePlaying" class="loading-spinner">
						<Icon name="ph:spinner-bold" class="spin" />
					</div>
					<button
						v-if="selectedPhoto.isLivePhoto && selectedPhoto.livePhotoVideoUrl"
						class="live-play-btn"
						:class="{ playing: isLivePlaying }"
						@click="toggleLivePhoto"
					>
						<Icon :name="isLivePlaying ? 'ph:pause-bold' : 'ph:play-bold'" />
						<span>{{ isLivePlaying ? 'LIVE' : 'LIVE' }}</span>
					</button>
				</div>

				<div class="lightbox-info">
					<div class="info-header">
						<div v-if="selectedPhoto.title" class="info-title">
							{{ selectedPhoto.title }}
						</div>
						<div v-if="selectedPhoto.description" class="info-desc">
							{{ selectedPhoto.description }}
						</div>
					</div>

					<div class="info-meta">
						<div v-if="selectedPhoto.dateTaken" class="meta-item">
							<Icon name="ph:calendar-bold" />
							<span>{{ formatDate(selectedPhoto.dateTaken) }}</span>
						</div>
						<div v-if="selectedPhoto.locationName" class="meta-item">
							<Icon name="ph:map-pin-bold" />
							<span>{{ selectedPhoto.locationName }}</span>
						</div>
						<div v-if="selectedPhoto.exif?.Make || selectedPhoto.exif?.Model" class="meta-item">
							<Icon name="ph:camera-bold" />
							<span>{{ selectedPhoto.exif?.Make }} {{ selectedPhoto.exif?.Model }}</span>
						</div>
						<div v-if="selectedPhoto.fileSize" class="meta-item">
							<Icon name="ph:file-bold" />
							<span>{{ formatFileSize(selectedPhoto.fileSize) }}</span>
						</div>
						<div v-if="selectedPhoto.width && selectedPhoto.height" class="meta-item">
							<Icon name="ph:frame-corners-bold" />
							<span>{{ selectedPhoto.width }} x {{ selectedPhoto.height }}</span>
						</div>
					</div>

					<div v-if="selectedPhoto.tags?.length" class="info-tags">
						<span v-for="tag in selectedPhoto.tags" :key="tag" class="tag">
							{{ tag }}
						</span>
					</div>

					<div class="info-counter">
						{{ currentIndex + 1 }} / {{ photos.length }}
					</div>
				</div>
			</div>
		</div>
	</Transition>
</Teleport>
</template>

<style lang="scss" scoped>
.gallery-page {
	min-height: 100vh;
}

.gallery-header {
	padding: 3rem 1rem 2rem;
	text-align: center;
}

.gallery-title {
	margin: 0 0 0.3em;
	mask-image: linear-gradient(#FFF 50%, transparent);
	font-family: var(--font-stroke-free);
	font-size: clamp(2rem, 8vw, 4rem);
	font-weight: 800;
	line-height: 1;
	color: transparent;
	-webkit-text-stroke: 1px var(--c-text-2);
}

.gallery-slogan {
	opacity: 0.8;
	margin: 0;
	font-size: 0.9rem;
	font-style: italic;
	letter-spacing: 0.1em;
	color: var(--c-text-3);
}

.gallery-container {
	padding: 0 1rem;
	animation: float-in 0.2s backwards;
}

.not-configured,
.error-state,
.empty-state {
	margin: 1rem 0;
	padding: 3rem 1rem;
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-bg-soft);
	text-align: center;

	.icon,
	.error-icon,
	.empty-icon {
		margin-bottom: 1rem;
		font-size: 3rem;
		color: var(--c-text-3);
	}

	h3 {
		margin: 0 0 0.5rem;
		font-size: 1.2rem;
		color: var(--c-text-1);
	}

	p {
		margin: 0;
		color: var(--c-text-3);
	}
}

.error-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

.retry-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 6px;
	background-color: var(--c-primary);
	font-size: 0.9rem;
	color: white;
	transition: all 0.2s;
	cursor: pointer;

	&:hover {
		background-color: var(--c-primary-hover);
		transform: translateY(-1px);
	}
}

.loading-state {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
	margin: 1rem 0;

	@media (min-width: 640px) {
		gap: 0.75rem;
	}
}

.skeleton-item {
	overflow: hidden;
	aspect-ratio: 1;
	border-radius: 8px;
}

.skeleton-image {
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
}

@keyframes loading {
	0% {
		background-position: 200% 0;
	}

	100% {
		background-position: -200% 0;
	}
}

.masonry-grid {
	column-count: 3;
	column-gap: 0.5rem;

	@media (min-width: 640px) {
		column-gap: 0.75rem;
	}

	@media (min-width: 1024px) {
		column-count: 3;
		column-gap: 1rem;
	}
}

.masonry-item {
	overflow: hidden;
	margin-bottom: 0.5rem;
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-bg-soft);
	transition: transform 0.3s, box-shadow 0.3s;
	animation: float-in 0.3s backwards;
	animation-delay: var(--delay);
	cursor: pointer;
	break-inside: avoid;

	@media (min-width: 640px) {
		margin-bottom: 0.75rem;
	}

	@media (min-width: 1024px) {
		margin-bottom: 1rem;
	}

	&:hover {
		box-shadow: 0 8px 24px var(--ld-shadow);
		transform: translateY(-4px);

		.gallery-overlay {
			opacity: 1;
		}
	}
}

.image-wrapper {
	position: relative;
	width: 100%;
	line-height: 0;
}

.image-thumb {
	display: block;
	width: 100%;
	height: auto;
}

.gallery-overlay {
	display: flex;
	align-items: flex-end;
	position: absolute;
	opacity: 0;
	inset: 0;
	padding: 0.75rem;
	background: linear-gradient(to top, rgb(0 0 0 / 70%) 0%, transparent 50%);
	transition: opacity 0.3s;
}

.overlay-content {
	width: 100%;
	color: white;
}

.expand-icon {
	position: absolute;
	opacity: 0.8;
	top: 0.75rem;
	right: 0.75rem;
	font-size: 1.25rem;
}

.photo-title {
	overflow: hidden;
	margin-bottom: 0.25rem;
	font-size: 0.9rem;
	font-weight: 600;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.photo-date {
	opacity: 0.8;
	font-size: 0.75rem;
}

.gallery-footer {
	margin: 2rem 0;
	font-size: 0.9rem;
	text-align: center;
	color: var(--c-text-3);
}

.lightbox {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	inset: 0;
	padding: 1rem;
	background: transparent;
	backdrop-filter: blur(20px);
	z-index: 1000;
}

.lightbox-close {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 3rem;
	height: 3rem;
	border: none;
	border-radius: 50%;
	background: rgb(0 0 0 / 30%);
	font-size: 1.5rem;
	color: white;
	transition: background 0.2s;
	cursor: pointer;
	z-index: 1001;

	&:hover {
		background: rgb(0 0 0 / 50%);
	}
}

.lightbox-nav {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 50%;
	width: 3rem;
	height: 3rem;
	border: none;
	border-radius: 50%;
	background: rgb(0 0 0 / 30%);
	font-size: 1.5rem;
	color: white;
	transform: translateY(-50%);
	transition: background 0.2s;
	cursor: pointer;
	z-index: 1001;

	&:hover {
		background: rgb(0 0 0 / 50%);
	}

	&.prev {
		left: 1rem;
	}

	&.next {
		right: 1rem;
	}
}

.boundary-tip {
	position: absolute;
	top: 50%;
	left: 50%;
	padding: 0.75rem 1.5rem;
	border-radius: 8px;
	background: rgb(0 0 0 / 70%);
	font-size: 0.9rem;
	color: white;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: 1002;
}

.tip-enter-active,
.tip-leave-active {
	transition: opacity 0.3s;
}

.tip-enter-from,
.tip-leave-to {
	opacity: 0;
}

.lightbox-content {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	max-width: 95vw;
	max-height: 90vh;
}

.lightbox-image-container {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	position: relative;
	max-width: 65vw;
	max-height: 85vh;
}

.lightbox-image {
	max-width: 100%;
	max-height: 85vh;
	border-radius: 8px;
	box-shadow: 0 8px 32px rgb(0 0 0 / 30%);
	transition: opacity 0.4s ease;
	object-fit: contain;

	&.thumb {
		&.hidden {
			opacity: 0;
		}
	}

	&.full {
		position: absolute;
		opacity: 0;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		&.visible {
			opacity: 1;
		}
	}
}

.loading-spinner {
	position: absolute;
	top: 50%;
	left: 50%;
	font-size: 2rem;
	color: white;
	transform: translate(-50%, -50%);

	.spin {
		animation: spin 1s linear infinite;
	}
}

.live-play-btn {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	position: absolute;
	bottom: 1rem;
	left: 1rem;
	padding: 0.5rem 0.75rem;
	border: none;
	border-radius: 20px;
	background: rgb(0 0 0 / 50%);
	backdrop-filter: blur(10px);
	font-size: 0.8rem;
	color: white;
	transition: all 0.2s;
	cursor: pointer;

	&:hover {
		background: rgb(0 0 0 / 70%);
	}

	&.playing {
		background: rgb(255 255 255 / 20%);

		span {
			color: #4ADE80;
		}
	}

	.icon {
		font-size: 1rem;
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.lightbox-info {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow-y: auto;
	width: 280px;
	max-height: 85vh;
	padding: 1.5rem;
	border-radius: 12px;
	background: rgb(0 0 0 / 40%);
	color: white;
}

.info-header {
	padding-bottom: 1rem;
	border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.info-title {
	margin-bottom: 0.5rem;
	font-size: 1.25rem;
	font-weight: 600;
	line-height: 1.4;
}

.info-desc {
	opacity: 0.8;
	font-size: 0.9rem;
	line-height: 1.6;
}

.info-meta {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	font-size: 0.85rem;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	opacity: 0.9;

	.icon {
		opacity: 0.7;
		font-size: 1rem;
	}
}

.info-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding-top: 1rem;
	border-top: 1px solid rgb(255 255 255 / 10%);
}

.tag {
	padding: 0.25rem 0.6rem;
	border-radius: 4px;
	background: rgb(255 255 255 / 15%);
	font-size: 0.8rem;
}

.info-counter {
	opacity: 0.7;
	padding-top: 1rem;
	border-top: 1px solid rgb(255 255 255 / 10%);
	font-size: 0.85rem;
	text-align: center;
}

@media (max-width: 768px) {
	.lightbox-content {
		flex-direction: column;
		overflow-y: auto;
		max-height: none;
	}

	.lightbox-image-container {
		max-width: 90vw;
		max-height: 50vh;
	}

	.lightbox-info {
		width: 100%;
		max-width: 90vw;
		max-height: none;
	}
}

.lightbox-enter-active,
.lightbox-leave-active {
	transition: opacity 0.3s;
}

.lightbox-enter-from,
.lightbox-leave-to {
	opacity: 0;
}

@keyframes float-in {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
