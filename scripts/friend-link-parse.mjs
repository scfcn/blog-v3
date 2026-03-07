import { writeFileSync } from 'fs';

const body = process.env.ISSUE_BODY || '';
const issueNumber = process.env.ISSUE_NUMBER || '';
const issueTitle = process.env.ISSUE_TITLE || '';

function parseField(body, label) {
  const patterns = [
    new RegExp(`### ${label}\\s*\\n\\n([^\\n#]+)`, 'i'),
    new RegExp(`### ${label}\\s*\\n([^\\n#]+)`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

const data = {
  issueNumber,
  issueTitle,
  author: parseField(body, '博主昵称'),
  title: parseField(body, '博客名称'),
  desc: parseField(body, '博客描述'),
  link: parseField(body, '博客地址'),
  linkPage: parseField(body, '友链页面地址'),
  avatar: parseField(body, '头像链接'),
  feed: parseField(body, '订阅源'),
  sitenick: parseField(body, '网站趣称'),
  archs: parseField(body, '技术架构'),
  comment: parseField(body, '备注信息'),
};

console.log('PARSED_DATA=' + JSON.stringify(data));

writeFileSync('issue-data.json', JSON.stringify(data, null, 2));
console.log('Issue data saved to issue-data.json');
