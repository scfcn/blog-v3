<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// 类型定义
interface IPLocation {
	code: number
	msg: string
	data: {
		ip: string
		country: string
		province: string
		city: string
		isp: string
		lat: string
		lng: string
	}
	exec_time: number
	ip: string
}

// 常量配置
const CACHE_KEY = 'visitor_ip_info_cache'
const CACHE_DURATION = 1000 * 60 * 60 // 1小时缓存
const API_KEY = '323291918772572b'
const API_URL = 'https://v1.nsuuu.com/api/ipip'
const REFERENCE_LNG = 120.3074357 // 博主位置经度
const REFERENCE_LAT = 31.4933074 // 博主位置纬度
const DEFAULT_WELCOME_TEXT = '欢迎客观暂住小栈'

// 欢迎语映射数据
const provinceWelcomeMap: Record<string, string> = {
	北京市: '北——京——欢迎你~~~',
	天津市: '讲段相声吧',
	河北省: '山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山',
	山西省: '展开坐具长三尺，已占山河五百余',
	内蒙古自治区: '天苍苍，野茫茫，风吹草低见牛羊',
	辽宁省: '我想吃烤鸡架！',
	吉林省: '状元阁就是东北烧烤之王',
	黑龙江省: '很喜欢哈尔滨大剧院',
	上海市: '众所周知，中国只有两个城市',
	江苏省: '散装是必须要散装的',
	浙江省: '望海楼明照曙霞,护江堤白蹋晴沙',
	河南省: '可否带我品尝河南烩面啦？',
	安徽省: '蚌埠住了，芜湖起飞',
	福建省: '井邑白云间，岩城远带山',
	江西省: '落霞与孤鹜齐飞，秋水共长天一色',
	山东省: '遥望齐州九点烟，一泓海水杯中泻',
	湖北省: '来碗热干面~',
	湖南省: '74751，长沙斯塔克',
	广东省: '来两斤福建人~',
	广西壮族自治区: '桂林山水甲天下',
	海南省: '朝观日出逐白浪，夕看云起收霞光',
	四川省: '康康川妹子',
	贵州省: '茅台，学生，再塞200',
	云南省: '玉龙飞舞云缠绕，万仞冰川直耸天',
	西藏自治区: '躺在茫茫草原上，仰望蓝天',
	陕西省: '来份臊子面加馍',
	甘肃省: '羌笛何须怨杨柳，春风不度玉门关',
	青海省: '牛肉干和老酸奶都好好吃',
	宁夏回族自治区: '大漠孤烟直，长河落日圆',
	新疆维吾尔自治区: '驼铃古道丝绸路，胡马犹闻唐汉风',
	台湾省: '我在这头，大陆在那头',
	香港特别行政区: '永定贼有残留地鬼嚎，迎击光非岁玉',
	澳门特别行政区: '性感荷官，在线发牌',
}

// 城市特定欢迎语映射
const cityWelcomeMap: Record<string, Record<string, string>> = {
	江苏省: {
		南京: '这是我挺想去的城市啦',
		苏州: '上有天堂，下有苏杭',
		无锡市: '栈主所在城市啦',
	},
	浙江省: {

	},
	河南省: {
		郑州市: '豫州之域，天地之中',
		信阳市: '品信阳毛尖，悟人间芳华',
		南阳市: '臣本布衣，躬耕于南阳此南阳非彼南阳！',
		驻马店市: '峰峰有奇石，石石挟仙气嵖岈山的花很美哦！',
		开封市: '刚正不阿包青天',
		洛阳市: '洛阳牡丹甲天下',
	},
	湖北省: {

	},
	广东省: {
		广州市: '看小蛮腰，喝早茶了嘛~',
		深圳市: '今天你逛商场了嘛~',
		阳江市: '阳春合水！博主家乡~ 欢迎来玩~',
	},
}

// 国家欢迎语映射
const countryWelcomeMap: Record<string, string> = {
	美国: 'Let us live in peace!',
	日本: 'よろしく、一緒に桜を見ませんか',
	俄罗斯: '干了这瓶伏特加！',
	法国: 'C\'est La Vie',
	德国: 'Die Zeit verging im Fluge.',
	澳大利亚: '一起去大堡礁吧！',
	加拿大: '拾起一片枫叶赠予你',
}

// 响应式数据
const userLocation = ref<IPLocation | null>(null)
const welcomeText = ref(DEFAULT_WELCOME_TEXT)
const distance = ref<number | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

// 计算属性
const locationDescription = computed(() => {
	if (!userLocation.value?.data)
		return '未知位置'

	const { country, province, city } = userLocation.value.data

	if (country === '中国') {
		return province === city ? province : `${province} ${city}`
	}
	else {
		return country
	}
})

// 时间段问候语
const timeGreeting = computed(() => {
	const hour = new Date().getHours()

	if (hour >= 5 && hour < 11)
		return '🌤️ 早上好，一日之计在于晨！'
	if (hour >= 11 && hour < 13)
		return '☀️ 中午好，记得午休喔~'
	if (hour >= 13 && hour < 17)
		return '🕞 下午好，饮茶先啦！'
	if (hour >= 17 && hour < 19)
		return '🚶‍♂️ 即将下班，记得按时吃饭~'
	if (hour >= 19 && hour < 24)
		return '🌙 晚上好，夜生活嗨起来！'
	return '夜深了，早点休息，少熬夜哦~'
})

// 位置提示语
const locationTip = computed(() => {
	return welcomeText.value
})

