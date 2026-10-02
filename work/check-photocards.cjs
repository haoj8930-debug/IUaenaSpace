const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.argv[2]||'http://127.0.0.1:4182';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 fs.mkdirSync('outputs',{recursive:true});
 const summaries=[];
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/photocards.html');
  await page.waitForFunction(()=>document.querySelector('#grid').children.length===36);
  assert.match(await page.locator('#count').textContent(),/^899 /);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow '+width);
  await page.locator('#more').click();assert.equal(await page.locator('.card').count(),72);
  await page.locator('#missing').check();assert.match(await page.locator('#count').textContent(),/^464 /);
  await page.locator('.card').first().click();assert.equal(await page.locator('#back').isDisabled(),true);
  await page.locator('#close').click();
  await page.locator('#clearFilters').click();await page.locator('#year').selectOption('2025');
  assert.ok((await page.locator('.card p').allTextContents()).every(t=>t.startsWith('2025')));
  await page.locator('#query').fill('__no_card__');assert.equal(await page.locator('.card').count(),0);assert.equal(await page.locator('#empty').isVisible(),true);
  await page.locator('#clearFilters').click();await page.locator('[data-collection=scans]').click();assert.match(await page.locator('#count').textContent(),/^407 /);
  await page.locator('[data-collection=catalog]').click();
  await page.locator('.card').first().click();
  const url=await page.locator('#original').getAttribute('href');assert.match(url,/^https:\/\//);
  if(!await page.locator('#back').isDisabled()){
   await page.locator('#back').click();assert.equal(await page.locator('#back').getAttribute('aria-pressed'),'true');assert.notEqual(await page.locator('#original').getAttribute('href'),url);
  }
  await page.keyboard.press('Escape');assert.equal(await page.locator('#detail').evaluate(d=>d.open),false);
  await page.locator('#theme').click();
  await page.screenshot({path:`outputs/photocards-${width}.png`,fullPage:false});
  const image=await page.locator('.card img').first().evaluate(async im=>{if(!im.complete)await new Promise(resolve=>{im.addEventListener('load',resolve,{once:true});im.addEventListener('error',resolve,{once:true});setTimeout(resolve,15000)});return {loaded:im.naturalWidth>0,width:im.naturalWidth,url:im.src}});
  assert.equal(image.loaded,true,'public image failed '+image.url);
  assert.deepEqual(errors,[]);
  summaries.push({width,loadedImageWidth:image.width});await page.close();
 }
 const page=await browser.newPage({serviceWorkers:'block'});await page.goto(base+'/?view=merch');await page.locator('.photocard-entry').waitFor({state:'visible'});await page.locator('.photocard-entry').click();await page.waitForURL('**/photocards.html');
 await browser.close();console.log(JSON.stringify({passed:true,viewports:summaries,entry:true}));
})().catch(e=>{console.error(e);process.exit(1)});

