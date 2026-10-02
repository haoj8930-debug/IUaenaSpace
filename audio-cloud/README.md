# IU-UAENA audio storage

The website keeps its existing Vercel deployment. Original FLAC and MP3 files live in the `iu-uaena-audio` Cloudflare R2 Standard bucket. This Worker serves GET/HEAD requests with byte ranges so the player can seek without downloading a whole file first. The bucket is not exposed for uploads through the Worker.

Local source: `D:/音乐/IUIUImusic/专辑` (414 files, 9,500,118,227 bytes).

The private import manifest and resumable upload records are saved beside that folder. They are not published with the site. `dist/data/audio-sources.js` contains only the website track IDs, public playback URLs, file sizes and formats.

## Rebuild and upload

1. Run `node work/build-audio-manifest.cjs`. It checks that every local file matches exactly one website track.
2. Create the R2 bucket if needed and deploy with `wrangler deploy --config audio-cloud/wrangler.jsonc`.
3. Set `IU_WRANGLER_JS` to the installed Wrangler `bin/wrangler.js`. Verification runs through Python Requests; set `IU_PYTHON` if Python is installed elsewhere. On this machine verification uses `HTTPS_PROXY=http://127.0.0.1:7897`. Upload subprocesses use the direct connection.
4. Run `node work/upload-audio-r2.cjs <manifest path> <Worker HTTPS origin>`. Uploads preserve file bytes; successful records include SHA256, remote size and range verification. Upload and verification states are saved separately, so verification retries do not reupload a completed object. A repeated run resumes unfinished entries.
5. After all 414 records are verified, run the audio and player checks, commit the source map and deploy Vercel from the repository root.

Checks: `node work/check-audio-worker.mjs`, `node work/check-online-audio.cjs [site origin]`, and the existing `work/check-music-shared.cjs`.

R2 and Worker usage follow the account's Cloudflare quotas. Public playback URLs are readable by anyone who has the link.
