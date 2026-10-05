const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const run=require('node:util').promisify(require('node:child_process').execFile);
const root=path.resolve(__dirname,'..'),dir=path.join(__dirname,'youtube-update-20261005');
const ctx={window:{}}; vm.runInNewContext(fs.readFileSync(path.join(root,'dist/data/youtube-official.js'),'utf8'),ctx);
const payload=ctx.window.IU_YOUTUBE_OFFICIAL,existing=new Set(payload.categories.flatMap(c=>c.videos.map(v=>v.id)));
const entries=['uploads','shorts'].flatMap(name=>(JSON.parse(fs.readFileSync(path.join(dir,name+'.json'))).entries||[]).map(e=>({...e,isShort:name==='shorts'}))).filter(e=>e?.id&&!existing.has(e.id));
let cursor=0;const added=[],failed=[];
async function worker(){while(cursor<entries.length){const e=entries[cursor++];try{
  const {stdout}=await run('python',['-m','yt_dlp','--proxy','http://127.0.0.1:7897','--socket-timeout','15','--retries','1','--skip-download','--ignore-no-formats-error','--no-warnings','--dump-single-json','--extractor-args','youtube:lang=ko',e.url],{env:{...process.env,PYTHONPATH:path.join(__dirname,'yt-dlp')},maxBuffer:16*1024*1024,timeout:100000});
  const detail=JSON.parse(stdout); if(detail.channel_id!=='UC3SyT4_WLHzN7JmHQwKQZww')throw Error('Channel mismatch');
  fs.writeFileSync(path.join(dir,e.id+'.json'),JSON.stringify(detail));
  const category=e.isShort?'shorts':/^\[IU TV\]/.test(detail.title)?'iu-tv':'official';
  added.push({category,video:{id:e.id,title:detail.title,url:`https://youtu.be/${e.id}`,thumbnail:`https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`,duration:Number(detail.duration)||0,views:Number(detail.view_count)||0,publishedAt:detail.upload_date?`${detail.upload_date.slice(0,4)}-${detail.upload_date.slice(4,6)}-${detail.upload_date.slice(6,8)}`:null}});
  console.log(JSON.stringify({id:e.id,category,date:detail.upload_date,title:detail.title}));
}catch(err){failed.push({id:e.id,error:err.message.slice(0,140)});}}}
(async()=>{
  await Promise.all(Array.from({length:3},worker));
  for(const c of payload.categories){const incoming=added.filter(a=>a.category===c.id).map(a=>a.video).sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||''));c.videos=[...incoming,...c.videos];c.videoCount=c.videos.length;if(incoming.length)c.cover=incoming[0].thumbnail;}
  payload.updatedAt='2026-10-05';
  fs.writeFileSync(path.join(root,'dist/data/youtube-official.js'),`window.IU_YOUTUBE_OFFICIAL = ${JSON.stringify(payload)};\n`);
  fs.writeFileSync(path.join(dir,'merge-audit.json'),JSON.stringify({added,failed},null,2));
  console.log(JSON.stringify({added:added.length,failed}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
