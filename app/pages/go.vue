<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import appConfig from '~/app.config'

const route = useRoute()

const goConfig = appConfig.component.externalLink.go

definePageMeta({
  title: goConfig.title
})

const encodedUrl = computed(() => route.query.url as string || '')

const url = ref<string>('')
const countdown = ref<number>(goConfig.countdown)
const error = ref<string>('')
const isLoading = ref(true)
const countdownProgress = computed(() => {
  const total = goConfig.countdown
  const remaining = countdown.value
  return (remaining / total) * 283
})

let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = goConfig.countdown
  
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
      jumpToExternal()
    }
  }, 1000)
}

function decodeUrl(encoded: string): string {
  try {
    const decoded = decodeURIComponent(atob(encoded))
    return decoded
  } catch {
    return encoded
  }
}

function jumpToExternal() {
  if (!url.value) {
    error.value = goConfig.errorText.invalidLink
    return
  }
  
  // 在新窗口中打开外部链接
  window.open(url.value, '_blank', 'noopener,noreferrer')
  
  // 清除倒计时定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  
  // 关闭当前页面
  setTimeout(() => {
    window.close()
  }, 500)
}

function cancelJump() {
  // 清除倒计时定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  
  // 关闭当前页面
  window.close()
}

function handleWindowClose() {
  // 清除倒计时定时器，防止窗口关闭后仍执行跳转
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

onMounted(() => {
  isLoading.value = false
  if (encodedUrl.value) {
    url.value = decodeUrl(encodedUrl.value)
    if (url.value) {
      startCountdown()
    } else {
      error.value = goConfig.errorText.decodeFailed
    }
  } else {
    error.value = goConfig.errorText.missingParam
  }
  
  // 添加窗口关闭事件监听器
  window.addEventListener('beforeunload', handleWindowClose)
})

onUnmounted(() => {
  // 清除倒计时定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  
  // 移除窗口关闭事件监听器
  window.removeEventListener('beforeunload', handleWindowClose)
})
</script>

<template>
  <div class="go-page">
    <Transition name="fade">
      <div v-if="!isLoading" class="card">
        <div v-if="error" class="error-state">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>页面出错</h1>
          <p>{{ error }}</p>
          <div class="actions">
            <button @click="cancelJump" class="btn-secondary">
              返回首页
            </button>
          </div>
        </div>

        <div v-else class="normal-state">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="link-icon">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>

          <h1>{{ goConfig.normalText.leaving }}</h1>
          <p class="description">{{ goConfig.normalText.description }}</p>

          <div class="countdown-wrapper">
            <div class="countdown-circle">
              <svg viewBox="0 0 100 100">
                <circle class="countdown-bg" cx="50" cy="50" r="45"/>
                <circle class="countdown-progress" cx="50" cy="50" r="45" :style="{ strokeDashoffset: countdownProgress }"/>
              </svg>
              <span class="countdown-number">{{ countdown }}</span>
            </div>
            <p class="countdown-text">{{ goConfig.normalText.countingDown }}</p>
          </div>

          <div class="actions">
            <button @click="cancelJump" class="btn-secondary">
              {{ goConfig.normalText.cancel }}
            </button>
            <button @click="jumpToExternal" class="btn-primary">
              {{ goConfig.normalText.jumpNow }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.go-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg-1);
  padding: 1rem;
}

.card {
  width: 100%;
  max-width: 360px;
  background: var(--ld-bg-card);
  border: 1px solid var(--c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.error-state {
  text-align: center;

  .error-icon {
    color: var(--c-primary);
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.25rem;
    color: var(--c-text-1);
    margin: 0 0 0.5rem 0;
  }

  p {
    color: var(--c-text-2);
    margin: 0 0 1.5rem 0;
  }
}

.normal-state {
  text-align: center;

  .icon-wrapper {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.25rem;
    background: var(--c-primary-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .link-icon {
      color: var(--c-primary);
      width: 32px;
      height: 32px;
    }
  }

  h1 {
    font-size: 1.5rem;
    color: var(--c-text-1);
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  .description {
    color: var(--c-text-2);
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
  }
}

.countdown-wrapper {
  margin: 2rem 0;

  .countdown-circle {
    width: 100px;
    height: 100px;
    margin: 0 auto 1rem;
    position: relative;

    svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .countdown-bg {
      fill: none;
      stroke: var(--c-bg-soft);
      stroke-width: 8;
    }

    .countdown-progress {
      fill: none;
      stroke: var(--c-primary);
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 283;
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 1s linear;
    }

    .countdown-number {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--c-primary);
    }
  }

  .countdown-text {
    color: var(--c-text-2);
    font-size: 0.85rem;
    margin: 0;
  }
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
}

button {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--c-primary);
  color: var(--c-bg);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-secondary {
  background: var(--c-bg-soft);
  color: var(--c-text-1);

  &:hover {
    background: var(--c-bg-2);
  }
}

.fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem;
  }

  .actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>