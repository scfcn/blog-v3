export interface item {
  name: string
  category: '生产力' | '出行'
  category_color?: '#3af;' | '#3ba;'
  desc: string
  info?: Record<string, string>
  厂商?: Record<string, string>
  tag?: string[]
  image?: string
  date?: string
  src?: string
  money?: number
}
export type manufacturers = {
  cpu_info: 'AMD' | 'INTEL'
  memory_info: 'LPDDR5' | 'LPDDR4' | 'LPDDR3'
  graphics_card_info: 'AMD' | 'NVIDA'
  ssd_info: 'SSD' | 'NVME SSD'
}
export const equipment: item[] = [
  {
    name: "暗影精灵7",
    image: "https://image.lolimi.cn/2026/01/10/6962042a87225.webp",
    src: "https://www.hp.com/cn-zh/gaming-pc/laptops.html",
    category: '生产力',
    desc: "16.1 英寸高端游戏本，采用第 11 代英特尔酷睿处理器平台，属于 OMEN 系列的经典游戏本产品线。",
    info: {
      芯片: "Intel Core i5-11400H",
      内存: "16G LPDDR4 3200MHz",
      显卡: "NVIDIA GeForce RTX 3050",
      存储: "512G PCIE4 SSD",
      机器版本: "入门版",
      机器颜色: "黑色"
    },
    tag: ['游戏本', 'NVIDIA'],
    date: "2022-06-01",
    money: 5799,
  },
  {
    name: "REDMI K40",
    image: "https://image.lolimi.cn/2026/01/10/6962085415926.webp",
    src: "https://www.mi.com/redmik40",
    category: '生产力',
    desc: "一款没有明显短板的旗舰手机，它在性能、屏幕、续航、设计等方面都达到了 2021 年旗舰水平",
    info: {
      芯片: "高通骁龙 870",
      内存: "8GB + 8GB",
      电池容量: "4520mAh",
      存储: "128G",
      机器版本: "主流旗舰版",
      机器颜色: "幻境"
    },
    tag: ['性价比', '红米'],
    date: "2021-04-21",
    money: 2199,
  },
  {
  "name": "狼蛛S31",
  "image": "https://image.lolimi.cn/2026/01/10/69621b164cbed.webp",
  "src": "https://detail.zol.com.cn/1973/1972786/param.shtml",
  "category": "生产力",
  "desc": "一款高性价比有线电竞鼠标，兼顾游戏与办公需求，支持四挡DPI调节与RGB炫彩呼吸灯效，人体工学设计带来舒适握持体验。",
  "info": {
    "传感器": "光学传感器",
    "DPI": "800/1600/2400/3200",
    "连接方式": "有线USB 2.0",
    "机器版本": "入门电竞版",
    "机器颜色": "黑色"
  },
  "tag": ["电竞鼠标", "狼蛛"],
  "date": "2025-08-17",
  "money": 29
  },
  {
  "name": "微星GK50Z",
  "image": "https://image.lolimi.cn/2026/01/10/69621c5338e3f.webp",
  "src": "https://www.msi.cn/Gaming-Gear/VIGOR-GK50Z/Specification",
  "category": "生产力",
  "desc": "一款百元级高性价比有线机械键盘，104键全尺寸布局，搭载高特防尘机械轴体，配备多彩混光与1.8米PVC线缆，兼顾游戏与办公需求，5000万次按压寿命保障耐用性{insert\_element\_0\_}。",
  "info": {
    "轴体": "青轴",
    "按键数": "104键",
    "背光": "多彩混光",
    "连接方式": "有线USB 2.0",
    "机器版本": "入门电竞版",
    "机器颜色": "白色"
  },
  "tag": ["青轴", "微星"],
  "date": "2024-06-15",
  "money": 98
  },
  {
  "name": "倍思 M3s",
  "image": "https://image.lolimi.cn/2026/01/10/69621e9352f31.webp",
  "src": "https://www.baseus.cn/product/detail?skuId=4669",
  "category": "出行",
  "desc": "百元级全能型真无线降噪耳机，搭载ANC3.0自适应降噪技术（降噪深度达-50dB），支持Hi-Res金标认证与LDAC高清解码，配备6麦AI通话降噪系统，总续航长达55小时，IP55级防尘防水，四色可选适配多元风格。",
  "info": {
    "发声单元": "10mm镀钛强磁振膜",
    "蓝牙版本": "蓝牙6.0",
    "降噪能力": "-50dB自适应深度降噪",
    "续航": "单次12小时（关降噪），总续航55小时，10分钟快充续航3小时",
    "机器版本": "标准版",
    "机器颜色": "星海蓝"
  },
  "tag": ["倍思", "降噪耳机"],
  "date": "2025-08-03",
  "money": 198
  },
  {
  "name": "国誉 猫与少年 双肩书包",
  "image": "https://image.lolimi.cn/2026/01/11/69632d7891abc.webp",
  "src": "https://www.kokuyo.cn/",
  "category": "出行",
  "desc": "高颜值双肩包，主打萌系猫主题设计，融合经典简约美学与少年感元素。",
  "info": {
    "材质": "防泼水聚酯纤维（外层）+ 透气网布（内层）",
    "容量": "20L",
    "尺寸": "45cm×30cm×18cm（高×宽×厚）",
    "收纳分层": "主仓（含笔记本电脑隔层）+ 前袋（含笔插/卡片位）+ 双侧弹性侧袋",
    "背负系统": "S型人体工学肩带 + 透气背板",
    "颜色": "奶白灰"
  },
  "tag": ["国誉", "猫与少年"],
  "date": "2025-11-04",
  "money": 169
  }
]