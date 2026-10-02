export default {
 async fetch(request,env){
  const headers=new Headers({'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, HEAD, OPTIONS','Access-Control-Allow-Headers':'Range','Access-Control-Expose-Headers':'Content-Length, Content-Range, Accept-Ranges, ETag','Accept-Ranges':'bytes'});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers});
  const key=new URL(request.url).pathname.slice(1);
  if(!/^audio\/[a-f0-9]{24}\.(mp3|flac)$/.test(key))return new Response('Not found',{status:404,headers});
  const meta=await env.AUDIO.head(key);if(!meta)return new Response('Not found',{status:404,headers});
  meta.writeHttpMetadata(headers);headers.set('ETag',meta.httpEtag);headers.set('Cache-Control','public, max-age=86400');
  let offset=0,length=meta.size,status=200;
  const range=request.headers.get('Range');
  if(range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(range);
   if(!match||(!match[1]&&!match[2])){headers.set('Content-Range','bytes */'+meta.size);return new Response(null,{status:416,headers})}
   if(match[1]){offset=Number(match[1]);const end=match[2]?Math.min(Number(match[2]),meta.size-1):meta.size-1;length=end-offset+1}
   else{length=Math.min(Number(match[2]),meta.size);offset=meta.size-length}
   if(!Number.isSafeInteger(offset)||!Number.isSafeInteger(length)||offset<0||offset>=meta.size||length<=0){headers.set('Content-Range','bytes */'+meta.size);return new Response(null,{status:416,headers})}
   headers.set('Content-Range',`bytes ${offset}-${offset+length-1}/${meta.size}`);status=206;
  }
  headers.set('Content-Length',String(length));
  if(request.method==='HEAD')return new Response(null,{status,headers});
  const object=await env.AUDIO.get(key,{range:{offset,length}});if(!object)return new Response('Not found',{status:404});
  return new Response(object.body,{status,headers});
 }
};
