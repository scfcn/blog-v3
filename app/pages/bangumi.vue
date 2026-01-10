<script setup lang="ts">
import type { CollectionType, ContentType } from '../composables/useBangumi'
// import Pagination from '~/components/partial/Pagination.vue'
import bgmCard from '~/components/Bangumi/bgmCard.vue'
import useBangumi from '../composables/useBangumi'

const banguimCard = [{
  name: '克喵Kemeow',
  link: 'https://blog-v3.kemeow.top/',
  type: '页面基础',
}, {
  name: '风纪星辰',
  link: 'https://www.thyuu.com/douban/',
  type: '页面样式'
}]

useSeoMeta({
  title: '追更历史',
})

const layoutStore = useLayoutStore()
const appConfig = useAppConfig()
layoutStore.setAside(['blog-stats', 'blog-log'])

// 状态管理增强
const route = useRoute()
const contentType = ref<ContentType>('anime')
const collectionType = ref<CollectionType>('wish')
const page = ref(1)
const { data, error, totalPages, refresh, status } = useBangumi(contentType, collectionType, page)

// 加载状态控制
const isLoading = computed(() => status.value === 'pending')
const isDataReady = ref(false)
const showContent = ref(false)

// 监听数据变化
watch([contentType, collectionType], async () => {
  page.value = 1
  isDataReady.value = false
  showContent.value = false
  await refresh()
})

// 数据加载完成处理
watch(status, (newStatus) => {
  if (newStatus === 'success') {
    isDataReady.value = true
    // 添加短暂延迟确保DOM更新
    setTimeout(() => {
      showContent.value = true
    }, 100)
  }
}, { immediate: true })

// 修复防抖实现
// const debouncedRefresh = debounce((newPage: number) => {
//   page.value = newPage
//   refresh()
// }, 300, { leading: true, trailing: false }) // 添加配置选项

const games = computed(() => data.value?.data || [])

const subjectMap = {
  book: '书籍',
  anime: '追番',
  game: '游戏',
  music: '音乐',
}

const orderMap = {
  wish: '想看',
  do: '在看',
  collect: '看过',
  on_hold: '搁置',
  dropped: '抛弃',
}
</script>

<template>
  <div class="banguimContainer">
    <!-- 导航栏保持原有结构 -->
    <div class="banguimNav">
      <div 
        class="NavItem JiEun" 
        v-for="(label, key) in subjectMap" 
        :key="key"
        :class="{active: contentType === key}"
        @click="contentType = key as ContentType"
      >
        {{ label }} <!-- 显示中文标签 -->
      </div>
    </div>

    <div class="banguimNav">
      <button 
        class="typeItem" 
        v-for="(label, key) in orderMap" 
        :key="key" 
        @click="collectionType = key as CollectionType"
        :class="{active: collectionType === key}"
      >
        {{ label }}
      </button>
    </div>

    <!-- 增强版加载状态 -->
    <Transition name="fade">
      <div v-if="isLoading && !showContent" class="loading">
        <div class="loading-ripple">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Transition>

    <!-- 数据容器优化 -->
    <Transition name="list" mode="out-in">
      <div 
        class="banguimCard" 
        v-if="showContent"
        :key="`${contentType}-${collectionType}-${page}`"
      >
        <div class="banguimList" v-if="games.length > 0">
          <bgmCard
            v-for="game in games"
            :key="`${game.subject_id}-${contentType}`"
            :bangumi-collection-item="game"
          />
        </div>
        <div class="banguimEmpty" v-else>
          <p>暂无数据</p>
        </div>
      </div>
    </Transition>

    <!-- 错误提示增强 -->
    <Transition name="fade">
      <div v-if="error && showContent" class="error-wrapper">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error.message }}</div>
        <ZButton @click="refresh">重试</ZButton>
      </div>
    </Transition>

    <!-- 版权信息保持原有结构 -->
    <div class="banguimCopyright">
      <div class="card_info" v-for="item in banguimCard" :key="item.link">
        基于
        <a class="copyright" :href="item.link" target="_blank">
          {{ item.name }}
        </a>
        的{{ item.type }}
      </div>
    </div>

    <PostComment herf="/banguim" />
  </div>
