const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4174';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [320, 390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        serviceWorkers: 'block'
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/app-preview.html');
      await page.locator('.card').first().waitFor();
      assert.equal(await page.locator('.mini').isVisible(), false);
      await page.evaluate(() => choose(0, true));
      await page.locator('.mini').waitFor();

      for (const light of [true, false]) {
        await page.evaluate(light => document.body.classList.toggle('light', light), light);
        const ui = await page.locator('.mini').evaluate(player => {
          const rect = player.getBoundingClientRect();
          const cover = player.querySelector('img').getBoundingClientRect();
          const play = player.querySelector('.play').getBoundingClientRect();
          const next = player.querySelector('.next').getBoundingClientRect();
          const previous = player.querySelector('.prev').getBoundingClientRect();
          const progress = player.querySelector('.mini-progress').getBoundingClientRect();
          const nav = document.querySelector('.nav').getBoundingClientRect();
          const style = getComputedStyle(player);
          return {
            width: rect.width,
            height: rect.height,
            radius: parseFloat(style.borderRadius),
            cover: [cover.width, cover.height],
            play: [play.width, play.height],
            next: [next.width, next.height],
            previous: [previous.width, previous.height],
            progress: [progress.width, progress.height],
            navWidth: nav.width,
            title: player.querySelector('strong').textContent.trim(),
            status: player.querySelector('small').textContent.trim()
          };
        });
        assert.ok(ui.width <= width - 16);
        assert.ok(ui.width < ui.navWidth);
        assert.ok(ui.radius >= 18);
        assert.equal(Math.round(ui.cover[0]), Math.round(ui.cover[1]));
        assert.ok(ui.play[0] >= 40 && ui.play[1] >= 40);
        assert.ok(ui.height >= 62 && ui.height <= 82);
        assert.ok(ui.previous[0] > 0 && ui.next[0] > 0);
        assert.ok(ui.progress[0] > 80 && ui.progress[1] >= 8);
        assert.ok(ui.title);
        assert.ok(ui.status);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({
          path: `work/player-${width}-${light ? 'light' : 'dark'}.png`,
          fullPage: false
        });
      }
      assert.deepEqual(errors, []);
      await context.close();
      console.log('PASS player UI ' + width);
    }
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
