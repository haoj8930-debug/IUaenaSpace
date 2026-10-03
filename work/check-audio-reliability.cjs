const fs = require('node:fs');
const vm = require('node:vm');

const base = (process.argv[2] || 'https://loeunsu.app').replace(/\/$/, '');
const limit = Number(process.argv[3] || 0);
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/data/audio-sources.js', 'utf8'), context);
const core = fs.readFileSync('dist/app-core.js', 'utf8');
const proxyVersion = core.match(/audioProxyVersion\s*=\s*'([^']+)'/)?.[1] || 'unversioned';
const sources = Object.entries(context.window.IU_AUDIO_SOURCES || {});
const selected = limit > 0 ? sources.slice(0, limit) : sources;

async function probe([id, source]) {
  const name = new URL(source.url).pathname.split('/').pop();
  const url = `${base}/audio/${name}?v=${encodeURIComponent(proxyVersion)}`;
  const started = Date.now();
  try {
    const response = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
      signal: AbortSignal.timeout(15000),
    });
    const body = Buffer.from(await response.arrayBuffer());
    const contentRange = response.headers.get('content-range') || '';
    const type = response.headers.get('content-type') || '';
    const ok = response.status === 206
      && body.length === 1024
      && contentRange.startsWith('bytes 0-1023/')
      && type.startsWith(source.format);
    return { id, url, ok, status: response.status, bytes: body.length, contentRange, type, ms: Date.now() - started };
  } catch (error) {
    return { id, url, ok: false, error: `${error.name}: ${error.message}`, ms: Date.now() - started };
  }
}

(async () => {
  const firstName = new URL(selected[0][1].url).pathname.split('/').pop();
  const isolationUrl = `${base}/audio/${firstName}?v=${encodeURIComponent(proxyVersion)}&range-isolation=1`;
  await fetch(isolationUrl, { headers: { Range: 'bytes=0-1' }, signal: AbortSignal.timeout(15000) });
  const isolationResponse = await fetch(isolationUrl, { headers: { Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(15000) });
  const isolationBody = Buffer.from(await isolationResponse.arrayBuffer());
  const rangeIsolation = isolationResponse.status === 206
    && isolationBody.length === 1024
    && (isolationResponse.headers.get('content-range') || '').startsWith('bytes 0-1023/');
  const results = [];
  const concurrency = 12;
  for (let index = 0; index < selected.length; index += concurrency) {
    results.push(...await Promise.all(selected.slice(index, index + concurrency).map(probe)));
  }
  const failures = results.filter(result => !result.ok);
  const timings = results.map(result => result.ms).sort((a, b) => a - b);
  const summary = {
    base,
    checked: results.length,
    passed: results.length - failures.length,
    failed: failures.length,
    medianMs: timings[Math.floor(timings.length / 2)] || 0,
    p95Ms: timings[Math.floor(timings.length * 0.95)] || 0,
    rangeIsolation,
    failures: failures.slice(0, 20),
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length || !rangeIsolation) process.exitCode = 1;
})();
