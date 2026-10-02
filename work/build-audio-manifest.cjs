const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),source=process.argv[2]||'D:/音乐/IUIUImusic/专辑';
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/data/local-albums.js'),'utf8'),context);
const tracks=context.window.IU_LOCAL_TRACKS,albums=context.window.IU_LOCAL_ALBUMS,files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(mp3|flac)$/i.test(e.name))files.push(p)}}walk(source);
const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/\s*\[[^\]]*\]\s*$/,'').replace(/[^\p{L}\p{N}]/gu,'');
const entries=files.map(file=>({file,category:path.relative(source,file).split(path.sep)[0],title:path.basename(file,path.extname(file)).replace(/\s*\[[^\]]*\]\s*$/,''),neteaseId:path.basename(file).match(/\[(\d+)\]/)?.[1]||''}));
const mappings=[],unmatched=[],used=new Set();
for(const t of tracks){
 const category=entries.filter(e=>e.category===t.category&&!used.has(e.file));
 const titles=[t.originalTitle,t.title].filter(Boolean).map(normalize);
 let matches=category.filter(e=>titles.includes(normalize(e.title)));
 if(matches.length>1){const album=albums.find(a=>a.id===t.releaseId);const narrowed=matches.filter(e=>e.file.includes(album.rawTitle));if(narrowed.length)matches=narrowed}
 if(matches.length===0&&t.neteaseId)matches=category.filter(e=>e.neteaseId===String(t.neteaseId));
 if(matches.length!==1){unmatched.push({id:t.id,title:t.originalTitle||t.title,category:t.category,candidates:matches.map(e=>e.file)});continue}
 const e=matches[0];used.add(e.file);const stat=fs.statSync(e.file),extension=path.extname(e.file).toLowerCase();
 mappings.push({id:t.id,title:t.originalTitle||t.title,release:t.release,file:e.file,bytes:stat.size,objectKey:'audio/'+crypto.createHash('sha256').update(t.id).digest('hex').slice(0,24)+extension,contentType:extension==='.flac'?'audio/flac':'audio/mpeg'});
}
const out=path.join(source,'..','音频云存储导入清单.json');
fs.writeFileSync(out,JSON.stringify({created:'2026-10-02',source,totalFiles:files.length,totalBytes:entries.reduce((sum,e)=>sum+fs.statSync(e.file).size,0),matched:mappings.length,mappings,unmatched,unusedFiles:files.filter(f=>!used.has(f))},null,2));
console.log(JSON.stringify({files:files.length,matched:mappings.length,unmatched:unmatched.length,unused:files.length-used.size,manifest:out}));
