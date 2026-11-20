import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1280,height:850}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const evaluate = expression => page.evaluate(expression);
  const click = id => page.locator('#'+id).click();
  async function select(id,value) {
    await page.locator('#'+id).evaluate((control, value) => {
      control.value = value;
      control.dispatchEvent(new Event(control.type === 'number' ? 'input' : 'change', {bubbles:true}));
    },value);
  }
  const ready = () => page.waitForFunction(() => typeof window.EA_DNA?.select==='function' && document.querySelector('#r-count')?.textContent);
  const picks = () => page.locator('[data-choice]').evaluateAll(nodes => nodes.map(n=>n.dataset.choice));
  const app = new URL('../En-aparte.html', import.meta.url).href;
  await page.goto(app); await ready();
  await select('day', '2026-11-21');
  assert.equal((await picks()).length, 3);
  await click('r-all');
  assert.match(await evaluate('document.getElementById("catalogNote").textContent'), /^86 pistes/);
  await click('r-picks');
  const initial = await picks(); await click('r-next');
  assert.ok((await picks()).every(id => !initial.includes(id)));
  await click('r-undo'); assert.deepEqual(await picks(), initial);
  await select('city','Douala');assert.deepEqual((await picks()).sort(),['opt-030','opt-047']);
  await select('budget', '3000');
  assert.match(await evaluate('document.getElementById("r-count").textContent'),/3.?000 XAF/);
  assert.match(await evaluate('document.getElementById("r-results").textContent'),/Repère supérieur/);
  await select('currency','XOF');
  assert.match(await evaluate('document.getElementById("r-results").textContent'),/Prix en XAF et budget en XOF/);
  await select('budget','');await select('city','Abidjan');await select('r-intent','soft');
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
    await page.setViewportSize({width,height:850});
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'débordement à '+width+' px');
  }
  await click('mobilePlan');assert.ok(await evaluate('document.querySelector(".sh-dialog").open'));
  await page.reload();await ready();
  assert.equal(await evaluate('Sheet.count()'),2);
  assert.deepEqual(errors,[]);
  console.log('OK — catalogue, sélection, groupe, deux fuseaux, budget de temps, programme, persistance, 1280/390/320 px.');
} finally {
  await browser.close();
}
