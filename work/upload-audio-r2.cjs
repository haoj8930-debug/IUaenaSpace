const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),manifestPath=process.argv[2]||'D:/音乐/IUIUImusic/音频云存储导入清单.json',base=process.argv[3];
if(!base||!/^https:\/\/[a-z0-9.-]+\/?$/i.test(base))throw Error('Provide the deployed audio Worker HTTPS origin as argument 3');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));if(manifest.unmatched.length||manifest.unusedFiles.length)throw Error('Resolve unmatched audio before upload');
const logPath=path.join(path.dirname(manifestPath),'音频云存储上传记录.json'),log=fs.existsSync(logPath)?JSON.parse(fs.readFileSync(logPath,'utf8')):{};
const wrangler=process.env.IU_WRANGLER_JS;if(!wrangler||!fs.existsSync(wrangler))throw Error('Set IU_WRANGLER_JS to the installed wrangler/bin/wrangler.js');
const uploadEnv={...process.env,NODE_USE_ENV_PROXY:'0'};for(const key of ['HTTP_PROXY','HTTPS_PROXY','ALL_PROXY','http_proxy','https_proxy','all_proxy'])delete uploadEnv[key];
function persist(){fs.writeFileSync(logPath,JSON.stringify(log,null,2));const map={};for(const c of manifest.mappings)if(log[c.id]?.verified)map[c.id]={url:base.replace(/\/$/,'')+'/'+c.objectKey,bytes:c.bytes,format:c.contentType};fs.writeFileSync(path.join(root,'dist/data/audio-sources.js'),'window.IU_AUDIO_SOURCES = '+JSON.stringify(map)+';\n')}
async function run(c){
 const digest=crypto.createHash('sha256').update(fs.readFileSync(c.file)).digest('hex');if(log[c.id]?.sha256===digest&&log[c.id].verified)return;
 if(!(log[c.id]?.sha256===digest&&log[c.id].uploaded)){
 await new Promise((resolve,reject)=>cp.execFile(process.execPath,[wrangler,'r2','object','put','iu-uaena-audio/'+c.objectKey,'--file',c.file,'--remote','--content-type',c.contentType],{cwd:root,env:uploadEnv,maxBuffer:4*1024*1024},(error,stdout,stderr)=>error?reject(Error(stderr||stdout||error.message)):resolve()));
 log[c.id]={objectKey:c.objectKey,bytes:c.bytes,sha256:digest,uploaded:true,verified:false};persist();
 }
 await new Promise((resolve,reject)=>cp.execFile(process.env.IU_PYTHON||'D:/学习/python/python.exe',[path.join(root,'work/verify-audio-r2.py'),base.replace(/\/$/,'')+'/'+c.objectKey,String(c.bytes)],{cwd:root,env:process.env,maxBuffer:1024*1024},(error,stdout,stderr)=>error?reject(Error(stderr||stdout||error.message)):resolve()));
 log[c.id].verified=true;persist();console.log(Object.values(log).filter(c=>c.verified).length+'/'+manifest.matched+' uploaded: '+c.title);
}
(async()=>{let cursor=0;const failures=[];await Promise.all(Array.from({length:6},async()=>{while(cursor<manifest.mappings.length){const c=manifest.mappings[cursor++];let error;for(let attempt=0;attempt<3;attempt++){try{await run(c);error=null;break}catch(e){error=e}}if(error){failures.push({id:c.id,title:c.title,error:error.message});console.error('Pending retry: '+c.title)}}}));persist();if(failures.length){fs.writeFileSync(path.join(path.dirname(manifestPath),'音频上传待重试.json'),JSON.stringify(failures,null,2));process.exitCode=1;console.log('Pending retries: '+failures.length)}else console.log('Upload completed')})().catch(e=>{console.error(e.message);process.exit(1)});
