const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const data = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/data/local-albums.js', 'utf8'), data);
const identities = JSON.stringify(data.window.IU_LOCAL_TRACKS.map(t => [t.id, t.title, t.neteaseId, t.publishTime]));
vm.runInNewContext(fs.readFileSync('dist/data/song-titles.js', 'utf8'), data);
const names = data.window.IU_SONG_TITLES;
assert.equal(Object.keys(names).length, 414);
assert.equal(JSON.stringify(data.window.IU_LOCAL_TRACKS.map(t => [t.id, t.title, t.neteaseId, t.publishTime])), identities);
for (const name of Object.values(names)) {
  assert.match(name.zh, /[\u3400-\u9fff]/);
  assert.ok(name.title && !name.title.endsWith(' - IU'));
  assert.ok(!/原唱|电视剧|资料待补/.test(name.zh));
}
const base = process.argv[2] || 'http://127.0.0.1:4174';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [320, 390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/app-preview.html');
      await page.locator('.card').first().waitFor();
      for (const light of [true, false]) {
        await page.evaluate(light => document.body.classList.toggle('light', light), light);
        const cards = await page.locator('.card').evaluateAll(cards => cards.map(card => ({
          id: card.dataset.id, title: card.querySelector('strong').textContent,
          zh: card.querySelector('small').textContent,
          titleSize: parseFloat(getComputedStyle(card.querySelector('strong')).fontSize),
          zhSize: parseFloat(getComputedStyle(card.querySelector('small')).fontSize)
        })));
        for (const card of cards) {
          assert.equal(card.title, names[card.id].title);
          assert.equal(card.zh, names[card.id].zh);
          assert.ok(card.zhSize < card.titleSize);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width !== 320) await page.screenshot({ path: 'work/song-titles-' + width + '-' + (light ? 'light' : 'dark') + '.png' });
      }
      while (await page.locator('.library-more').isVisible()) await page.locator('.library-more').click();
      assert.equal(await page.locator('.card').count(), 414);
      const all = await page.locator('.card').evaluateAll(cards => cards.map(c => [c.dataset.id, c.querySelector('small').textContent]));
      for (const [id, zh] of all) assert.equal(zh, names[id].zh);
      await page.locator('#searchInput').fill('从这颗星');
      assert.ok(await page.locator('.card').count() > 0);
      await page.locator('.card').first().dblclick();
      assert.equal(await page.locator('#title').innerText(), '이 별로부터');
      assert.equal(await page.locator('#subtitle').innerText(), '从这颗星');
      assert.deepEqual(errors, []);
      await context.close();
      console.log('PASS: all 414 titles, Chinese search, both themes, viewport ' + width);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
