---
title: Cloudflare、CF优选教程
date: 2025-08-01 08:46:00
type: tech
categories: [技术干货]
tags: [Cloudflare, CF优选]
summary: 本文介绍了Cloudflare优选方法，需准备信用卡和托管于CF的域名。通过添加DNS记录、配置SAAS回退源和自定义主机名，完成域名验证和证书配置。最后修改CNAME记录实现优选配置，建议分线路解析以规避检测。
image: https://qxzhan.cn/img/cfyouxuan.webp
---

# 本期来讲讲Cloudflare的优选方法
### 首先需要一张信用卡来过验证，这样才能使用SAAS（自定义主机回退源），这里不多讲解，还需要一个域名托管于CF，一个域名托管到支持分线路解析的地方。
::quote
为了便于理解，实际访问域名称为`域名A`，托管于CF的回源域名称为`域名B`。
::
::quote
本文的cdn.xnet.ren为访问域名，waf.qzz.io为回源域名。
::
## 一切准备好后，先添加一条DNS记录，作为回源域名`域名B`。
### 记录类型为A，记录值为你的源站IP，开启小黄云。
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/3133992698.png
caption: mds2uaz7.png
---
::
## SAAS配置
### 回退源填写`域名B`。
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/2357721348.png
caption: mds320s2.png
---
::
### 点击`添加自定义主机名`填写你要实际访问域名`域名A`，托管于任何DNS都行，比如阿里云、华为云、DNSPOD等。
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/4149131905.png
caption: mds34obe.png
---
::
## 完成域名验证及证书配置
### 按提示添加DNS记录
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/2312716281.png
caption: mds38h5p.png
---
::
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/104136740.png
caption: mds39e2c.png
---
::
### 点击`刷新`按钮，不要按f5！！！
### 如果出现图示提示
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/754564089.png
caption: mds3bzmm.png
---
::
### 需要添加一条`域名A`的cname记录到`域名B`
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/257280201.png
caption: mds3jkri.png
---
::
### 再次点击`刷新`按钮。
## 均提示为有效后就配置好了。
::pic
---
src: https://qxzhan.cn/usr/uploads/2025/08/326720808.png
caption: mds3lc9h.png
---
::
## 优选配置
### 将上一步添加的`域名A`cname记录改为优选的域名地址，比如`*.cloudflare.182682.xyz`
::quote
最近听说CF查的严，如果可以分线路解析，我们需要将`默认`线路cname到优选地址，`境外`线路cname到`域名B`。
::
# 每日精选
::pic
---
src: https://i.p-i.vip/135/20251129-692ade5d9f367.webp
caption: bizhi
---
::
