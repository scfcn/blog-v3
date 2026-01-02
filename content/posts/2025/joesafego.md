---
title: Joe再续前缘SafeGo适配魔改
date: 2025-07-25 21:39:00
updated: 2026-01-02 12:00:00
type: tech
categories: [技术干货]
tags: [Joe魔改]
recommend: 15
description: SafeGo插件适配Joe再续前缘主题，替换goto.php文件实现安全跳转页面功能，支持配置倒计时、Base64编码、头像、标题等，提供黑暗模式选项。
image: https://image.keimgae.fun/imgse/3/20250725/6e75b64e831e51a914a4f8ca99702464.webp
---

## 原项目项目是柳神开发的Hexo插件[安全跳转页面·插件版](https://blog.liushen.fun/posts/1dfd1f41/)，我使用AI移植到了Joe再续前缘主题。
### Joe再续前缘的外链中间页地址是/usr/themes/joe/module/goto.php,复制以下代码直接全部替换即可！
### 效果如图
::pic
---
src: https://i.p-i.vip/135/20260102-695773baa9fba.png
caption: SafeGo安全跳转页面效果预览
---
::

```php
<?php
// 检查必要条件
if (!defined('__TYPECHO_ROOT_DIR__') || empty($_SERVER['HTTP_HOST'])) {
    http_response_code(404);
    exit;
}

// 获取 URL 参数
function GetQueryString($name) {
    $query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
    parse_str($query, $params);
    return isset($params[$name]) ? urldecode($params[$name]) : null;
}

// Base64 解码函数
function base64Decode($input) {
    return base64_decode($input);
}

// 配置参数，可根据需要修改
$countdown = 10; // 倒计时秒数
$url_param_name = 'url'; // URL 参数名
$enable_base64_encode = true; // 是否启用 Base64 编码
$avatar = $this->options->JFavicon; // 头像链接
$title = $this->options->title; // 标题
$subtitle = '大理寺卿'; // 副标题
$darkmode = false; // 是否启用黑暗模式

// 获取跳转 URL
$jump_url = GetQueryString($url_param_name);
if ($enable_base64_encode) {
    $jump_url = base64Decode($jump_url);
}

// 检查 URL 格式
$UrlReg = '/^((http|https|thunder|qqdl|ed2k|Flashget|qbrowser|ftp|rtsp|mms):\/\/)/';
if (!$jump_url ||!preg_match($UrlReg, $jump_url)) {
    $title = '参数错误，正在返回首页...';
    $jump_url = $_SERVER['HTTP_HOST'];
}
?>

<!DOCTYPE html>
<html lang="zh">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="robots" content="noindex, nofollow"/>
    <title><?php echo $title; ?></title>
    <style type="text/css">
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            overflow: hidden;
            flex-direction: column;
        }
      .avatar-placeholder, .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 15px;
            display: block;
        }
      .avatar {
            display: none;
        }
      .description {
            font-size: 18px;
        }
      .subtitle {
            font-size: 12px;
            margin-bottom: 20px;
            color: #C4C4C4;
        }
      .loading {
            text-align: center;
            padding: 30px;
            border-radius: 18px;
            animation: fadein 2s;
            width: 400px;
            max-width: 90%;
        }
        @keyframes fadein {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
      .content {
            margin-bottom: 20px;
        }
      .url-text {
            margin-bottom: 10px;
            font-size: 16px;
            letter-spacing: 1px;
        }
      .jump-url {
            font-size: 20px;
            display: block;
            margin-top: 5px;
            margin-bottom: 25px;
            padding: 15px;
            border-radius: 8px;
            height: 25px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
      .countdown-text {
            margin-top: 12px;
            font-size: 12px;
        }
      .button-container {
            display: flex;
            justify-content: center;
            gap: 20%;
            margin-top: 20px;
        }
      .button {
            padding: 10px 20px;
            border-radius: 16px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            width: 120px;
            height: 40px;
        }
      .cancel-button {
            color: black;
        }
      .confirm-button {
            color: white;
        }
      .progress-bar {
            width: 100%;
            border-radius: 5px;
            overflow: hidden;
            height: 10px;
            margin-top: 20px;
        }
      .progress {
            width: 100%;
            height: 100%;
            transition: width 1s;
        }
        <?php if ($darkmode): ?>
        body {
            background: linear-gradient(135deg, #364f6b, #222831);
        }
      .loading {
            background: #393e46;
            color: #EFEFEF;
            box-shadow: 0 4px 8px rgba(100, 100, 100, 0.1);
        }
      .description {
            color: #F3F3F3;
        }
      .url-text, .countdown-text {
            color: #EFEFEF;
        }
      .jump-url {
            border: 1px solid #777;
            background-color: #333;
            color: #EFEFEF;
        }
      .cancel-button {
            background-color: #872C2C;
            color: #FFF;
        }
      .confirm-button {
            background-color: #28566F;
            color: #FFF;
        }
      .progress-bar {
            background-color: #444;
        }
      .progress {
            background-color: #888;
        }
        <?php else: ?>
        body {
            background: linear-gradient(135deg, #E9E9E9, #FFFFFF);
        }
      .loading {
            background: rgba(255, 255, 255, 0.7);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      .url-text {
            color: #333;
        }
      .jump-url {
            border: 1px solid #ccc;
            background-color: #F7F9FE;
            color: #333;
        }
      .countdown-text {
            color: #515151;
        }
      .cancel-button {
            background-color: #a6e3e9;
        }
      .confirm-button {
            background-color: #3fc1c9;
        }
      .progress {
            background-color: #abedd8;
        }
        <?php endif; ?>
    </style>
    <script type="text/javascript">
        const host = window.location.host;
        let countdown = <?php echo $countdown; ?>;
        let jump_url = '<?php echo $jump_url; ?>';
        let progressElement;
        let countdownElement;
        let countdownTextElement;
        let jumpUrlElement;

        function updateCountdown() {
            if (countdown < 0) {
                countdownTextElement.textContent = "💡自行点击跳转，请注意您的账号和财产安全";
                return;
            }
            countdownElement.textContent = countdown;
            progressElement.style.width = (countdown / <?php echo $countdown; ?> * 100) + '%';
            if (countdown === 0) {
                jump();
            } else {
                countdown--;
                setTimeout(updateCountdown, 1000);
            }
        }

        function jump() {
            location.href = jump_url;
        }

        function closeWindow() {
            window.opener = null;
            window.close();
        }

        function loadAvatar() {
            const avatarImg = document.querySelector('.avatar');
            const placeholder = document.querySelector('.avatar-placeholder');
            const img = new Image();
            img.src = '<?php echo $avatar; ?>';
            img.onload = function () {
                avatarImg.src = img.src;
                avatarImg.style.display = 'block';
                placeholder.style.display = 'none';
            }
        }

        window.addEventListener('load', function () {
            loadAvatar();
            progressElement = document.getElementById('progress');
            countdownElement = document.getElementById('countdown');
            countdownTextElement = document.querySelector('.countdown-text');
            jumpUrlElement = document.getElementById('jump-url');
            jumpUrlElement.textContent = jump_url;
            updateCountdown();
        });
    </script>
</head>
<body>
    <div class="avatar-placeholder"></div>
    <img src="" alt="头像" class="avatar">
    <div class="description"><?php echo $title; ?></div>
    <div class="subtitle"><?php echo $subtitle; ?></div>
    <div class="loading">
        <div class="content">
            <div class="url-text">您即将离开本站，跳转到：</div>
            <div class="jump-url" id="jump-url"></div>
        </div>
        <div class="countdown-text">⚡将在<span id="countdown"></span>秒后跳转，请自行确认链接安全性</div>
        <div class="progress-bar">
            <div class="progress" id="progress"></div>
        </div>
        <div class="button-container">
            <button class="button cancel-button" onclick="closeWindow()">取消跳转</button>
            <button class="button confirm-button" onclick="jump()">立即跳转</button>
        </div>
    </div>
</body>
</html>
```

### 目前可配置项如下
::pic
---
src: https://i.p-i.vip/135/20260102-695773dedb934.png
caption: SafeGo配置项展示
---
::