// 辅助函数 - 计算两点之间的距离
function getDistance(e1: number, n1: number, e2: number, n2: number): number {
	const R = 6371 // 地球半径（公里）
	const { sin, cos, asin, PI, hypot } = Math

	// 将经纬度转换为弧度
	const getPoint = (e: number, n: number) => {
		e *= PI / 180
		n *= PI / 180
		return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
	}

	const a = getPoint(e1, n1)
	const b = getPoint(e2, n2)
	const c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
	const r = asin(c / 2) * 2 * R

	return Math.round(r)
}

// 缓存管理
function getIpInfoFromCache(): IPLocation | null {
	try {
		const cached = localStorage.getItem(CACHE_KEY)
		if (!cached)
			return null

		const { data, timestamp } = JSON.parse(cached)
		if (Date.now() - timestamp > CACHE_DURATION) {
			localStorage.removeItem(CACHE_KEY)
			return null
		}
		return data
	}
	catch (error) {
		console.error('读取缓存失败:', error)
		return null
	}
}

function setIpInfoToCache(data: IPLocation) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({
			data,
			timestamp: Date.now(),
		}))
	}
	catch (error) {
		console.error('保存缓存失败:', error)
	}
}

// 业务逻辑
// 根据用户位置设置欢迎语
function setWelcomeText(location: IPLocation) {
	if (!location?.data)
		return

	const { country, province, city } = location.data

	if (country === '中国') {
		// 优先使用城市特定欢迎语，否则使用省份默认欢迎语
		welcomeText.value = cityWelcomeMap[province]?.[city]
			|| provinceWelcomeMap[province]
			|| '带我去你的城市逛逛吧！'
	}
	else {
		// 其他国家的欢迎语
		welcomeText.value = countryWelcomeMap[country]
			|| 'Welcome to my blog, friend from around the world!'
	}
}

// 计算用户与博主位置的距离
function calculateDistance(data: IPLocation) {
	try {
		const { lat, lng } = data.data

		// 将字符串转换为数字
		const latNum = Number.parseFloat(lat)
		const lngNum = Number.parseFloat(lng)

		// 检查经纬度是否有效
		if (!isNaN(latNum) && !isNaN(lngNum)) {
			distance.value = getDistance(REFERENCE_LNG, REFERENCE_LAT, lngNum, latNum)
		}
		else {
			distance.value = null
		}
	}
	catch (error) {
		console.error('计算距离失败:', error)
		distance.value = null
	}
}

// 获取用户IP位置信息
async function fetchIPLocation() {
	// 重置状态
	loading.value = true
	errorMessage.value = null

	try {
		// 1. 尝试从缓存获取数据
		const cachedData = getIpInfoFromCache()
		if (cachedData) {
			userLocation.value = cachedData
			setWelcomeText(cachedData)
			calculateDistance(cachedData)
			return
		}

		// 2. 从API获取新数据
		const params = new URLSearchParams()
		params.append('key', API_KEY)

		const fetchOptions = {
			method: 'GET',
			headers: {

			},
		}

		// 设置请求超时
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 3000)

		const response = await fetch(`${API_URL}?${params.toString()}`, {
			...fetchOptions,
			signal: controller.signal,
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			throw new Error(`HTTP错误! 状态码: ${response.status}`)
		}

		const data: IPLocation = await response.json()

		// 处理响应数据
		if (data.data && typeof data.data === 'object') {
			// 保存数据到缓存
			setIpInfoToCache(data)

			// 更新组件状态
			userLocation.value = data
			setWelcomeText(data)
			calculateDistance(data)
		}
		else {
		}
	}
	catch (error) {
		// 错误处理
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				errorMessage.value = '请求超时，请稍后重试'
			}
			else if (error.message.includes('Network')) {
				errorMessage.value = '网络连接失败'
			}
			else {
				errorMessage.value = error.message
			}
		}
		else {
			errorMessage.value = '获取IP位置信息失败'
		}

		console.error('获取IP位置信息失败:', error)

		welcomeText.value = DEFAULT_WELCOME_TEXT
	}
	finally {
		loading.value = false
	}
}

// 组件挂载时初始化
onMounted(() => {
	fetchIPLocation()
})
</script>

<template>
<BlogWidget card title="访客信息">
	<div v-if="loading" class="loading">
		<div class="loading-spinner" />
		<span>获取位置信息中...</span>
	</div>

	<div v-else-if="errorMessage" class="error">
		<div class="error-icon">
			😕
		</div>
		<p>{{ errorMessage }}</p>
		<ZButton text="重试" class="retry-btn" @click="fetchIPLocation" />
	</div>

	<div v-else class="welcome-message">
		<div class="message-content">
			<p>欢迎来自 <b>{{ locationDescription }}</b> 的小友💖</p>
			<p v-if="distance">
				当前位置距博主约 <b>{{ distance }}</b> 公里！
			</p>
			<p><b>{{ timeGreeting }}</b></p>
			<p>Tip：<b>{{ locationTip }}</b></p>
		</div>
	</div>
</BlogWidget>
</template>

<style lang="scss" scoped>
.widget-title {
	color: var(--c-primary);
}

.loading, .error {
	padding: 1rem;
	text-align: center;
	color: var(--c-text-2);
}

.welcome-message {
	padding: 0.5rem;

	.message-content {
		line-height: 1;

		p {
			margin-bottom: 0.3rem;

			&:last-child {
				margin-bottom: 0;
			}

			b {
				color: var(--c-primary);
			}
		}
	}
}

.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.8rem;

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgb(0 0 0 / 10%);
		border-top: 3px solid var(--c-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
}

.error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	.error-icon {
		margin-bottom: 0.5rem;
		font-size: 2rem;
	}
}

.retry-btn {
	margin-top: 0.5rem;

	&:hover,
	&:active {
		color: var(--c-primary);
	}
}
</style>
