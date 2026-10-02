const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:4174';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/?view=profile`);
    await page.locator('#themeControl').waitFor();
    const app = page.frameLocator('#musicAppFrame');
    for (const theme of ['light', 'dark']) {
      await page.locator(`#themeControl [data-theme="${theme}"]`).click();
      const layout = await page.evaluate(() => {
        const box = selector => {
          const el = document.querySelector(selector), r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, fontSize: getComputedStyle(el).fontSize };
        };
        return { hero: box('.profileHero'), feedback: box('.feedbackCard'), mail: box('.feedbackCard__mail strong'), theme: box('#themeControl'), width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth };
      });
      assert.equal(layout.scroll, layout.width, `Profile ${width} horizontal overflow`);
      assert.ok(parseFloat(layout.mail.fontSize) <= 16);
      assert.ok(layout.mail.right <= width && layout.mail.x >= 0);
      assert.ok(layout.feedback.y >= layout.hero.bottom + 10);
      if (width <= 740) assert.ok(layout.theme.y >= layout.feedback.bottom);
      await page.screenshot({ path: `work/profile-${width}-${theme}.png`, animations: 'disabled', fullPage: true });
    }
    await page.locator('#bottomNav [data-app-view="music"]').click();
    await app.locator('#grid .card').first().waitFor();
    const frame = await (await page.locator('#musicAppFrame').elementHandle()).contentFrame();
    const snapshot = () => ({
      ids: [...document.querySelectorAll('#grid .card')].map(el => el.dataset.id),
      columns: getComputedStyle(document.querySelector('#grid')).gridTemplateColumns,
      cards: [...document.querySelectorAll('#grid .art')].map(el => { const r = el.getBoundingClientRect(); return [r.width, r.height]; }),
      count: document.querySelector('#count').textContent
    });
    const initial = await frame.evaluate(snapshot);
    assert.equal(initial.ids.length, width <= 740 ? 12 : width <= 1040 ? 12 : 16);
    await app.locator('#libraryMore').click();
    const expanded = await frame.evaluate(snapshot);
    assert.equal(expanded.ids.length, initial.ids.length * 2);
    for (const view of ['Profile', 'Tv', 'Present', 'Search', 'Profile']) {
      await app.locator(`[data-nav="${view}"]`).click();
      await page.locator('#bottomNav').waitFor();
      await page.waitForTimeout(200);
      await page.locator('#bottomNav [data-app-view="music"]').click();
      await app.locator('#grid .card').first().waitFor();
      await page.waitForTimeout(100);
      assert.deepEqual(await frame.evaluate(snapshot), expanded, `${width} Music changes after ${view}`);
    }
    await app.locator('[data-tab="albums"]').click();
    assert.equal(await app.locator('#grid .card').count(), 0);
    await app.locator('[data-category="正规专辑"]').click();
    await app.locator('#subShelf button').first().click();
    const album = await frame.evaluate(snapshot);
    await app.locator('[data-nav="Profile"]').click();
    await page.locator('#bottomNav').waitFor();
    await page.waitForTimeout(200);
    await page.locator('#bottomNav [data-app-view="music"]').click();
    await app.locator('#grid .card').first().waitFor();
    assert.deepEqual(await frame.evaluate(snapshot), album);
    assert.equal(await page.locator('.retiredSection, #catalog, #lyricsDialog, #trackDetailDialog').count(), 0);
    assert.equal(await app.locator('#profile, #audioFiles, .audio-dot').count(), 0);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ width, profile: 'passed', hiddenStart: 'passed', navigationCycles: 6, pagination: 'preserved', oldUI: 'removed', errors }));
    await context.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
