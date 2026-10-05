const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('dist/app-core.js', 'utf8');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0);
  const end = source.indexOf('\n}', start) + 2;
  return (source.slice(start - 6, start) === 'async ' ? 'async ' : '') + source.slice(start, end);
}
function fixture() {
  const calls = [], audio = { paused: false, currentTime: 20, src: 'https://example.test/a', preload: '', isConnected: true, pause() { this.paused = true; }, async play() { this.paused = false; calls.push('play'); } };
  const context = vm.createContext({
    tracks: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], favorites: new Set(['a', 'c']), queueSource: 'custom', queueIds: ['a', 'b', 'c'], selected: 0, playbackMode: 'list', currentAudio: audio,
    calls, location: { href: 'https://example.test/' }, URL, window: {}, document: { createElement: () => { calls.push('create'); return audio; }, body: { append() {} } },
    srcFor: async t => t.id, playbackSrcFor: s => s, toast: () => {}, showPlaybackError: () => {}, setPlayingUi: () => {}, syncLyricsAt: () => {}, syncProgress: () => {}, audioErrorToastTimer: 0, clearTimeout,
    choose: async index => { context.selected = (index + 3) % 3; if (context.currentAudio && index !== 0) context.currentAudio.pause(); },
  });
  context.parent = context.window;
  vm.runInContext(['playbackQueueIds', 'selectTrack', 'stepTrack', 'handleEnded', 'prepareAudioSource', 'playCurrent'].map(extract).join('\n'), context);
  return { context, audio, calls };
}
test('queue filters unavailable tracks and favorites stay independent', () => {
  const { context: c } = fixture(); c.queueIds.push('missing'); assert.equal(c.playbackQueueIds().join(','), 'a,b,c'); c.queueSource = 'favorites'; assert.equal(c.playbackQueueIds().join(','), 'a,c');
});
test('previous wraps to final song while paused', async () => {
  const { context: c, audio } = fixture(); audio.paused = true; await c.stepTrack(-1); assert.equal(c.selected, 2); assert.equal(audio.paused, true);
});
test('shuffle next never repeats current when alternatives exist', async () => {
  const { context: c, audio } = fixture(); c.playbackMode = 'shuffle'; audio.paused = true; for (let n = 0; n < 25; n++) { c.selected = 0; await c.stepTrack(1); assert.notEqual(c.selected, 0); }
});
test('single loop restarts current song', async () => {
  const { context: c, audio, calls } = fixture(); c.playbackMode = 'one'; await c.handleEnded(); assert.equal(audio.currentTime, 0); assert.equal(c.selected, 0); assert.ok(calls.includes('play'));
});
test('select already-playing song does not toggle pause', async () => {
  const { context: c, audio } = fixture(); await c.selectTrack(0, true); assert.equal(audio.paused, false);
});
test('new source reuses audio element instead of creating one', async () => {
  const { context: c, audio, calls } = fixture(); c.selected = 1; await c.playCurrent(); assert.equal(c.currentAudio, audio); assert.equal(audio.src, 'b'); assert.equal(calls.includes('create'), false); assert.equal(audio.paused, false);
});
test('late source lookup cannot replace a newer selection', async () => {
  const { context: c, audio } = fixture(); c.srcFor = async () => { c.selected = 2; return 'stale'; }; await c.playCurrent(); assert.equal(audio.src, 'https://example.test/a');
});

test('preparing an already-buffered source does not reset or pause audio', () => {
  const { context: c, audio, calls } = fixture(); c.prepareAudioSource('a'); assert.equal(audio.src, 'https://example.test/a'); assert.equal(audio.currentTime, 20); assert.equal(audio.paused, false); assert.equal(calls.includes('create'), false);
});

test('new selected source buffers before play and uses the same audio element', () => {
  const { context: c, audio, calls } = fixture(); c.prepareAudioSource('b'); assert.equal(c.currentAudio, audio); assert.equal(audio.src, 'b'); assert.equal(audio.preload, 'auto'); assert.equal(audio.paused, true); assert.equal(calls.includes('play'), false);
});
test('system media play is idempotent and seek buttons are disabled', () => {
  assert.match(source, /play: \(\) => \{ if \(!currentAudio \|\| currentAudio.paused\) playCurrent\(\); \}/);
  assert.match(source, /\['seekbackward', 'seekforward'\]/);
  assert.match(source, /setActionHandler\(action, null\)/);
});
const features = fs.readFileSync('dist/player-features.js', 'utf8');
test('sleep deadline pauses once, without restarting countdown', () => {
  const start = features.indexOf('function checkSleep()');
  const fn = features.slice(start, features.indexOf('\n', start));
  let pauses = 0;
  const c = vm.createContext({ sleepUntil: 1000, currentAudio: { pause() { pauses++; } }, Date: { now: () => 1001 }, updateSleepUi() {}, toast() {} });
  vm.runInContext(fn, c); c.checkSleep(); c.checkSleep(); assert.equal(pauses, 1); assert.equal(c.sleepUntil, 0);
});
test('sleep deadline does not pause before scheduled time', () => {
  const start = features.indexOf('function checkSleep()');
  let pauses = 0;
  const c = vm.createContext({ sleepUntil: 1000, currentAudio: { pause() { pauses++; } }, Date: { now: () => 500 }, updateSleepUi() {}, toast() {} });
  vm.runInContext(features.slice(start, features.indexOf('\n', start)), c); c.checkSleep(); assert.equal(pauses, 0); assert.equal(c.sleepUntil, 1000);
});
test('end-of-song timer prevents automatic next track', async () => {
  const start = features.indexOf('handleEnded = async function ()');
  let next = 0;
  const c = vm.createContext({ sleepUntil: 0, sleepAfterSong: true, setPlayingUi() {}, updateSleepUi() {}, toast() {}, oldEnded: async () => { next++; } });
  vm.runInContext(features.slice(start, features.indexOf('\n', start)), c); await c.handleEnded(); assert.equal(next, 0); assert.equal(c.sleepAfterSong, false);
});
