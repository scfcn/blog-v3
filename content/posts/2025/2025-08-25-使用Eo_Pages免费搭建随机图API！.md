---
title: 使用Eo Pages免费搭建随机图API！
date: 2025-08-25 10:40:00
updated: 2025/11/29 19:37:25
type: tech
categories:
  - 文章
  - 技术教程
tags:
  - EdgeOne
summary: 使用Eo Pages搭建随机图API，Fork Acgapi仓库，选择加速区域，部署main分支。访问路径包括/get（双端自适应）、/pc（电脑端）和/pe（移动端），注意调整图片存储和数量。
---

::quote
开学在即，有挺多事情处理，淡更了，抱歉。
::
------------
::quote
琢磨Bing随即图的时候诞生一个念头，既然Bing每日一图可以随机，那为什么不可以搭建属于自己的随机图片API呢？！
::
### 说干就干！
## 其实原理都差不多
### Fork仓库[Acgapi](https://github.com/scfcn/acgapi)
### Eo Pages 创建项目-->导入Git仓库
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/3371991198.png
caption: meqgfvtl.png
---
::
### 加速区域根据你的域名情况选择
| 是否ICP备案 | 服务区域 | 加速区域选择 |
| :--: | :--: | :--: |
|  {x}  | 中国大陆 | 中国大陆可用区 |
|  {x}  | 全球 | 全球可用区（含中国大陆） |
|  { }  | { } | 全球可用区（不含中国大陆）|
### 生产分支选择'main'，点击开始部署即可
## 使用教程
| 返回内容 | 访问路径 |
| :--: | :--: |
|  双端自适应  | /get |
|  电脑端  | /pc |
|  移动端  | /pe |
## 注意事项
### 电脑端图片存储在'acg_pc'，移动端在'acg_m'。默认获取图片名称需为pic_xxxx，格式为png，新增或减少图片需调整'get.js'、'pc.js'和'pe.js'里的'maxImages'值，否则会有图片不存在、无法随机到的各种问题。
# 随机ACG图片 - 筱序二十维护 - [Github仓库](https://github.com/scfcn/acgapi/)
::pic
---
src: https://img.shields.io/github/stars/scfcn/acgapi
caption: Stars
---
::::pic
---
src: https://img.shields.io/github/license/scfcn/acgapi
caption: License
---
::
::pic
---
src: https://api.wudu.ltd/api/acg/
caption: ACG
---
::
