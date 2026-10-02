const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4174';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [320, 390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/app-preview.html`);
      await page.locator('.card').first().waitFor();
      assert.equal(await page.title(), 'UAENA小窝');
      assert.equal(await page.locator('.brand small').textContent(), 'IU · Music Archive');
      assert.equal(await page.getByText('INSTALLABLE APP PREVIEW').count(), 0);

      const selected = await page.evaluate(async () => {
        const index = tracks.findIndex(track => onlineAudio[track.id]?.url && window.IU_LOCAL_LYRICS?.[track.id]?.lines?.some(line => Number(line.time) > 0));
        if (index < 0) throw new Error('No playable timed track');
        await choose(index, true);
        setSystemMetadata(tracks[index]);
        return { title: titleFor(tracks[index]), cover: coverFor(tracks[index]), index };
      });
      await page.locator('.mini').waitFor();
      assert.equal((await page.locator('#minititle').textContent()).trim(), selected.title);
      assert.ok((await page.locator('#minicover').getAttribute('src')).includes(selected.cover));

      const initialMetadata = await page.evaluate(() => ({
        title: navigator.mediaSession.metadata?.title,
        album: navigator.mediaSession.metadata?.album,
        artwork: navigator.mediaSession.metadata?.artwork?.[0]?.src
      }));
      assert.equal(initialMetadata.title, selected.title);
      assert.equal(initialMetadata.album, 'UAENA小窝');
      assert.ok(initialMetadata.artwork);

      const labels = [];
      for (let i = 0; i < 3; i++) {
        labels.push(await page.locator('.playback-mode').getAttribute('aria-label'));
        await page.locator('.playback-mode').click();
      }
      assert.deepEqual(new Set(labels).size, 3);

      const lyricTransition = await page.evaluate(() => {
        const lines = timedLyricsFor();
        const first = lines.find(entry => entry.original?.trim() && entry.original.trim() !== titleFor(tracks[selected])) || lines[0];
        const second = lines.find(entry => Number(entry.time) > Number(first.time));
        document.querySelector('#side').classList.add('open');
        currentAudio = new Audio();
        Object.defineProperty(currentAudio, 'paused', { configurable: true, value: false });
        syncLyricsAt(Number(first.time) / 1000 + 0.01, true);
        const before = [...document.querySelectorAll('.verse.is-active')].map(verse => Number(verse.dataset.time));
        syncLyricsAt(Number(second.time) / 1000 + 0.01, true);
        const after = [...document.querySelectorAll('.verse.is-active')].map(verse => Number(verse.dataset.time));
        return { first: Number(first.time), second: Number(second.time), before, after };
      });
      assert.ok(await page.locator('.verse.is-active').count() >= 1);
      assert.ok(lyricTransition.before.every(time => time === lyricTransition.first));
      assert.ok(lyricTransition.after.every(time => time === lyricTransition.second));
      assert.ok(!lyricTransition.after.includes(lyricTransition.first));
      const lyricMetadata = await page.evaluate(() => navigator.mediaSession.metadata?.title);
      assert.notEqual(lyricMetadata, selected.title);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await page.screenshot({ path: `work/player-sync-${width}.png`, fullPage: false });
      await context.close();
      console.log(`PASS media and lyrics ${width}`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
