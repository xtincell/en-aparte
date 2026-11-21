import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1280,height:850}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type()==='error' && /Content Security Policy/i.test(message.text())) errors.push(message.text()); });
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
  const app = process.env.EA_URL || new URL('../En-aparte.html', import.meta.url).href;
  await page.goto(app); await ready(); await click('oc-single');
  await select('day', '2026-11-21');
  assert.equal((await picks()).length, 3);
  await click('r-all');
  assert.match(await evaluate('document.getElementById("catalogNote").textContent'), /^84 pistes/);
  const coverage=await evaluate(()=>{
    const day='2026-11-21',city='Abidjan';
    const eligible=allOptions.filter(c=>c.city===city && !EAday(c,day).out);
    const groups=cards=>new Set(cards.map(c=>c.duplicateGroup || c.id)).size;
    const postponed=allOptions.filter(c=>c.duplicateGroup==='maimouna');
    const ranked=EA_DNA.select(allOptions,{city,day,intent:'culture',currency:'XOF'}).unique;
    return {
      total:allOptions.length, saturday:eligible.length, groups:groups(eligible),
      established:groups(eligible.filter(c=>!c.dateUnverified)),
      postponed:postponed.map(c=>c.id),
      visible:eligible.concat(ranked.map(r=>r.d)).some(c=>c.duplicateGroup==='maimouna'),
      dates:postponed.map(c=>[EAday(c,'2027-04-23').out,EAday(c,'2027-04-24').label,EAday(c,'2027-04-25').out,c.costValue])
    };
  });
  assert.deepEqual([coverage.total,coverage.saturday,coverage.groups,coverage.established],[91,84,80,77]);
  assert.deepEqual(coverage.postponed,['opt-002','opt-076']);
  assert.equal(coverage.visible,false);
  for(const [before,label,after,price] of coverage.dates){
    assert.equal(before && after,true);assert.match(label,/24 avril 2027.*billetterie à confirmer/);assert.equal(price,null);
  }
  await page.locator('#q').fill('Biama');
  assert.match(await page.locator('#catalogNote').textContent(),/^0 pistes?/);
  await page.locator('#q').fill('');
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
  const pairOptions=side=>page.locator('#ep-pair-select-'+side+' option').evaluateAll(opts=>opts.map(o=>o.value));
  for (const side of ['A','B']){
    const other=side==='A'?'B':'A',id=side==='A'?'opt-002':'opt-076';
    const hasBoth=ids=>['opt-002','opt-076'].every(id=>ids.includes(id));
    const hasNeither=ids=>['opt-002','opt-076'].every(id=>!ids.includes(id));
    assert.ok(hasNeither(await pairOptions(side)));
    await select('ep-pair-date-'+side,'2027-04-24');
    assert.ok(hasBoth(await pairOptions(side)));assert.ok(hasNeither(await pairOptions(other)));
    await select('ep-pair-select-'+side,id);
    assert.match(await page.locator('#ep-pair-detail-'+side).textContent(),/24 avril 2027/);
    await select('ep-pair-date-'+side,'2026-11-21');
    assert.ok(hasNeither(await pairOptions(side)));
    assert.equal(await page.locator('#ep-pair-select-'+side).inputValue(),'');
    assert.match(await page.locator('#ep-pair-detail-'+side).textContent(),/Aucun lieu choisi/);
    assert.ok(await page.locator('#ep-pair-add').isDisabled());
  }
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
