const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4174/app-preview.html');
    await page.waitForSelector('#libraryMore');
    const columns = width === 390 ? 3 : 4;
    assert.equal(await page.locator('#grid .card').count(), columns * 4);
    await page.locator('#libraryMore').click();
    assert.equal(await page.locator('#grid .card').count(), columns * 8);
    await page.locator('[data-tab="albums"]').click();
    assert.equal(await page.locator('#grid .card').count(), 0);
    assert.equal(await page.locator('#shelf button').count(), 12);
    for (const category of ['正规专辑', '迷你专辑', '日专', '花书签']) {
      await page.locator(`[data-category="${category}"]`).click();
      assert.equal(await page.locator('#grid .card').count(), 0);
      assert.ok(await page.locator('#subShelf button').count() > 0);
      await page.locator('#subShelf button').first().click();
      assert.ok(await page.locator('#grid .card').count() > 0);
      assert.equal(await page.locator('#shelf button').count(), 12);
    }
    await page.locator('[data-category="单曲"]').click();
    assert.equal(await page.locator('#subShelf').isVisible(), false);
    assert.ok(await page.locator('#grid .card').count() > 0);
    await page.locator('[data-tab="songs"]').click();
    await page.locator('#grid .card').first().dblclick();
    assert.ok(await page.locator('#lyrics .verse').count() > 0);
    assert.ok(await page.locator('#lyrics .verse small').count() > 0);
    await page.screenshot({ path: `work/library-${width}.png`, fullPage: false });
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ width, cards: await page.locator('#grid .card').count(), lyrics: await page.locator('#lyrics .verse').count(), errors }));
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 900 }, serviceWorkers: 'block' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4174/');
  await page.waitForSelector('[data-library-tab]');
  await page.locator('[data-library-tab="albums"]').click();
  assert.equal(await page.locator('#trackGrid .trackCard').count(), 0);
  await page.locator('[data-library-category="正规专辑"]').click();
  assert.equal(await page.locator('#trackGrid .trackCard').count(), 0);
  await page.locator('[data-library-album]').first().click();
  assert.ok(await page.locator('#trackGrid .trackCard').count() > 0);
  await page.locator('#trackGrid .trackCard').first().dblclick();
  assert.ok(await page.locator('#lyricsDialog').isVisible());
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ main: 'passed', errors }));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
