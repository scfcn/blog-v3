---
title: Joe再续前缘魔改铺垫（一）
date: 2025-07-24 13:42:00
updated: 2026-01-02 12:00:00
type: tech
categories: [技术干货]
tags: [魔改, Joe]
recommend: 13
description: 从Hexo安知鱼主题迁移后，旧美化教程不适用，作者研究两三天移植部分内容，本期为魔改教程铺垫。介绍了柳神两个项目“朋友圈精简版”和“友链状态检测”的适配方法，包括新建api文件夹和php文件，实现伪静态静态化json。下期将出适配鱼塘的教程。
image: https://image.lolimi.cn/2025/11/29/692ae259d11ca.webp
---

从 Hexo 安知鱼主题迁移过来后，许多旧的美化教程都不适用了，网上搜搜也找不到多少适配的。

研究了两三天后，已经移植了不少，本期是魔改教程铺垫的第一期，后续会发正式魔改教程。

那时候魔改印象最深刻的还是柳神的两个项目

::quote{icon="ph:info-circle-duotone"}
[朋友圈精简版](https://github.com/willow-god/Friend-Circle-Lite) > [友链状态检测](https://github.com/willow-god/check-flink)
::

具体使用教程请见仓库的 readme 文档，及[柳神](https://blog.liushen.fun/)博客的相关教程。

## 朋友圈精简版 friend.json 适配

### 根目录新建文件夹 api，里面创建`friend.php`文件

::pic
---
src: https://i.p-i.vip/135/20260102-6957710a425d1.png
caption: 在api文件夹中创建friend.php文件
---
::

#### 文件内容如下

```php
<?php
require_once dirname(__FILE__) . '/../config.inc.php';
$db = \Typecho\Db::get();
try {
    $query = $db->select('title', 'url', 'logo')
                ->from('table.friends')
                ->where('status = ?', 1);
    $rows = $db->fetchAll($query);
    $friends = [];
    foreach ($rows as $row) {
        $friends[] = [
            $row['title'],
            $row['url'],
            $row['logo'] ?? ''
        ];
    }
    $output = [
        'friends' => $friends
    ];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (\Typecho\Db\Exception $e) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
```

### 可以使用伪静态实现静态化 json

#### 规则如下

```
rewrite ^/friend.json$ /api/friend.php;
```

::pic
---
src: https://image.lolimi.cn/2025/11/29/692ae264f3600.webp
caption: 朋友圈精简版功能展示配图
---
::

## 友链状态检测 flink_count.json 适配

### 根目录新建文件夹 api，里面创建`flink_count.php`文件

::pic
---
src: https://i.p-i.vip/135/20260102-6957712eb71cf.png
caption: 在api文件夹中创建flink_count.php文件
---
::

#### 文件内容如下

```php
<?php
require_once dirname(__FILE__) . '/../config.inc.php';
$db = \Typecho\Db::get();
try {
    $query = $db->select('title', 'url', 'logo', 'description')
                ->from('table.friends')
                ->where('status = ?', 1);
    $rows = $db->fetchAll($query);
    $link_list = [];
    foreach ($rows as $row) {
        $name = $row['title'];
        $link = $row['url'];
        $avatar = $row['logo'] ?? '';
        $descr = $row['description'];
        $siteshot = "https://v2.xxapi.cn/api/screenshot?url=" . urlencode($link) . "&return=302";

        $link_list[] = [
            "name" => $name,
            "link" => $link,
            "avatar" => $avatar,
            "descr" => $descr,
            "siteshot" => $siteshot
        ];
    }
    $length = count($link_list);
    $output = [
        "link_list" => $link_list,
        "length" => $length
    ];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (\Typecho\Db\Exception $e) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
```

### 可以使用伪静态实现静态化 json

#### 规则如下

::quote{icon="ph:info-circle-duotone"}
rewrite ^/flink_count.json$ /api/flink_count.php;
::

## 下期出适配鱼塘的教程
