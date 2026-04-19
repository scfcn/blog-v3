---
title: Joe再续前缘魔改（一）
date: 2025-07-28 13:47:00
updated: 2026-01-02 12:00:00
type: tech
categories: [技术干货]
tags: [魔改, Joe]
recommend: 12
description: 本文介绍了如何为Joe主题添加友链状态页面，需先部署友链检测项目，并在博客中添加`ckflink.php`文件。教程还指导了在后台配置独立页面，并展示了前端效果预览。
image: https://s3.qixz.cn/ywty/2026/04/19/69e4418d1b93f.webp
---

## 本文系Joe再续前缘主题魔改类第一篇正式教程，前置教程请见.
::quote{icon="ph:info-circle-duotone"}
[Joe再续前缘魔改铺垫（一）](/2025/joemgpd1)
::
## 这一期讲讲新增友链状态页面，需要提前部署[友链检测](https://github.com/willow-god/check-flink)项目。

::quote{icon="ph:info-circle-duotone"}
具体部署教程详见[Github Action实现友链状态检测](https://blog.liushen.fun/posts/c2262998/)
::

## 部署完成后，请在博客文件夹中的/usr/themes/joe里新增`ckflink.php`
#### 代码如下

```php
<?php

/**
 * 友链状态
 *
 * @package custom
 *
 **/

if (!defined('__TYPECHO_ROOT_DIR__')) {
    http_response_code(404);
    exit;
}
$this->need('module/single/pjax.php');
?>

<!DOCTYPE html>
<html lang="zh">
  <head>
    <?php $this->need('module/head.php') ?>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex" />
    <link
      href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      rel="stylesheet"
    />
    <style>
      :root {
        --primary-color: #2c3e50;
        --secondary-color: #3498db;
        --accent-color: #e74c3c;
        --text-color: #34495e;
        --background-color: #fff;
        --code-background-color: #efefef;
      }

      body.dark {
        --primary-color: #a0c1e6;
        --secondary-color: #5dade2;
        --accent-color: #e74c3c;
        --text-color: #e0e0e0;
        --background-color: #1a1a2e;
        --code-background-color: #2d2d44;
      }

      .joe_container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
      }

      .joe_main {
        background-color: var(--background-color);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
      }

      .flink-status-container {
        font-family: "KingHwa_OldSong", "Noto Serif SC", serif;
        padding: 40px 20px;
        background-color: var(--background-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .container {
        max-width: 900px;
        width: 100%;
        padding: 0 20px;
      }

      .header {
        text-align: center;
        margin-bottom: 40px;
        position: relative;
      }

      h1 {
        font-size: 2.8rem;
        color: var(--primary-color);
        margin: 20px 0;
        position: relative;
      }

      h1::after {
        content: "";
        display: block;
        width: 60%;
        height: 3px;
        background: var(--secondary-color);
        margin: 10px auto 0;
      }

      .subtitle {
        font-size: 1.1rem;
        color: #7f8c8d;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
      }

      .total-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-top: 30px;
      }

      @media (min-width: 1200px) {
        .total-info {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (max-width: 380px) {
        .total-info {
          grid-template-columns: repeat(1, 1fr);
        }
      }

      .total-status-card {
        background: var(--background-color);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        font-size: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease-in-out;
      }

      .dark .total-status-card {
        border-color: rgba(255, 255, 255, 0.1);
      }

      .total-status-card span {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .total-status-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-3px);
      }

      .status-grid {
        display: grid;
        gap: 15px;
        margin-top: 15px;
      }

      .status-grid.other {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .status-grid.error {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }

      .fail_counts {
        margin-right: 10px;
        color: #000000a5;
      }

      .dark .fail_counts {
        color: #ffffffa5;
      }

      .status-card {
        display: flex;
        background: var(--background-color);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        font-size: 1rem;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease-in-out;
      }

      .dark .status-card {
        border-color: rgba(255, 255, 255, 0.1);
      }

      .status-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-3px);
      }

      .status-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: bold;
        transition: all 0.2s ease-in-out;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status-link:hover {
        color: var(--secondary-color);
      }

      .status-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 6px;
        position: relative;
      }

      .status-dot::before {
        content: "";
        position: absolute;
        top: -4px;
        left: -4px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.5);
          opacity: 0.5;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .status-normal {
        background: green;
      }

      .status-normal::before {
        background-color: rgba(0, 128, 0, 0.2);
      }

      .status-slow {
        background: rgb(255, 200, 0);
      }

      .status-slow::before {
        background-color: rgba(255, 174, 0, 0.2);
      }

      .status-error {
        background: red;
      }

      .status-error::before {
        background-color: rgba(255, 0, 0, 0.2);
      }

      footer {
        margin-top: 50px;
        padding-top: 30px;
        border-top: 1px solid #ecf0f1;
        width: 100%;
        text-align: center;
        color: #95a5a6;
      }

      .dark footer {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      footer a {
        color: #95a5a6;
        text-decoration: none;
        transition: all 0.2s ease-in-out;
      }

      footer a:hover {
        color: var(--secondary-color);
      }
    </style>
  </head>

  <body>
    <?php $this->need('module/header.php') ?>
    <div class="joe_container">
      <div class="joe_main">
        <div class="flink-status-container">
          <div class="container">
            <header class="header">
              <h1>友链状态监控</h1>
              <p class="subtitle">更新时间：<span id="update-time"></span></p>
            </header>
            <section class="total-info" id="total-info">
              <div class="total-status-card">
                <div class="total-status-card-title">
                  <i class="fa-solid fa-users"></i>
                  <span>友链总数</span>
                </div>
                <span id="total-links">加载中...</span>
              </div>
              <div class="total-status-card">
                <div class="total-status-card-title">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>正常友链</span>
                </div>
                <span id="normal-links">加载中...</span>
              </div>
              <div class="total-status-card">
                <div class="total-status-card-title">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>慢速友链</span>
                </div>
                <span id="slow-links">加载中...</span>
              </div>
              <div class="total-status-card">
                <div class="total-status-card-title">
                  <i class="fa-solid fa-circle-xmark"></i>
                  <span>错误友链</span>
                </div>
                <span id="error-links">加载中...</span>
              </div>
            </section>
            <hr
              style="
                width: 100%;
                margin: 15px 0;
                border: 0;
                border-top: 2px solid #00000021;
              "
            />
            <h2 class="error-link-h2">失效友链</h2>
            <section class="status-grid error" id="status-container-error"></section>
            <hr
              class="error-link-hr"
              style="
                width: 100%;
                margin: 15px 0;
                border: 0;
                border-top: 2px solid #00000021;
              "
            />
            <h2 class="other-link-h2">其他友链</h2>
            <section class="status-grid other" id="status-container-other"></section>
            <footer>
              <script defer src="https://cn.vercount.one/js"></script>
              <div style="margin-bottom: 0.5em">
                网站总请求量：<span id="vercount_value_site_pv">🤕</span> |
                独立访客数：<span id="vercount_value_site_uv">🤕</span>
              </div>
            </footer>
          </div>
        </div>
        <?php $this->need('module/single/comment.php'); ?>
      </div>
      <?php joe\isPc() ? $this->need('module/aside.php') : null ?>
    </div>
    <script>
      // 检测暗黑模式
      function checkDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.body.classList.add('dark');
        }
      }

      // 初始检测
      checkDarkMode();

      // 监听暗黑模式变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });

      // 加载友链数据
      fetch("https://你的实际部署域名/result.json")
        .then((response) => response.json())
        .then((data) => {
          // 更新更新时间
          const updateTime = data.timestamp;
          const updateTimeElement = document.getElementById("update-time");
          updateTimeElement.textContent = updateTime;
          const container_error = document.getElementById(
            "status-container-error"
          );
          const container_other = document.getElementById(
            "status-container-other"
          );
          let statusHTML = "";
          const sortedLinks = data.link_status.sort((a, b) =>
            a.latency === -1 ? -1 : b.latency === -1 ? 1 : b.latency - a.latency
          );
          let totalLinks = 0;
          let normalLinks = 0;
          let slowLinks = 0;
          let errorLinks = 0;
          let errorLinksHTML = "";
          let otherLinksHTML = "";
          sortedLinks.forEach((link) => {
            totalLinks++;
            let statusClass = "status-normal";
            let extraInfo = "";
            if (link.latency === -1) {
              statusClass = "status-error";
              errorLinks++;
              extraInfo = `<span class="fail_counts">已持续${link.fail_count}次</span>`;
              errorLinksHTML += `<div class="status-card">
                            <a class="status-link" href="${link.link}" target="_blank" rel="noopener noreferrer noreferrer">${link.name}</a>
                            <div class="fail-details">
                                ${extraInfo}
                                <span class="status-dot ${statusClass}"></span>
                            </div>
                        </div>`;
            } else if (link.latency > 4) {
              statusClass = "status-slow";
              slowLinks++;
              otherLinksHTML += `<div class="status-card">
                        <a class="status-link" href="${link.link}" target="_blank" rel="noopener noreferrer noreferrer">${link.name}</a>
                        <span class="status-dot ${statusClass}"></span>
                    </div>`;
            } else {
              normalLinks++;
              otherLinksHTML += `<div class="status-card">
                        <a class="status-link" href="${link.link}" target="_blank" rel="noopener noreferrer noreferrer">${link.name}</a>
                        <span class="status-dot ${statusClass}"></span>
                    </div>`;
            }
          });
          if (errorLinksHTML) {
            container_error.innerHTML = errorLinksHTML;
          } else {
            // 如果没有错误链接，移除标题和分割线
            const errorTitle = document.querySelector(".error-link-h2");
            const errorHr = document.querySelector(".error-link-hr");
            if (errorTitle) errorTitle.remove();
            if (errorHr) errorHr.remove();
          }
          if (otherLinksHTML) {
            container_other.innerHTML = otherLinksHTML;
          }
          document.getElementById("total-links").textContent = totalLinks;
          document.getElementById("normal-links").textContent = normalLinks;
          document.getElementById("slow-links").textContent = slowLinks;
          document.getElementById("error-links").textContent = errorLinks;
        })
        .catch((error) => console.error("Error loading status:", error));
    </script>
  </body>
</html>
<?php $this->need('module/footer.php') ?>
```
### 然后去博客后台>管理>独立页面>新增>模板选择`友链状态`
::pic
---
src: https://i.p-i.vip/135/20260102-695773009639b.png
caption: 博客后台独立页面添加友链状态模板
---
::
### 前端效果预览
::pic
---
src: https://i.p-i.vip/135/20260102-6957734204ca2.png
caption: 友链状态页面前端效果预览
---
::
## 每日精选
::pic
---
src: https://s3.qixz.cn/ywty/2026/04/19/69e4418d1b93f.webp
caption: 每日一图
---
::
