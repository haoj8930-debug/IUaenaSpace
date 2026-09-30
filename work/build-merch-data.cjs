const fs = require('fs');
const path = require('path');
const input = 'C:/Users/HaoJi/Desktop/bilibili链接.txt';
const output = 'dist/data/merch.js';
const raw = fs.readFileSync(input, 'utf8').replace(/\r/g, '');
const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
const categories = [];
let current = null;
const headingSet = new Set(['电视剧电影相关','黑胶','专辑','日历台历','教程','会员礼','edam周边','演唱会PB蓝光','翻翻看']);
for (const line of lines) {
  if (line === 'IU周边开箱合集') continue;
  if (headingSet.has(line)) {
    current = { id: line.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/gi, '-'), title: line, items: [] };
    categories.push(current);
    continue;
  }
  const match = line.match(/^(.*?):\s*(https?:\/\/\S+)/);
  if (!match || !current) continue;
  const title = match[1].trim();
  const url = match[2].trim();
  const bvid = (url.match(/video\/(BV[a-zA-Z0-9]+)/) || [])[1] || '';
  current.items.push({ id: `${current.id}-${bvid || current.items.length + 1}`, title, url, bvid, cover: '', owner: '', duration: '', description: '' });
}
async function enrich(item) {
  if (!item.bvid) return item;
  try {
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${item.bvid}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 Codex IU-UAENA archive' },
    });
    if (!response.ok) return item;
    const json = await response.json();
    if (json?.code === 0 && json.data) {
      item.cover = json.data.pic || '';
      item.owner = json.data.owner?.name || '';
      item.duration = json.data.duration ? `${Math.floor(json.data.duration / 60)}:${String(json.data.duration % 60).padStart(2, '0')}` : '';
      item.description = String(json.data.desc || '').split('\n')[0].slice(0, 90);
    }
  } catch {}
  return item;
}
(async () => {
  for (const category of categories) {
    for (const item of category.items) await enrich(item);
  }
  const total = categories.reduce((sum, category) => sum + category.items.length, 0);
  const payload = {
    title: 'IU周边开箱合集',
    updatedAt: new Date().toISOString().slice(0, 10),
    total,
    categories,
  };
  const content = `window.IU_MERCH = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(output, content, 'utf8');
  console.log(`categories ${categories.length}`);
  console.log(`items ${total}`);
  console.log(`with covers ${categories.flatMap((c) => c.items).filter((item) => item.cover).length}`);
})();
