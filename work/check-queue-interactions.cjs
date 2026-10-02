const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4174';

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    proxy: { server: 'http://127.0.0.1:7897', bypass: '127.0.0.1,localhost' }
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, serviceWorkers: 'block' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/app-preview.html`);
    await page.locator('.card').nth(1).waitFor();
    const initialId = await page.evaluate(() => tracks[selected].id);
    const card = page.locator('.card').nth(1);
    const cardId = await card.getAttribute('data-id');

    await card.click();
    assert.equal(await page.evaluate(() => tracks[selected].id), initialId);
    assert.equal(await page.locator('.mini').isVisible(), false);
    assert.equal(await page.locator('.track-action').isVisible(), false);

    await card.click();
    await page.locator('.track-action').waitFor();
    assert.equal(await page.locator('#trackActionTitle').textContent(), await page.evaluate(id => titleFor(tracks.find(track => track.id === id)), cardId));
    await page.getByRole('button', { name: '加入播放列表', exact: true }).click();
    assert.ok(await page.evaluate(id => queueIds.includes(id), cardId));
    assert.equal(await page.evaluate(() => currentAudio), null);

    await card.dblclick();
    await page.locator('.track-action').waitFor();
    await page.getByRole('button', { name: '立即播放', exact: true }).click();
    await page.waitForFunction(id => tracks[selected].id === id && currentAudio && !currentAudio.paused && currentAudio.currentTime > 0, cardId, { timeout: 60000 });
    assert.equal(await page.evaluate(() => queueSource), 'custom');
    assert.ok(await page.evaluate(() => queueIds.length > 1));

    await page.locator('.queue-toggle').click();
    await page.locator('.queue-sheet').waitFor();
    assert.ok(await page.locator('.queue-row').count() > 1);
    assert.equal(await page.locator('.queue-row.is-current').count(), 1);
    await page.locator('.queue-close').click();

    await page.evaluate(() => {
      favorites.add(tracks[selected].id);
      const another = tracks.find(track => track.id !== tracks[selected].id && onlineAudio[track.id]?.url);
      favorites.add(another.id);
      save();
      render();
    });
    await page.locator('[data-tab="favorites"]').click();
    const favoriteCard = page.locator('.card').first();
    await favoriteCard.dblclick();
    await page.getByRole('button', { name: '立即播放', exact: true }).click();
    await page.waitForFunction(() => queueSource === 'favorites' && currentAudio && !currentAudio.paused, null, { timeout: 60000 });
    await page.locator('.queue-toggle').click();
    assert.equal(await page.locator('#queueTitle').textContent(), '我的收藏');
    assert.equal(await page.locator('.queue-clear').isVisible(), false);
    await page.locator('.queue-close').click();

    await page.locator('.meta').click();
    await page.locator('#side.open').waitFor();
    const timedVerse = page.locator('.verse[data-time]').filter({ hasText: /.+/ }).nth(2);
    const targetTime = Number(await timedVerse.getAttribute('data-time'));
    await timedVerse.dblclick();
    await page.waitForFunction(time => Math.abs(currentAudio.currentTime - time / 1000) < 2 && !currentAudio.paused, targetTime, { timeout: 10000 });

    const earlySwitch = await page.evaluate(() => {
      const times = [...new Set(timedLyricsFor().map(line => Number(line.time)))];
      const next = times.find(time => time > 1000);
      const previous = times[times.indexOf(next) - 1];
      syncLyricsAt(next / 1000 - 0.4, true);
      const active = [...document.querySelectorAll('.verse.is-active')].map(verse => Number(verse.dataset.time));
      return { next, previous, active };
    });
    assert.ok(earlySwitch.active.length > 0);
    assert.ok(earlySwitch.active.every(time => time === earlySwitch.next));
    assert.ok(!earlySwitch.active.includes(earlySwitch.previous));
    assert.deepEqual(errors, []);
    await page.screenshot({ path: 'work/queue-mobile.png', fullPage: false });
    await page.close();

    for (const width of [320, 1440]) {
      const visual = await browser.newPage({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
      await visual.goto(`${base}/app-preview.html`);
      await visual.locator('.card').first().waitFor();
      await visual.evaluate(() => { queueIds = tracks.slice(0, 12).map(track => track.id); queueSource = 'custom'; openQueue(); });
      assert.ok(await visual.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await visual.screenshot({ path: `work/queue-${width}.png`, fullPage: false });
      await visual.close();
    }
    console.log('PASS queue, card actions, favorites, and lyric seeking');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
