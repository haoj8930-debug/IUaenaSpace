import fs from "node:fs/promises";

const endpoint = await fetch("http://127.0.0.1:9233/json").then((response) => response.json());
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
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && ["error", "warning"].includes(message.params.entry.level)) {
    errors.push(message.params.entry.text);
  }
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
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${expression}`);
}

async function screenshot(path) {
  const result = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await fs.writeFile(path, Buffer.from(result.data, "base64"));
}

await call("Page.enable");
await call("Runtime.enable");
await call("Log.enable");

async function inspect(width, height, name) {
  await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 721 });
  await call("Page.navigate", { url: "http://127.0.0.1:4174/?qa=controls" });
  await waitFor("document.readyState === 'complete' && document.body.classList.contains('app-ready')");
  const music = await evaluate(`(() => {
    const tools = document.querySelector('.catalogTools');
    const nav = document.querySelector('.bottomNav');
    const selects = [...tools.querySelectorAll('select')].map((item) => item.getBoundingClientRect());
    const rect = tools.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    return {
      bodyWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      filterHeight: Math.round(rect.height),
      filterColumns: [...new Set(selects.map((item) => Math.round(item.x)))].length,
      navInsideViewport: navRect.left >= 0 && navRect.right <= innerWidth && navRect.bottom <= innerHeight,
      activeNav: nav.querySelector('.is-active span:last-child')?.textContent,
      filterVisible: getComputedStyle(tools).display !== 'none'
    };
  })()`);
  await screenshot(`work/${name}-music.png`);

  await evaluate(`setView('search'); window.scrollTo(0, 0);`);
  await waitFor("document.body.dataset.activeView === 'search'");
  const search = await evaluate(`(() => {
    const input = document.querySelector('#globalSearchInput');
    const shell = document.querySelector('.searchGlassShell');
    input.value = 'Palette';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const shellRect = shell.getBoundingClientRect();
    return {
      activeNav: document.querySelector('.bottomNav .is-active span:last-child')?.textContent,
      hasSearch: document.querySelector('.searchPage').classList.contains('has-search'),
      resultCount: document.querySelectorAll('.globalResult').length,
      shellInsideViewport: shellRect.left >= 0 && shellRect.right <= innerWidth,
      bodyWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth
    };
  })()`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  await screenshot(`work/${name}-search.png`);
  const light = await evaluate(`(() => {
    applyTheme('light');
    const input = document.querySelector('#globalSearchInput');
    const scope = document.querySelector('#globalSearchType');
    const active = document.querySelector('.bottomNav button.is-active');
    return {
      inputColor: getComputedStyle(input).color,
      scopeColor: getComputedStyle(scope).color,
      activeNavColor: getComputedStyle(active).color,
      themeLight: document.body.classList.contains('theme-light')
    };
  })()`);
  await new Promise((resolve) => setTimeout(resolve, 250));
  await screenshot(`work/${name}-search-light.png`);
  return { music, search, light };
}

const mobile = await inspect(390, 844, "qa-mobile-controls");
const desktop = await inspect(1440, 900, "qa-desktop-controls");
console.log(JSON.stringify({ mobile, desktop, errors }, null, 2));
socket.close();
