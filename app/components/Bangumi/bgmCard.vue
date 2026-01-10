<script setup lang="ts">
import type { BangumiCollectionItem } from '~/types/bangumi'

const props = defineProps<{
	bangumiCollectionItem: BangumiCollectionItem
}>()

function handleClick() {
	const url = `https://bgm.tv/subject/${props.bangumiCollectionItem.subject_id}`
	window.open(url, '_blank')
}

// 格式化日期函数
function getPostDate(date: string | Date) {
	const d = new Date(date)
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 计算满星数量：score 除以 2 后向下取整
const fullStars = Math.floor(props.bangumiCollectionItem.subject.score / 2);

const score = Math.floor(props.bangumiCollectionItem.subject.score); // 动态评分(全局评分)
const rate = Math.floor(props.bangumiCollectionItem.rate); // 动态评分(全局评分)

const scoreClass = computed(() => (index: number) => {
  // 将评分值乘以2，实现半星精度（例如3.5 * 2=7，表示3个全星+1个半星）
  const scoreTotal = score / 2;
  const integerPartScore = Math.floor(scoreTotal); // 总星数的整数部分（包含半星换算）
  const hasHalfScore = scoreTotal % 1 !== 0; // 是否存在半星

  // 根据索引判断星星状态
  if (index < integerPartScore) {
    return 'ri:star-fill';     // 全星
  } else if (index === integerPartScore && hasHalfScore) {
    return 'ri:star-half-line'; // 半星（仅在有余数时显示）
  } else {
    return 'ri:star-line';     // 空星
  }
});

const rateClass = computed(() => (rate: number) => {
  const rateTotal = rate /2;
  const integerPartRate = Math.floor(rateTotal); // 总星数的整数部分（包含半星换算）
  const hasHalfRate = rateTotal % 1 !== 0; // 是否存在半星
  if (rate < integerPartRate) {
    return 'ri:star-fill';     // 全星
  } else if (rate === integerPartRate && hasHalfRate) {
    return 'ri:star-half-line'; // 半星（仅在有余数时显示）
  } else {
    return 'ri:star-line';     // 空星
  }
})
</script>

<template>
  <div class="bgmInfoMainCard card-layout-horizontal">
    <div class="bgmInfoImageWarrper card-image-landscape">
      <NuxtImg :src="bangumiCollectionItem.subject?.images.common" :alt="bangumiCollectionItem.subject.name" class="banguimImage"/>
    </div>
    <div class="bgmInfoConnect">
      <section class="bgmInfoMainSection">
        <div class="title">
          <h3 class="fontColor">
            {{ bangumiCollectionItem.subject.name_cn }}
            <sup>
              {{ bangumiCollectionItem.subject.name }}
            </sup>
          </h3>
        </div>
        <p class="desc">
          {{ bangumiCollectionItem.subject.short_summary }}
        </p>
      </section>
      <section class="bgmInfoSection">
        <div class="infoStars">
          <div class="ratingStarsIcon">
            <Icon class="star-icon star-filled" v-for="(_ , index) in 5"  :key="index" :name="scoreClass(index)" />
          </div>
          <div class="ratingStarsNumber">
            {{ bangumiCollectionItem.subject.score }}
          </div>
        </div>
        <div class="infoTagList">
          <span class="infoTag" v-for="tags in bangumiCollectionItem.subject.tags">
            {{ tags.name }}
            <sup> {{ tags.count }} </sup>
          </span>
        </div>
        <div class="infoCombinedList">
          <div class="infoCombinedCard">
            <div class="label">
              话数:
            </div>
            <div class="value">
              {{ bangumiCollectionItem.subject.eps }}
            </div>
          </div>
          <div class="infoDate">
            <Icon name="ph:calendar-dots-bold" />
            {{ getPostDate(bangumiCollectionItem.updatedd_at) }}
          </div>
        </div>
        <div class="footer">
          <div class="source-badge">
            <div class="source-name">
              <Icon name="ri:bilibili-line" class="source-icon" />
              Bangumi
            </div>
          </div>
          <button class="view-button" @click="handleClick()">
            <span>查看详情</span>
            <Icon name="ri:arrow-right-line" class="buttonIcon" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .bgmInfoMainCard {
    cursor: pointer;
    display: flex;
    background: var(--ld-bg-card);
    border: 1px solid var(--c-border);
    border-radius: 0.75em;
    margin: 1.5em 0px;
    overflow: hidden;
    transition: border-color 0.2s;
    @media (max-width: 480px) {
      margin: 0.75em 0px;
      gap: 0.5em;
      padding: 0.25em;
    }
    @media (max-width: 786px) {
      flex-direction: column;
    }

    .bgmInfoImageWarrper {
      flex-shrink: 0;
      position: relative;
      background: var(--c-border);
      border-radius: 0.5em;
      overflow: hidden;
      @media (max-width: 480px) {
        height: 320px;
        width: 100%;
      }
      @media (max-width: 768px) {
        height: 360px;
        min-width: unset;
        width: 100%;
      }

      .banguimImage {
        height: 100%;
        object-fit: cover;
        object-position: center center;
        width: 100%;
        background: var(--ld-bg);
      }
    }
    .bgmInfoConnect {
      align-items: start;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1em;
      @media (max-width: 768px) {
        gap: .75em;
        grid-template-columns: 1fr;
      }

      .bgmInfoMainSection {
        display: flex;
        flex-direction: column;
        min-width: 0px;
        gap: 0.5em;

        .title {
          display: flex;
          flex-direction: column;
          gap: 0.25em;

          .fontColor {
            color: var(--c-text);
            font-family: var(--font-basic, sans-serif);
            font-size: 1.25em;
            font-weight: 600;
            line-height: 1.3;
            word-break: break-word;
            margin: 0px;
            sup {
              opacity: 0.6;
              font-size: 75%;
              line-height: 0;
              vertical-align: baseline;
            }
          }
        }

        .desc {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          line-clamp: 5;
          line-height: 1.5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .bgmInfoSection {
        display: flex;
        flex-direction: column;
        font-size: 0.875em;
        gap: 0.5em;

        .infoStars {
          align-items: center;
          background: linear-gradient(135deg, color-mix(in srgb, #ffc107 8%, transparent), color-mix(in srgb, #ffc107 3%, transparent));
          border: 1px solid color-mix(in srgb, #ffc107 20%, transparent);
          border-radius: .5em;
          display: flex;
          gap: .5em;
          margin-bottom: .5em;
          padding: .25em .5em;
          position: relative;
          ::before {
            background: linear-gradient(135deg, color-mix(in srgb, #ffc107 15%, transparent), transparent);
            border-radius: .5em;
            content: "";
            inset: 0;
            opacity: 0;
            position: absolute;
            transition: opacity .2s ease;
          }

          .ratingStarsIcon {
            display: flex;
            gap: 2px;

            .star-icon.star-filled {
              animation: star-pulse-9e9bd9dc 2s ease-in-out infinite;
              color: #ffc107;
            }
            .star-icon {
              filter: drop-shadow(0 1px 2px rgba(255, 193, 7, .3));
              font-size: 1.1em;
              height: 1em;
              transition: all .2s ease;
              width: 1em;
            }
          }

          .ratingStarsNumber {
            background: linear-gradient(135deg, var(--c-text), color-mix(in srgb, #ffc107 30%, var(--c-text)));
            background-clip: text;
            -webkit-background-clip: text;
            color: var(--c-text);
            font-size: .875em;
            font-weight: 700;
            -webkit-text-fill-color: transparent;
            margin-left: .25em;
            position: relative;
            text-shadow: 0 1px 2px rgba(0, 0, 0, .1);

::after {
  background: linear-gradient(90deg, #ffc107, transparent);
  bottom: -2px;
  content: "";
  height: 1px;
  left: 0;
  opacity: .6;
  position: absolute;
  right: 0;
}
}
}
.infoTagList {
display: flex;
flex-wrap: wrap;
gap: 0.25em;
margin: 0px;

.infoTag {
color: var(--c-primary);
display: inline-block;
font-size: 0.75em;
font-weight: 500;
background: color-mix(in srgb, var(--c-primary) 15%, transparent);
border-radius: 0.25em;
padding: 0.25em 0.5em;
white-space: nowrap;

sup {
  opacity: 0.6;
  top: -0.5em;
  font-size: 10px;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
}
}

.infoCombinedList {
align-items: center;
display: flex;
flex-wrap: wrap;
font-size: 0.875em;
gap: 0.75em;
@media (max-width: 480px) {
align-items: flex-start;
flex-direction: column;
font-size: .75em;
gap: .25em;

>:not(.footer) {
  margin-bottom: .25em;
}
}
@media (max-width: 768px) {
gap: .5rem;
}

.infoCombinedCard {
align-items: center;
display: flex;
gap: 0.25em;

.label {
  color: var(--c-text-2);
  font-weight: 500;
}
.value {
  color: var(--c-text);
  font-weight: 600;
}
}
.infoDate {
align-items: center;
color: var(--c-text-2);
display: flex;
gap: 0.25em;
}
}
}
.footer {
align-items: center;
display: flex;
flex-wrap: wrap;
justify-content: space-between;
margin-top: auto;
padding-top: 0.5em;
border-top: 1px solid var(--c-border);
gap: 1em;
@media (max-width: 480px) {
align-items: stretch;
flex-direction: column;
gap: .5em;
padding-top: .25em;
}
@media (max-width: 768px) {
gap: .75rem
}

.source-badge {
align-items: center;
color: var(--c-text-2);
display: flex;
font-size: 0.875em;
font-weight: 500;
gap: 0.25em;
}
.view-button {
align-items: center;
cursor: pointer;
display: flex;
font-size: 0.875em;
font-weight: 500;
background: var(--c-border);
border-width: initial;
border-style: none;
border-color: initial;
border-image: initial;
border-radius: 0.25em;
gap: 0.25em;
padding: 0.25em 0.5em;
transition: 0.2s;
@media (max-width: 480px) {
font-size: .75em;
min-height: 36px;
padding: .25em;
}
@media (max-width: 768px) {
justify-content: center;
width: 100%;
}
}
}
}
}
.card-layout-horizontal {
align-items: stretch;
display: flex;
width: 100%;
gap: 1em;
padding: 0.75em;
}
.card-image-landscape {
height: 200px;
min-width: 150px;
width: 150px;
}
.bgmInfoConnect {
display: flex;
flex-direction: column;
justify-content: space-between;
min-width: 0px;
flex: 1 1 0%;
gap: 0.5em;
}
.desc, .card-subtitle {
color: var(--c-text-2);
font-size: 0.9375em;
margin: 0px;
}
.source-name, .view-button {
color: var(--c-text);
white-space: nowrap;
}
@media (max-width: 768px) {
.card-layout-horizontal {
flex-direction: column;
gap: 0.75em;
padding: 0.5em;
}
}
</style>