---
title: Github Actions 实现雨云自动签到
date: 2025-10-06 12:33:00
type: tech
categories: [技术干货]
tags: [Github, 雨云自动签到]
summary: 利用GitHub Actions实现雨云自动签到，通过配置Secrets和启用工作流，实现定时运行Python脚本完成登录、验证码识别和签到，每日UTC+8 12点自动执行，失败会重试。
image: https://image.lolimi.cn/2025/10/06/68e3453458717.png
---

## 国庆放假，闲着没事干，在各大群里摸鱼，偶然发现了一个[项目](https://github.com/SerendipityR-2022/Rainyun-Qiandao)
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a746ad6730.png
caption: mgeldm9s.png
---
::
### 但实际部署到服务器感觉挺麻烦的。况且各种环境和内存占用确实一言难尽。我注意到项目使用python脚本运行，这刚好可以依赖于`Github ACtions`定时运行，说干就干。
### 我将项目拉到本地，删除依赖于java的旧版本，尝试运行，发现chrome与driver版本不兼容，从[115及以上版本](https://googlechromelabs.github.io/chrome-for-testing/)下载了141版本，替换掉旧的。
### 修复了`chromedriver`版本问题后，终于可以正常创建浏览器页面，登录·识别验证码·签到成功了！
### 让AI写了个`workflows`模板，将项目推送到`Github`，进行第一次尝试，不出所料，失败了。接下来就是压榨AI，将报错一次次丢给它，再一次次推送修复后的代码，还是很枯燥的，最终AI不负所望，成功修复。
### 基本的开发就完成了，下面开始教程。
## Fork我的仓库[Rainyun-Qiandao](https://github.com/scfcn/Rainyun-Qiandao/),取个好听的名字。
::quote
点个Star⭐，球球了球球了！
::
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a7418e8306.png
caption: mgem2gjf.png
---
::
## 配置登录信息
::quote
如果是公开仓库，你也不希望人人都能登录你的雨云账户吧。
::
### 点击Settings-->Secrets/actions，创建两个仓库秘密，分别为`RAINYUN_USER`和`RAINYUN_PASS`
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a743451e82.png
caption: mgem86gy.png
---
::
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a749b220b1.png
caption: mgem8ra0.png
---
::
## 大功告成，你离成功只差一步！
### 转到Actions页面，点击启用
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a74fb0ee6c.png
caption: mgem9if1.png
---
::
### 选择`Rainyun 自动签到`工作流，点击右侧的启用按钮。
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a74fad07c0.png
caption: mgemai6j.png
---
::
### 点击右侧的`Run workflow`
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a74f38f515.png
caption: mgembvbk.png
---
::
::quote
运行时间可能较长，原项目的识别率高达`48.3%`，失败会自动重试，不必担心。
::
::quote
每日自动运行时间为`UTC +8`的12点，可能会有`30min`左右偏差，此为正常。
::
### 如果出现以下字样，表示运行成功，签到成功！恭喜!<font color="red">Congratulations</font>
::pic
---
src: https://pic.wudu.ltd/pic/2025/11/29/692a74f35f2e3.png
caption: mgemfmij.png
---
::
## 鸣谢(排名不分先后)
#### 鸣谢原项目作者提供架构[SerendipityR-2022](https://github.com/SerendipityR-2022/Rainyun-Qiandao)
#### 鸣谢[Github Action](https://github.com/)提供运行平台
#### 鸣谢[Trae CN](https://www.trae.cn/)提供程序修改支持
## 每日一图（来自哲风）
::pic
---
src: https://i.p-i.vip/135/20251129-692ad884d08dc.webp
caption: 中秋快乐
---
::
::quote
<font color="orange">中Cia快llo～(∠・ω< )⌒☆</font>
::
