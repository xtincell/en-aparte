import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const app = new URL('../En-aparte.html', import.meta.url).href;
const profile = await mkdtemp(join(tmpdir(), 'en-aparte-chrome-'));
const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
  '--headless=new', '--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox',
  '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'
], { stdio: 'ignore' });
let startupError;
chrome.on('error', err => { startupError = err; });
let socket;
try {
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    if (startupError) throw startupError;
    try { port = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); } catch { await delay(100); }
  }
  assert.ok(port, 'Chrome doit exposer son port de test');
  const pages = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  socket = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let seq = 0;
  const pending = new Map(), errors = [];
  socket.onmessage = event => {
    const m = JSON.parse(event.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (!pending.has(m.id)) return;
    const { resolve, reject } = pending.get(m.id); pending.delete(m.id);
    if (m.error) reject(Error(m.error.message)); else resolve(m.result);
  };
  function call(method, params = {}) {
    const id = ++seq;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  const click = id => evaluate('document.getElementById(' + JSON.stringify(id) + ').click()');
  const select = (id, value) => evaluate('(()=>{const n=document.getElementById(' + JSON.stringify(id) + ');n.value=' + JSON.stringify(value) + ';n.dispatchEvent(new Event(n.type==="number"?"input":"change",{bubbles:true}));})()');
  const picks = () => evaluate('Array.from(document.querySelectorAll("[data-choice]"), n=>n.dataset.choice)');
  async function ready() {
    for (let i=0; i<100; i++) {
      if (await evaluate('document.readyState==="complete" && typeof window.EA_DNA?.select==="function" && document.getElementById("r-count")?.textContent.length>0')) return;
      await delay(50);
    }
    throw Error('Moteur non chargé. ' + errors.join('\n'));
  }
  await call('Runtime.enable');
  await call('Page.enable');
  await call('Page.navigate', { url: app }); await ready();
  await select('day', '2026-11-21');
  assert.equal((await picks()).length, 3);
  await click('r-all');
  assert.match(await evaluate('document.getElementById("catalogNote").textContent'), /^86 pistes/);
  await click('r-picks');
  const initial = await picks(); await click('r-next');
  assert.ok((await picks()).every(id => !initial.includes(id)));
  await click('r-undo'); assert.deepEqual(await picks(), initial);
  await select('city','Douala');assert.deepEqual((await picks()).sort(),['opt-030','opt-047']);
  await select('city','Abidjan');await select('r-intent','soft');
  assert.ok((await picks()).every(id=>!['opt-002','opt-031','opt-076','opt-080','opt-089'].includes(id)));
  await evaluate('document.querySelector("[data-r-action=detail]").click()');
  assert.ok(await evaluate('document.getElementById("detail").open'));await click('closeDetail');
  await select('r-place','remote');await select('r-intent','repas');await select('r-time','12:00');
  assert.deepEqual(await picks(),['maison-discussion']);
  assert.match(await evaluate('document.getElementById("r-clock").textContent'), /13:00/);
  await evaluate('document.querySelector("[data-r-action=add]").click()');
  assert.equal(await evaluate('Sheet.count()'),1);
  await select('r-intent','creation');await select('r-duration','15');await select('r-time','23:30');
  assert.match(await evaluate('document.getElementById("r-clock").textContent'), /2026-11-22 · 00:30/);
  await evaluate('document.querySelector("[data-r-action=add]").click()');
  assert.equal(await evaluate('JSON.parse(localStorage.getItem("en-aparte-public-programme-v1")).at(-1).duration'),15);
  await select('r-place','local');await select('r-intent','explore');await select('r-duration','0');await select('r-size','2');
  await evaluate('document.getElementById("r-editor").open=true');
  for (const [i,axis] of [[0,'calme'],[1,'anime']]) {
    await select('r-axis-'+i,axis);await select('r-weight-'+i,'2');
    await evaluate('document.querySelector(' + JSON.stringify('[data-rule="'+i+'"]') + ').click()');
  }
  assert.match(await evaluate('document.getElementById("r-results").textContent'), /indispensables du groupe/);
  await select('r-target','1');
  assert.doesNotMatch(await evaluate('document.getElementById("r-results").textContent'), /indispensables du groupe/);
  await click('r-compare');assert.ok(await evaluate('document.getElementById("ep-pair-dialog").open'));
  await evaluate('document.getElementById("ep-pair-dialog").close()');
  for (const width of [1280,390,320]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height:850, deviceScaleFactor:1, mobile:false });
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'débordement à '+width+' px');
  }
  await click('mobilePlan');assert.ok(await evaluate('document.querySelector(".sh-dialog").open'));
  await call('Page.navigate',{url:'about:blank'});await delay(100);
  await call('Page.navigate',{url:app});await ready();
  assert.equal(await evaluate('Sheet.count()'),2);
  assert.deepEqual(errors,[]);
  console.log('OK — catalogue, sélection, groupe, deux fuseaux, budget de temps, programme, persistance, 1280/390/320 px.');
} finally {
  if (socket?.readyState === 1) socket.close();
  if (chrome.exitCode === null && chrome.pid) {
    const exited = new Promise(resolve => chrome.once('exit', resolve));
    chrome.kill('SIGKILL'); await exited;
  }
  await rm(profile,{recursive:true,force:true,maxRetries:4,retryDelay:100});
}
