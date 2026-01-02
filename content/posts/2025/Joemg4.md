---
title: Joe再续前缘魔改（四）
date: 2025-08-25 20:23:00
type: tech
categories: [技术干货]
tags: [魔改, Joe]
recommend: 12
description: 文章介绍了如何为网站添加个性化定位欢迎信息功能，主要使用JavaScript代码实现。通过调用IP查询API获取用户位置信息，并根据用户所在地显示不同的欢迎语和距离提示。代码还包含根据本地时间切换欢迎语的功能，并适配了IPv6地址显示。最后，通过在HTML中添加自定义侧边栏代码，即可实现前端效果。
image: https://scdn.xn--kiv.fun/cn/2025/08/25/68ac55967104c.jpg
---

## 功能介绍

之前在逛[青桔气球](https://blog.qjqq.cn/)网站时，发现了一个非常精美的侧边栏欢迎卡片功能。这个功能可以根据用户的地理位置和本地时间显示个性化的欢迎信息。我花费了大约十天的时间，将这个功能适配到了Joe主题中。

::pic
---
src: https://i.p-i.vip/135/20251228-6950a19fb8cb2.png
caption: 个性化定位欢迎信息效果预览
---
::

## 实现原理

该功能主要通过以下步骤实现：

1. **IP地址定位**：调用IP查询API获取用户的地理位置信息
2. **时间判断**：根据用户的本地时间显示不同的欢迎语（如早上好、下午好、晚上好）
3. **距离计算**：显示用户所在地与博主所在地的距离
4. **IPv6支持**：适配IPv6地址显示
5. **侧边栏集成**：将欢迎信息以卡片形式展示在网站侧边栏

## 实现步骤

### 步骤1：获取JavaScript代码

核心JavaScript代码来自[筱序二十の代码分享](https://gist.qixz.cn/qxzhan/9793845b7896488cae8ef10294ef8f30)。

::alert{type="warning"}
**重要提示**：
- 请将代码中的`key?=`后面的内容替换为你自己的API密钥
- API密钥可在[Nice猫](https://api.nsmao.net)网站免费申请
::

### 步骤2：修改主题代码

在网站主题的侧边栏位置添加以下自定义代码：

```html
<div id="welcome-info"></div>
```

::pic
---
src: https://i.p-i.vip/135/20251228-6950a14cba61e.png
caption: 自定义侧边栏代码添加位置
---
::

### 步骤3：配置API密钥

将获取到的JavaScript代码中的API密钥替换为你自己的密钥：

```javascript
// 原代码中的API调用部分
const apiUrl = `https://api.nsmao.net/ip?key=YOUR_API_KEY&ip=${ip}`;
```

将`YOUR_API_KEY`替换为你从Nice猫网站申请到的实际密钥。

## 功能特点

- **个性化欢迎**：根据用户的本地时间显示不同的欢迎语
- **地理位置显示**：显示用户所在的城市和地区
- **距离计算**：显示用户与博主所在地的大致距离
- **IPv6支持**：完美适配IPv4和IPv6地址
- **响应式设计**：适配不同屏幕尺寸
- **轻量级**：不影响网站加载速度

## 注意事项

::alert{type="info"}
- 写文章时注意到原作者已更新代码，新增了IPv6和部分城市匹配功能，本文提供的代码链接为最新版本
- 确保API密钥正确配置，否则功能可能无法正常使用
- 部分浏览器可能会阻止地理位置获取，请确保网站使用HTTPS协议
::

## 效果展示

::pic
---
src: https://i.p-i.vip/135/20251228-6950a19fb8cb2.png
caption: 最终效果预览
---
::

## 参考文章

- [Hexo侧边栏添加个性定位欢迎信息](https://blog.qjqq.cn/posts/2a52.html)
- [筱序二十の代码分享](https://gist.qixz.cn/qxzhan/9793845b7896488cae8ef10294ef8f30)

## 每日精选

::pic
---
src: https://scdn.xn--kiv.fun/cn/2025/08/25/68ac55967104c.jpg
caption: 技术与美学的结合
---
::
