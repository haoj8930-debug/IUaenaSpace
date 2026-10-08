(() => {
  'use strict';
  const $=id=>document.getElementById(id), limit=36;
  let data=null, collection='catalog', filtered=[], shown=0, selected=0, side='front', opener=null;
  let dark=window.uaenaInitialTheme ? window.uaenaInitialTheme==='dark' : localStorage.getItem('iu-photocard-theme')==='dark';
  const applyTheme=()=>document.body.classList.toggle('dark',dark);
  applyTheme(); $('theme').onclick=()=>{dark=!dark;applyTheme();localStorage.setItem('iu-photocard-theme',dark?'dark':'light')};
  const text=(el,value)=>{el.textContent=value};
  function populate(){
    const rows=data[collection];
    for(const key of ['year','category','kind']){
      $(key).replaceChildren(new Option(key==='year'?'所有年份':key==='category'?'所有分类':'所有卡型',''));
      const values=[...new Set(rows.map(r=>key==='year'?String(r.year||'待确认'):r[key]))].sort((a,b)=>a.localeCompare(b,'zh-CN',{numeric:true}));
      for(const v of values)$(key).add(new Option(v,v));
    }
  }
  function render(reset=true){
    if(!data)return;
    if(reset){
      const q=$('query').value.trim().toLowerCase();
      filtered=data[collection].filter(r=>(!q||[r.title,r.series,r.id].join(' ').toLowerCase().includes(q))&&['year','category','kind'].every(k=>!$(k).value||String(k==='year'?(r.year||'待确认'):r[k])===$(k).value)&&(!$('missing').checked||!r.back)).sort((a,b)=>Number(a.year||9999)-Number(b.year||9999)||a.series.localeCompare(b.series,'zh-CN',{numeric:true})||a.id.localeCompare(b.id));
      shown=0;$('grid').replaceChildren();
    }
    filtered.slice(shown,shown+limit).forEach((r,j)=>{
      const index=shown+j,button=document.createElement('button');button.type='button';button.className='card';button.setAttribute('aria-label','查看 '+r.title);button.dataset.id=r.id;
      const art=document.createElement('div');art.className='art';const img=new Image();img.referrerPolicy=r.front.includes('daumcdn.net')?'origin':'no-referrer';img.src=r.front;img.alt=r.title+' 正面';img.loading='lazy';img.decoding='async';img.onerror=()=>{img.hidden=true;const error=document.createElement('span');error.className='art-error';text(error,'点击查看来源');art.append(error)};art.append(img);
      const badge=document.createElement('span');badge.className='badge';text(badge,r.back?'正反面':'背面待补');art.append(badge);button.append(art);
      const h=document.createElement('h3');text(h,r.series);button.append(h);const p=document.createElement('p');text(p,(r.year||'年份待确认')+' · '+r.kind);button.append(p);button.onclick=()=>{opener=button;open(index)};$('grid').append(button);
    });
    shown=Math.min(shown+limit,filtered.length);text($('count'),filtered.length+' 条收藏 · 已显示 '+shown+' 条');$('more').hidden=shown>=filtered.length;$('empty').hidden=filtered.length!==0;
  }
  function face(nextSide){
    const r=filtered[selected];side=nextSide;const url=r[side],size=r[side+'Size'];
    $('detailImage').hidden=false;$('imageError').hidden=true;$('detailImage').referrerPolicy=url.includes('daumcdn.net')?'origin':'no-referrer';$('detailImage').src=url;$('detailImage').alt=r.title+(side==='front'?' 正面':' 背面');
    $('detailImage').onerror=()=>{$('detailImage').hidden=true;$('imageError').hidden=false};
    $('original').href=url;text($('detailSize'),(side==='front'?'正面':'背面')+' · '+(size?size.join(' × ')+' px':'原尺寸'));
    for(const s of ['front','back'])$(s).setAttribute('aria-pressed',String(s===side));
  }
  function open(index){
    selected=index;const r=filtered[selected];text($('detailIndex'),(selected+1)+' / '+filtered.length);text($('detailYear'),(r.year||'年份待确认')+' · '+r.kind);text($('detailTitle'),r.title);text($('detailSeries'),r.series);text($('detailNote'),r.note||'');$('source').href=r.source;$('back').disabled=!r.back;text($('back'),r.back?'背面':'背面待补');$('prev').disabled=selected===0;$('next').disabled=selected===filtered.length-1;face('front');if(!$('detail').open)$('detail').showModal();
  }
  $('close').onclick=()=>$('detail').close();$('detail').addEventListener('close',()=>{opener?.focus()});$('detail').addEventListener('click',e=>{if(e.target===$('detail')){const r=$('detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('detail').close()}});
  $('front').onclick=()=>face('front');$('back').onclick=()=>face('back');$('prev').onclick=()=>open(selected-1);$('next').onclick=()=>open(selected+1);
  $('filters').onsubmit=e=>e.preventDefault();for(const id of ['query','year','category','kind','missing'])$(id).addEventListener('input',()=>render());
  $('clearFilters').onclick=()=>{$('filters').reset();render()};$('more').onclick=()=>render(false);
  for(const button of document.querySelectorAll('[data-collection]'))button.onclick=()=>{collection=button.dataset.collection;for(const b of document.querySelectorAll('[data-collection]'))b.setAttribute('aria-pressed',String(b===button));$('filters').reset();populate();render()};
  async function load(){try{$('error').hidden=true;const response=await fetch('./data/photocards.json?v=20261002-1');if(!response.ok)throw Error(response.status);data=await response.json();populate();render();const hero=data.catalog.find(r=>r.series==='LILAC'&&r.kind==='小卡')||data.catalog.find(r=>r.kind==='小卡');$('heroImage').referrerPolicy='no-referrer';$('heroImage').src=hero.front;}catch(e){$('error').hidden=false;text($('count'),'目录加载失败')}}
  $('retry').onclick=load;load();
})();

