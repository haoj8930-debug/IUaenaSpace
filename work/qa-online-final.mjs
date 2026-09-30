import fs from "node:fs/promises";

const endpoint = await fetch("http://127.0.0.1:9235/json").then((response) => response.json());
const page = endpoint.find((item) => item.type === "page");
if (!page) throw new Error("No Chrome page target found");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const errors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const item = pending.get(message.id);
    pending.delete(message.id);
    message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") errors.push(message.params.entry.text);
});

function call(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out: ${expression}`);
}

async function screenshot(file) {
  const result = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await fs.writeFile(file, Buffer.from(result.data, "base64"));
}

await call("Page.enable");
await call("Runtime.enable");
await call("Log.enable");
await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
const siteUrl = process.env.QA_SITE_URL || "https://iu-uaena.space/?qa=20260930-final";
await call("Page.navigate", { url: siteUrl });
await waitFor("document.readyState === 'complete' && document.body.classList.contains('app-ready')");

const themes = await evaluate(`(async () => {
  const results = {};
  setView('profile');
  applyTheme('dark');
  for (const preset of ['cosmic', 'cinema', 'neon', 'letter']) {
    applyPreset(preset);
    await new Promise((resolve) => setTimeout(resolve, 80));
    const card = document.querySelector('.settingsCard');
    results[preset] = {
      bodyBackground: getComputedStyle(document.body).backgroundImage,
      cardBackground: getComputedStyle(card).backgroundImage,
      cardRadius: getComputedStyle(card).borderRadius,
      accent: getComputedStyle(document.body).getPropertyValue('--gold').trim(),
    };
  }
  applyTheme('light');
  results.light = {};
  for (const preset of ['cosmic', 'cinema', 'neon', 'letter']) {
    applyPreset(preset);
    await new Promise((resolve) => setTimeout(resolve, 80));
    const nav = document.querySelector('.bottomNav');
    const hero = document.querySelector('.profileHero');
    const button = nav.querySelector('button');
    const indicator = document.querySelector('.bottomNav__indicator');
    results.light[preset] = {
      navBackground: getComputedStyle(nav).background,
      navRadius: getComputedStyle(nav).borderRadius,
      buttonBorder: getComputedStyle(button).borderWidth,
      buttonBackground: getComputedStyle(button).backgroundColor,
      buttonBackdropFilter: getComputedStyle(button).backdropFilter,
      navBorder: getComputedStyle(nav).borderWidth,
      navSweep: getComputedStyle(nav, '::after').content,
      indicatorVisible: getComputedStyle(indicator).display !== 'none' && parseFloat(getComputedStyle(indicator).opacity || '1') > 0,
      heroBackground: getComputedStyle(hero).background,
      heroRadius: getComputedStyle(hero).borderRadius,
      secondaryColor: getComputedStyle(document.querySelector('.settingsCard p')).color,
    };
  }
  return results;
})()`);
await screenshot("work/qa-online-profile-light.png");

const coverAssets = await evaluate(`(async () => {
  const entries = Object.entries(window.IU_SCREEN_COVERS || {});
  const checks = await Promise.all(entries.map(async ([title, path]) => {
    const response = await fetch(path);
    return { title, path, ok: response.ok, status: response.status };
  }));
  return { total: checks.length, failed: checks.filter((item) => !item.ok) };
})()`);

const lyrics = await evaluate(`(async () => {
  setView('music');
  const track = catalog.tracks.find((item) => item.neteaseSongId && window.IU_LYRICS_MANIFEST?.[String(item.neteaseSongId)]?.hasTranslation);
  await openLyricsPage(track);
  for (let i = 0; i < 100 && !document.querySelector('.lyricPair'); i++) await new Promise((resolve) => setTimeout(resolve, 100));
  const pairs = [...document.querySelectorAll('.lyricPair')];
  const original = pairs[0]?.querySelector('.lyricOriginal');
  const translation = pairs[0]?.querySelector('.lyricTranslation');
  return {
    title: track.title,
    pairs: pairs.length,
    translatedPairs: pairs.filter((item) => item.querySelector('.lyricTranslation')).length,
    firstOriginal: original?.textContent,
    firstTranslation: translation?.textContent,
    originalSize: original ? parseFloat(getComputedStyle(original).fontSize) : 0,
    translationSize: translation ? parseFloat(getComputedStyle(translation).fontSize) : 0,
    dialogOpen: document.querySelector('#lyricsDialog').open,
  };
})()`);

const lyricAssets = await evaluate(`(async () => {
  const entries = Object.entries(window.IU_LYRICS_MANIFEST || {});
  const checks = await Promise.all(entries.map(async ([id, entry]) => {
    try {
      const response = await fetch(entry.path);
      const payload = response.ok ? await response.json() : null;
      const lineCount = Array.isArray(payload?.lines) ? payload.lines.length : 0;
      return { id, ok: response.ok && lineCount > 0, status: response.status, lineCount };
    } catch (error) {
      return { id, ok: false, status: 0, lineCount: 0, error: error.message };
    }
  }));
  const manifestOnlyTrack = catalog.tracks.find((item) => {
    const entry = item.neteaseSongId && window.IU_LYRICS_MANIFEST?.[String(item.neteaseSongId)];
    return entry?.path && !lyricForTrack(item);
  });
  let manifestOnlyDialog = null;
  if (manifestOnlyTrack) {
    await openLyricsPage(manifestOnlyTrack);
    for (let i = 0; i < 100 && !document.querySelector('.lyricPair'); i++) await new Promise((resolve) => setTimeout(resolve, 50));
    manifestOnlyDialog = {
      title: manifestOnlyTrack.title,
      pairs: document.querySelectorAll('.lyricPair').length,
    };
    document.querySelector('#lyricsDialog').close();
  }
  return {
    total: checks.length,
    failed: checks.filter((item) => !item.ok),
    manifestOnlyDialog,
  };
})()`);
await screenshot("work/qa-online-lyrics.png");
await evaluate("if (document.querySelector('#lyricsDialog').open) document.querySelector('#lyricsDialog').close(); setView('screen'); screenFilter='tv'; renderScreen();");
await waitFor("document.querySelectorAll('.screenCard__cover').length > 0");
await new Promise((resolve) => setTimeout(resolve, 1500));
const screen = await evaluate(`(() => {
  const cards = [...document.querySelectorAll('.screenCard')];
  const covers = [...document.querySelectorAll('.screenCard__cover')];
  return {
    cards: cards.length,
    localCovers: covers.filter((item) => item.style.backgroundImage.includes('./assets/screen-landscape/')).length,
    missing: covers.filter((item) => item.classList.contains('isMissingCover')).length,
    overflow: document.documentElement.scrollWidth > innerWidth,
  };
})()`);
await screenshot("work/qa-online-screen-desktop.png");

await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await evaluate("applyTheme('dark'); applyPreset('cosmic'); window.scrollTo(0, 0); setView('merch');");
await new Promise((resolve) => setTimeout(resolve, 800));
const mobile = await evaluate(`(() => ({
  width: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflow: document.documentElement.scrollWidth > innerWidth,
  navVisible: document.querySelector('.bottomNav').getBoundingClientRect().bottom <= innerHeight,
  cards: document.querySelectorAll('.merchCard').length,
  backgroundAttachment: getComputedStyle(document.body).backgroundAttachment,
  fixedBackgroundLayer: getComputedStyle(document.body, '::before').position,
  mobileBackgroundImage: getComputedStyle(document.body, '::before').backgroundImage,
  navBorder: getComputedStyle(document.querySelector('.bottomNav')).borderWidth,
  navSweep: getComputedStyle(document.querySelector('.bottomNav'), '::after').content,
  indicatorRadius: getComputedStyle(document.querySelector('.bottomNav__indicator')).borderRadius,
  buttonBorders: [...document.querySelectorAll('.bottomNav button')].map((item) => getComputedStyle(item).borderWidth),
  buttonBackgrounds: [...document.querySelectorAll('.bottomNav button')].map((item) => getComputedStyle(item).backgroundColor),
  inactiveColors: [...document.querySelectorAll('.bottomNav button:not(.is-active)')].map((item) => getComputedStyle(item).color),
  buttonBackdropFilters: [...document.querySelectorAll('.bottomNav button')].map((item) => getComputedStyle(item).backdropFilter),
}))()`);
await screenshot("work/qa-online-screen-mobile.png");

const profile = await evaluate(`(() => {
  applyTheme('light');
  setView('profile');
  const feedback = document.querySelector('.feedbackCard');
  const mail = document.querySelector('.feedbackCard__mail');
  return {
    exists: Boolean(feedback),
    email: mail?.textContent.trim(),
    href: mail?.getAttribute('href'),
    overflow: document.documentElement.scrollWidth > innerWidth,
  };
})()`);

console.log(JSON.stringify({ siteUrl, themes, coverAssets, lyrics, lyricAssets, screen, mobile, profile, errors: [...new Set(errors)] }, null, 2));
socket.close();

