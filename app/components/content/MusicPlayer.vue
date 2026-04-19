<script setup lang="ts">
const props = withDefaults(defineProps<{
	type?: 'netease' | 'qq' | 'kugou' | 'kuwo' | 'xiami' | 'apple' | 'spotify'
	id: string
	author?: string
	title?: string
	url?: string
	cover?: string
}>(), {
	type: 'netease',
})

const isPlaying = ref(false)
const isLoading = ref(false)
const audioRef = useTemplateRef('audio-player')
const progress = ref(0)
const currentTime = ref(0)
const duration = ref(0)

const musicInfo = computed(() => {
	const title = props.title || '未知歌曲'
	const author = props.author || '未知艺术家'
	return { title, author }
})

const coverUrl = computed(() => {
	if (props.cover)
		return props.cover
	switch (props.type) {
		case 'netease':
			return `https://p1.music.126.net/${props.id}/${props.id}.jpg`
		default:
			return undefined
	}
})

const audioUrl = computed(() => {
	if (props.url)
		return props.url
	switch (props.type) {
		case 'netease':
			return `https://music.163.com/song/media/outer/url?id=${props.id}.mp3`
		case 'qq':
			return `https://c.y.qq.com/v8/playsquare/index.html?id=${props.id}`
		case 'kugou':
			return `https://www.kugou.com/song/#hash=${props.id}`
		case 'kuwo':
			return `https://www.kuwo.cn/play_detail/${props.id}`
		case 'spotify':
			return `https://open.spotify.com/embed/track/${props.id}`
		default:
			return undefined
	}
})

const externalUrl = computed(() => {
	switch (props.type) {
		case 'netease':
			return `https://music.163.com/#/song?id=${props.id}`
		case 'qq':
			return `https://y.qq.com/n/ryqq/songDetail/${props.id}`
		case 'kugou':
			return `https://www.kugou.com/song/#hash=${props.id}`
		case 'kuwo':
			return `https://www.kuwo.cn/play_detail/${props.id}`
		case 'spotify':
			return `https://open.spotify.com/track/${props.id}`
		case 'apple':
			return `https://music.apple.com/song/${props.id}`
		default:
			return undefined
	}
})

function togglePlay() {
	if (!audioRef.value)
		return
	if (isPlaying.value) {
		audioRef.value.pause()
	}
	else {
		audioRef.value.play()
	}
}

function onPlay() {
	isPlaying.value = true
	isLoading.value = false
}

function onPause() {
	isPlaying.value = false
}

function onTimeUpdate() {
	if (!audioRef.value)
		return
	currentTime.value = audioRef.value.currentTime
	duration.value = audioRef.value.duration || 0
	if (duration.value > 0) {
		progress.value = (currentTime.value / duration.value) * 100
	}
}

function onLoadedMetadata() {
	if (audioRef.value) {
		duration.value = audioRef.value.duration
	}
}

function seek(e: MouseEvent) {
	if (!audioRef.value || !duration.value)
		return
	const target = e.currentTarget as HTMLElement
	const rect = target.getBoundingClientRect()
	const percent = (e.clientX - rect.left) / rect.width
	audioRef.value.currentTime = percent * duration.value
}

function formatTime(seconds: number): string {
	if (!seconds || !Number.isFinite(seconds))
		return '0:00'
	const mins = Math.floor(seconds / 60)
	const secs = Math.floor(seconds % 60)
	return `${mins}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
	if (audioRef.value) {
		audioRef.value.pause()
	}
})
</script>

<template>
<div class="music-player">
	<audio
		ref="audio-player"
		:src="audioUrl"
		@play="onPlay"
		@pause="onPause"
		@timeupdate="onTimeUpdate"
		@loadedmetadata="onLoadedMetadata"
		@waiting="isLoading = true"
		@canplay="isLoading = false"
	/>

	<div class="player-content">
		<div class="cover" :class="{ playing: isPlaying }">
			<img v-if="coverUrl" :src="coverUrl" :alt="musicInfo.title" @error="($event.target as HTMLImageElement).style.display = 'none'">
			<Icon v-else name="ph:music-notes-bold" class="placeholder" />
		</div>

		<div class="info">
			<div class="title">
				{{ musicInfo.title }}
			</div>
			<div class="author">
				{{ musicInfo.author }}
			</div>

			<div class="progress-bar" @click="seek">
				<div class="progress" :style="{ width: `${progress}%` }" />
			</div>

			<div class="controls">
				<button class="play-btn" :disabled="isLoading" @click="togglePlay">
					<Icon v-if="isLoading" name="ph:spinner-bold" class="spin" />
					<Icon v-else-if="isPlaying" name="ph:pause-fill" />
					<Icon v-else name="ph:play-fill" />
				</button>

				<span class="time">
					{{ formatTime(currentTime) }} / {{ formatTime(duration) }}
				</span>

				<a v-if="externalUrl" :href="externalUrl" target="_blank" rel="noopener" class="external-link">
					<Icon name="ph:arrow-square-out-bold" />
				</a>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.music-player {
	overflow: hidden;
	margin: 1rem 0;
	border-radius: 0.8rem;
	box-shadow: 0 2px 0.5rem var(--ld-shadow);
	background: var(--c-bg-2);
}

audio {
	display: none;
}

.player-content {
	display: flex;
	gap: 1rem;
	padding: 1rem;
}

.cover {
	flex-shrink: 0;
	overflow: hidden;
	width: 80px;
	height: 80px;
	border-radius: 0.5rem;
	background: var(--c-bg-soft);

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-size: 2rem;
		color: var(--c-text-3);
	}

	&.playing img {
		animation: rotate 20s linear infinite;
	}
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.info {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.3rem;
	min-width: 0;
}

.title {
	overflow: hidden;
	font-size: 0.95rem;
	font-weight: 600;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--c-text-1);
}

.author {
	overflow: hidden;
	font-size: 0.8rem;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--c-text-3);
}

.progress-bar {
	position: relative;
	height: 4px;
	border-radius: 2px;
	background: var(--c-bg-soft);
	cursor: pointer;

	.progress {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		border-radius: 2px;
		background: var(--c-primary);
		transition: width 0.1s linear;
	}

	&:hover .progress {
		background: var(--c-primary-hover);
	}
}

.controls {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: auto;
}

.play-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.3rem;
	border: none;
	border-radius: 50%;
	background: var(--c-primary);
	font-size: 1rem;
	color: white;
	transition: all 0.2s;
	cursor: pointer;

	&:hover:not(:disabled) {
		background: var(--c-primary-hover);
		transform: scale(1.05);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spin {
		animation: spin 1s linear infinite;
	}
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.time {
	font-variant-numeric: tabular-nums;
	font-size: 0.75rem;
	color: var(--c-text-3);
}

.external-link {
	display: flex;
	align-items: center;
	margin-left: auto;
	font-size: 0.9rem;
	color: var(--c-text-3);
	transition: color 0.2s;

	&:hover {
		color: var(--c-primary);
	}
}
</style>
