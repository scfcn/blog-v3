import { readFileSync, writeFileSync } from 'fs';

const MY_SITE_URL = process.env.MY_SITE_URL || 'https://www.qixz.cn/';
const TIMEOUT = 15000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FriendLinkChecker/1.0)',
        ...options.headers,
      },
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function checkSiteConnectivity(url) {
  try {
    const response = await fetchWithTimeout(url);
    if (response.ok) {
      return {
        status: 'pass',
        message: `HTTP ${response.status}`,
      };
    }
    return {
      status: 'fail',
      message: `HTTP ${response.status}`,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        status: 'fail',
        message: '请求超时',
      };
    }
    return {
      status: 'fail',
      message: error.message || '无法访问',
    };
  }
}

async function checkLinkBack(linkPageUrl, mySiteUrl) {
  if (!linkPageUrl) {
    return {
      status: 'fail',
      message: '未提供友链页面地址',
    };
  }

  try {
    const response = await fetchWithTimeout(linkPageUrl);
    if (!response.ok) {
      return {
        status: 'fail',
        message: `友链页面无法访问 (HTTP ${response.status})`,
      };
    }

    const html = await response.text();
    const myUrlWithoutProtocol = mySiteUrl.replace(/^https?:\/\//, '');
    
    const patterns = [
      mySiteUrl,
      myUrlWithoutProtocol,
      mySiteUrl.replace(/\/$/, ''),
      myUrlWithoutProtocol.replace(/\/$/, ''),
    ];

    const found = patterns.some(pattern => 
      html.toLowerCase().includes(pattern.toLowerCase())
    );

    if (found) {
      return {
        status: 'pass',
        message: '已找到本站链接',
      };
    }

    return {
      status: 'fail',
      message: '未找到本站链接',
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        status: 'fail',
        message: '友链页面请求超时',
      };
    }
    return {
      status: 'fail',
      message: error.message || '无法访问友链页面',
    };
  }
}

async function checkAvatarValid(avatarUrl) {
  if (!avatarUrl) {
    return {
      status: 'fail',
      message: '未提供头像链接',
    };
  }

  try {
    const response = await fetchWithTimeout(avatarUrl, { method: 'HEAD' });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        return {
          status: 'pass',
          message: '头像可访问',
        };
      }
      return {
        status: 'warn',
        message: `非图片类型: ${contentType || 'unknown'}`,
      };
    }
    return {
      status: 'fail',
      message: `HTTP ${response.status}`,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        status: 'fail',
        message: '请求超时',
      };
    }
    return {
      status: 'fail',
      message: error.message || '无法访问',
    };
  }
}

async function checkSSL(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:') {
      return {
        status: 'warn',
        message: '未使用 HTTPS',
      };
    }
    return {
      status: 'pass',
      message: 'HTTPS 已启用',
    };
  } catch {
    return {
      status: 'fail',
      message: '无效的 URL',
    };
  }
}

async function main() {
  let data = {};
  try {
    data = JSON.parse(readFileSync('issue-data.json', 'utf8'));
  } catch (e) {
    console.error('Failed to read issue-data.json:', e.message);
  }

  console.log('Checking friend link for:', data.link);
  console.log('Link page:', data.linkPage);

  const [siteConnectivity, linkBack, avatarValid, sslValid] = await Promise.all([
    checkSiteConnectivity(data.link),
    checkLinkBack(data.linkPage, MY_SITE_URL),
    checkAvatarValid(data.avatar),
    checkSSL(data.link),
  ]);

  const allPassed = 
    siteConnectivity.status === 'pass' && 
    linkBack.status === 'pass' && 
    avatarValid.status !== 'fail';

  const result = {
    data,
    siteConnectivity,
    linkBack,
    avatarValid,
    sslValid,
    allPassed,
    checkedAt: new Date().toISOString(),
  };

  writeFileSync('check-result.json', JSON.stringify(result, null, 2));
  console.log('Check result:', JSON.stringify(result, null, 2));
}

main().catch(console.error);
