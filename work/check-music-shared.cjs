const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:4174';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base);
    const app = page.frameLocator('#musicAppFrame');
    await app.locator('#grid .card').first().waitFor();
    assert.equal(await app.locator('#grid .card').count(), width === 390 ? 12 : 16);
    assert.equal(await app.locator('.brand strong').innerText(), 'UAENA小窝');
    const frame = await (await page.locator('#musicAppFrame').elementHandle()).contentFrame();
    const signature = () => {
      const selectors = ['.app', '.brand strong', '.search', '.grid', '.card strong', '.side', '.nav'];
      return {
        light: document.body.classList.contains('light'),
        styles: selectors.map(s => {
          const c = getComputedStyle(document.querySelector(s));
          return [c.fontSize, c.padding, c.gap, c.gridTemplateColumns, c.backgroundImage, c.backgroundColor];
        }),
        background: getComputedStyle(document.body, '::before').backgroundImage
      };
    };
    const web = await frame.evaluate(signature);
    const preview = await context.newPage();
    await preview.goto(`${base}/app-preview.html`);
    await preview.locator('#grid .card').first().waitFor();
    assert.deepEqual(await preview.evaluate(signature), web);
    assert.equal(await app.locator('.audio-dot').count(), 0);
    assert.equal(await app.locator('.mini').isVisible(), false);
    if (width === 390) {
      const sizes = await frame.evaluate(() => [...document.querySelectorAll('.art')].map(el => {
        const rect = el.getBoundingClientRect();
        return [Math.round(rect.width), Math.round(rect.height)];
      }));
      assert.ok(sizes.every(([w, h]) => w === h && w === sizes[0][0]));
      await app.locator('#grid .card').first().dblclick();
      assert.equal(await app.locator('.track-action').isVisible(), true);
      assert.equal(await app.locator('#side').evaluate(el => el.classList.contains('open')), false);
      await app.locator('.track-action-cancel').click();
      await frame.evaluate(() => choose(0, true));
      await app.locator('.meta').click();
      assert.equal(await app.locator('#side').evaluate(el => el.classList.contains('open')), true);
      const box = await app.locator('#lyrics').boundingBox();
      assert.ok(box.height > 200);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, 500);
      await frame.waitForFunction(() => document.querySelector('#lyrics').scrollTop > 0);
      assert.ok(await app.locator('.maincover').evaluate(el => el.clientWidth <= 180));
      await page.screenshot({ path: 'work/mobile-lyrics-scroll.png' });
      await app.locator('#side .close').click();
    }
    await app.locator('[data-tab="albums"]').click();
    if (width === 390) {
      const slider = app.locator('.shelf-scrollbar').first();
      assert.equal(await slider.isVisible(), true);
      await slider.evaluate(el => { el.value = el.max; el.dispatchEvent(new Event('input')); });
      assert.ok(await app.locator('#shelf').evaluate(el => el.scrollLeft > 0));
    }
    assert.equal(await app.locator('#grid .card').count(), 0);
    await frame.evaluate(async () => {
      await Promise.all([...document.querySelectorAll('#shelf img')].map(img => img.decode()));
    });
    assert.equal(await app.locator('#shelf img').count(), 12);
    await app.locator('[data-category="正规专辑"]').click();
    await frame.evaluate(async () => {
      await Promise.all([...document.querySelectorAll('#subShelf img')].map(img => img.decode()));
    });
    await app.locator('#subShelf button').first().click();
    assert.ok(await app.locator('#grid .card').count() > 0);
    await app.locator('[data-tab="songs"]').click();
    await page.screenshot({ path: `work/shared-music-${width}.png` });
    const musicNav = await app.locator('.nav').boundingBox();
    await app.locator('[data-nav="Tv"]').click();
    await page.waitForFunction(() => document.body.dataset.activeView === 'screen');
    assert.equal(await page.locator('body').getAttribute('data-active-view'), 'screen');
    for (const view of ['screen', 'merch', 'search', 'profile']) {
      await page.locator(`#bottomNav [data-app-view="${view}"]`).click();
      const nav = await page.locator('#bottomNav').boundingBox();
      for (const key of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(nav[key] - musicNav[key]) < 1, `${view} nav ${key}`);
    }
    await page.locator('#bottomNav [data-app-view="music"]').click();
    await app.locator('#grid .card').first().waitFor();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ width, identical: true, albumCovers: 12, nestedCovers: 'loaded', navigation: 'passed', errors }));
    await context.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
