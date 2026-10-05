const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const run = require('node:util').promisify(require('node:child_process').execFile);
const project = path.resolve(__dirname, '..');
const snapshotDir = path.join(__dirname, 'youtube-update-20261005');
fs.mkdirSync(snapshotDir, { recursive: true });
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(project,'dist/data/youtube-official.js'),'utf8'), context);
const existing = context.window.IU_YOUTUBE_OFFICIAL;
async function fetchList(name,url,limit=100) {
  const { stdout } = await run('python', ['-m','yt_dlp','--proxy','http://127.0.0.1:7897','--socket-timeout','15','--retries','1','--flat-playlist','--dump-single-json','--skip-download','--no-warnings','--playlist-end',String(limit),url], {
    env:{...process.env,PYTHONPATH:path.join(__dirname,'yt-dlp')},maxBuffer:32*1024*1024,timeout:120000
  });
  const data = JSON.parse(stdout);
  fs.writeFileSync(path.join(snapshotDir,name+'.json'),JSON.stringify(data)); return data;
}
(async()=>{
  const uploads = await fetchList('uploads',existing.source.replace('/featured','/videos'),60);
  const shorts = await fetchList('shorts','https://www.youtube.com/@dlwlrma/shorts',60);
  const allIds = new Set(existing.categories.flatMap(c=>c.videos.map(v=>v.id)));
  const newEntries = [...(uploads.entries||[]),...(shorts.entries||[])].filter(e=>e?.id && !allIds.has(e.id));
  console.log(JSON.stringify({channel:uploads.channel,channel_id:uploads.channel_id,newEntries:newEntries.map(e=>({id:e.id,title:e.title,url:e.url,duration:e.duration,channel_id:e.channel_id}))},null,2));
  let cursor=0; const statuses=[];
  async function worker(){
    while(cursor < existing.categories.length){const category=existing.categories[cursor++];if(category.id==='shorts')continue;
      try{const d=await fetchList(category.id,category.url);statuses.push({category:category.id,count:d.entries?.length||0});}
      catch(e){statuses.push({category:category.id,error:String(e.message).slice(0,160)});}
    }
  }
  await Promise.all(Array.from({length:3},worker));
  fs.writeFileSync(path.join(snapshotDir,'status.json'),JSON.stringify(statuses,null,2));console.log(JSON.stringify(statuses));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
