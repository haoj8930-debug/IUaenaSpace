const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const run=require('node:util').promisify(require('node:child_process').execFile);
const root=path.resolve(__dirname,'..'),out=path.join(__dirname,'live-audit');fs.mkdirSync(out,{recursive:true});
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/data/youtube-official.js'),'utf8'),ctx);
const cache={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/data/official-cover-cache.js'),'utf8'),cache);
const videos=[...new Map(ctx.window.IU_YOUTUBE_OFFICIAL.categories.flatMap(c=>c.videos).map(v=>[v.id,v])).values()];
const selected=videos.filter(v=>/live clip/i.test(v.title)&&v.duration>90&&/concert|tour/i.test(v.title)&&!/preview|teaser|black out.*&|rain-drop.*&|dlwlrma.*&/i.test(v.title));
let cursor=0;const good=[],failed=[];
async function worker(){while(cursor<selected.length){const v=selected[cursor++];try{
 const {stdout}=fs.existsSync(path.join(out,v.id+'.json'))?{stdout:fs.readFileSync(path.join(out,v.id+'.json'),'utf8')}:await run('python',['-m','yt_dlp','--proxy','http://127.0.0.1:7897','--socket-timeout','15','--retries','1','--skip-download','--ignore-no-formats-error','--no-warnings','--dump-single-json','--extractor-args','youtube:lang=ko',v.url],{env:{...process.env,PYTHONPATH:path.join(__dirname,'yt-dlp')},timeout:100000,maxBuffer:16*1024*1024});
 const d=JSON.parse(stdout);if(d.channel_id!=='UC3SyT4_WLHzN7JmHQwKQZww'||d.duration<90)throw Error('Not official full song');
 const cover=cache.window.IU_OFFICIAL_COVERS?.[v.thumbnail];
 const local=typeof cover==='string'?cover:cover?.path;
 if(!local||!fs.existsSync(path.join(root,'dist',local)))throw Error('Missing corresponding cached video cover');
 fs.writeFileSync(path.join(out,v.id+'.json'),JSON.stringify(d));
 const mirrors={ax1csKKQnns:'BV14x4y1m7TL',Cxzzg7L3Xgc:'BV14e411T74n',o_nxIQTM_B0:'BV1AJ41157yd'};
 good.push({id:'live-'+v.id,videoId:v.id,title:d.title,year:Number(d.upload_date?.slice(0,4))||null,publishedAt:d.upload_date,type:'官方演唱会 · 单曲视频',role:'IU · Performer',notes:'来源：이지금 [IU Official]。封面为该视频原始缩略图。',image:local+'?v=20261005-originals',source:'https://www.youtube.com/watch?v='+v.id,resourceLinks:mirrors[v.id]?[{label:'Bilibili · 官方片段转载',url:'https://www.bilibili.com/video/'+mirrors[v.id]+'/'}]:[],kind:'music-stage',duration:d.duration,channelId:d.channel_id});
 console.log('OK '+v.id+' '+d.title);
 }catch(e){failed.push({id:v.id,error:e.message.slice(0,160)});console.log('SKIP '+v.id+' '+e.message.slice(0,80));}}}
(async()=>{await Promise.all(Array.from({length:3},worker));good.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));fs.writeFileSync(path.join(root,'dist/data/live-videos.js'),'window.IU_LIVE_VIDEOS = '+JSON.stringify(good,null,2)+';\n');fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({selected:selected.length,good:good.length,failed},null,2));console.log(JSON.stringify({selected:selected.length,good:good.length,failed}));})();