</template>

<style lang="scss" scoped>
// 变量定义
$main-color: var(--db-main-color);
$hover-color: var(--db-hover-color);
$text-color: var(--db--text-color-light);
$text-color-light: var(--db--text-color-light);
$border-radius: var(--thyuu--size-radius);
$card-normal-size: var(--thyuu--size-card-normal);
$small-size: var(--thyuu--size-small);
$animation: opacity .5s var(--animation-in) backwards, transform 1s var(--animation-in) backwards, filter .7s var(--animation-in);

// 页面样式
.banguimContainer {
  margin-top: 20px;
  margin-left: 1rem;
  margin-right: 1rem;
  
  // 加载样式
  .loading {
    display: flex;
    justify-content: center;
    
    &-ripple {
      align-items: center;
      min-height: 50vh;
      display: inline-flex;
      position: relative;
      width: 80px;
      height: 80px;
      
      &:after, &:before {
        position: absolute;
        border: 4px solid $main-color;
        content: "";
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0,.2,.8,1) infinite;
      }
    }
  }
  
  // 错误样式
  .error {
    text-align: center;
    padding: 40px;
    color: #666;
    
    button {
      margin-top: 10px;
      padding: 8px 16px;
      background-color: #00a1d6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  
  // 导航样式
  .banguimNav {
    padding: 0px 0 20px;
    justify-self: center;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    
    .NavItem {
      font-size: 1em;
      cursor: pointer;
      border-bottom: 1px solid transparent;
      transition: .5s border-color;
      display: flex;
      align-items: center;
      text-transform: capitalize;
      margin-right: 20px;
      color: $text-color;
      
      &.active {
        border-color: $main-color;
      }
    }
    .typeItem { 
      margin-right: 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid var(--db-border-color);
      border-radius: 999rem;
      border-radius: 999rem;
      padding: 7px 25px;
      color: var(--db--text-color-light);
      // add
      background: hsl(214deg 100% 50% / 50%);
      -webkit-backdrop-filter: saturate(1.8) blur(20px);
      backdrop-filter: saturate(1.8) blur(20px);
      &.active {
        color: var(--db-hover-color);
        border-color: var(--db-hover-color);
        cursor: not-allowed;
      }
    }
  }
  
  // 卡片容器
  .banguimCard {
    .banguimList {
      position: relative;
      gap: .5em;
      width: 100%;
      height: 100%;
      overflow: hidden;
      animation: $animation;
      transition: .1s;
    }
    // 无数据样式
    .banguimEmpty {
      background-repeat: no-repeat;
      height: 300px;
      width: 100%;
      font-size: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .error-icon {
        color: var(--c-text-secondary);
        display: flex;
      }
    }
  }
  
  // 版权信息
  .banguimCopyright {
    font-size: 12px;
    text-align: right;
    margin-top: 20px;
    color: $text-color-light;
    
    .copyright {
      color: hsl(var(--thyuu--main-color));
    }
  }
}

// 全局样式
:root {
  --banguim--edgelr: 3rem;
  --animation: opacity .5s var(--animation-in) backwards, transform 1s var(--animation-in) backwards, filter .7s var(--animation-in);
  --db--text-color: hsl(var(--thyuu--color-font) / var(--thyuu--alpha-font));
  --thyuu--color-font: 0deg 0% 20%;
  --thyuu--alpha-font: 100%;
  --db-main-color: hsl(var(--thyuu--main-color) / 70%);
  --db-hover-color: hsl(var(--thyuu--main-color) / 70%);
  --db--text-color: hsl(var(--thyuu--color-font) / var(--thyuu--alpha-font));
  --db--text-color-light: var(--thyuu--alpha-font);
  transition: .3s;
}

// 动画定义
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>