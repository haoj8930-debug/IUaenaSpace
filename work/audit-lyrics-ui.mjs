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
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const item = pending.get(message.id);
  pending.delete(message.id);
  message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result);
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

await call("Page.enable");
await call("Runtime.enable");
await call("Page.navigate", { url: process.env.QA_SITE_URL || "http://127.0.0.1:4174/?qa=lyrics-audit" });
for (let i = 0; i < 200; i += 1) {
  if (await evaluate("document.readyState === 'complete' && document.body.classList.contains('app-ready')")) break;
  await new Promise((resolve) => setTimeout(resolve, 100));
}

const result = await evaluate(`(async () => {
  const keyGroups = new Map();
  for (const track of catalog.tracks) {
    const key = trackLyricKey(track);
    if (!keyGroups.has(key)) keyGroups.set(key, []);
    keyGroups.get(key).push(track);
  }
  const duplicateKeys = [...keyGroups.entries()]
    .filter(([, tracks]) => tracks.length > 1)
    .map(([key, tracks]) => ({ key, tracks: tracks.map((track) => ({ id: track.id, title: track.title, release: track.release, neteaseSongId: track.neteaseSongId })) }));

  const checks = await Promise.all(catalog.tracks.map(async (track) => {
    const saved = lyricForTrack(track);
    const resolved = bundledLyricRecordForTrack(track);
    const id = String(track.neteaseSongId || resolved?.id || "");
    const manifest = id ? window.IU_LYRICS_MANIFEST?.[id] : null;
    let fileOk = null;
    let fileLines = null;
    if (manifest?.path) {
      try {
        const response = await fetch(manifest.path);
        const payload = response.ok ? await response.json() : null;
        fileLines = Array.isArray(payload?.lines) ? payload.lines.length : 0;
        fileOk = response.ok && fileLines > 0;
      } catch {
        fileOk = false;
      }
    }
    const savedHasText = Boolean(String(saved?.lyrics || "").trim() || (Array.isArray(saved?.lines) && saved.lines.length));
    return {
      id: track.id,
      title: track.title,
      release: track.release,
      neteaseSongId: track.neteaseSongId || null,
      cardSaved: Boolean(saved),
      savedHasText,
      manifest: Boolean(manifest?.path),
      fileOk,
      fileLines,
    };
  }));

  const red = checks.find((item) => /Red Sneakers|빨간 운동화/i.test(item.title));
  const redTrack = catalog.tracks.find((item) => item.id === red?.id);
  if (redTrack) {
    await openLyricsPage(redTrack);
    for (let i = 0; i < 100 && !document.querySelector('.lyricPair'); i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    red.dialogPairs = document.querySelectorAll('.lyricPair').length;
    red.dialogText = document.querySelector('#lyricsDialogBody')?.textContent.trim().slice(0, 120);
    document.querySelector('#lyricsDialog').close();
  }

  setView('music');
  releaseFilter.value = 'all';
  yearFilter.value = 'all';
  releaseTypeFilter.value = 'all';
  mediaFilter.value = 'all';
  albumPreviewRelease = '';
  renderCatalog();
  const shelfBefore = document.querySelectorAll('.releaseCard').length;
  const firstRelease = document.querySelector('.releaseCard');
  const previewTitle = firstRelease?.dataset.releaseName || '';
  firstRelease?.click();
  const albumPreview = {
    previewTitle,
    releaseFilterValue: releaseFilter.value,
    shelfBefore,
    shelfAfter: document.querySelectorAll('.releaseCard').length,
    selectedCards: document.querySelectorAll('.releaseCard.is-selected').length,
    visibleTracks: document.querySelectorAll('.trackCard').length,
    countText: catalogCount.textContent,
    resetHidden: catalogReset.hidden,
  };

  return {
    trackCount: checks.length,
    savedCount: checks.filter((item) => item.cardSaved).length,
    manifestCount: checks.filter((item) => item.manifest).length,
    savedWithoutText: checks.filter((item) => item.cardSaved && !item.savedHasText),
    manifestFailures: checks.filter((item) => item.manifest && !item.fileOk),
    idWithoutManifest: checks.filter((item) => item.neteaseSongId && !item.manifest),
    noIdButBundledTitle: checks.filter((item) => !item.neteaseSongId && Object.values(window.IU_LYRICS_BY_NETEASE_ID || {}).some((entry) => normalizeKey(entry.title) === normalizeKey(item.title))),
    duplicateKeys,
    red,
    albumPreview,
  };
})()`);

console.log(JSON.stringify(result, null, 2));
const screenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
await fs.writeFile("work/qa-album-preview.png", Buffer.from(screenshot.data, "base64"));
socket.close();
