import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const app = process.env.EA_URL || new URL('../En-aparte.html', import.meta.url).href;
const page = await browser.newPage({ viewport: { width: 1280, height: 920 } });
page.setDefaultTimeout(6000);

const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error' && /Content Security Policy/i.test(message.text())) errors.push(message.text()); });
const field = id => page.locator('#' + id);
const program = variant => field('oc-programmes').locator('.oc-program[data-variant="' + variant + '"]');
const firstOffer = card => card.locator('li[data-oc-offer]').first();

// Open the same disclosure controls a reader would have to open on a narrow screen.
async function openDetailsFor(locator) {
  const parents = locator.locator('xpath=ancestor::details');
  for (let i = 0; i < await parents.count(); i++) {
    const parent = parents.nth(i);
    if (!(await parent.evaluate(node => node.open))) await parent.locator(':scope > summary').click();
  }
}
async function click(id) {
  const control = field(id);
  await openDetailsFor(control);
  await control.click();
}
async function setBrief(brief) {
  await openDetailsFor(field('oc-paste'));
  await field('oc-paste').fill(JSON.stringify(brief));
  await click('oc-load');
}
async function checkMobile(width) {
  await page.setViewportSize({width, height: 850});
  const sizes = await page.evaluate(() => ({
    screen: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  assert.ok(sizes.content <= sizes.screen + 1, 'Pas de débordement du document à ' + width + ' px : ' + JSON.stringify(sizes));
}

try {
  await page.goto(app);
  await field('oc-form').waitFor({state:'visible'});
  await click('oc-inspire');
  await field('oc-shelf').waitFor({state:'visible'});
  const cards = field('oc-tiles').locator('[data-oc-use]');
  assert.ok(await cards.count() > 0, 'La bibliothèque propose des occasions à utiliser');
  await checkMobile(390);
  await cards.first().click();
  await field('oc-form').waitFor({state:'visible'});
  assert.ok(await field('oc-occasion').inputValue(), 'Choisir une idée prépare le formulaire');

  // Public QA fixture, chosen to exercise input restoration, two clocks and two currencies.
  const brief = {
    jour:'2026-11-28', ville:'Abidjan', autre:'Douala', participants:2, occasion:'distance-douce',
    mode:'remote', rythme:'soft', debut:'13:35', fin:'18:20', budget:36000, partXOF:40
  };
  await setBrief(brief);
  for (const [id, expected] of Object.entries({
    'oc-occasion':'distance-douce', 'oc-size':'2', 'oc-mode':'remote', 'oc-energy':'soft',
    'oc-partner':'Douala', 'oc-from':'13:35', 'oc-until':'18:20',
    'oc-allocation':'split', 'oc-share':'40', day:'2026-11-28', city:'Abidjan'
  })) assert.equal(await field(id).inputValue(), expected, 'Brief relu dans '+id);
  await click('oc-compose');
  await field('oc-programmes').locator('.oc-program').first().waitFor({state:'visible'});
  const remote = program('pause-ensemble');
  await remote.waitFor({state:'visible'});
  const meal = firstOffer(remote);
  assert.match(await meal.innerText(), /repas|déjeun|dîner|table/i, 'Un repas figure dans la variante à table');
  assert.match(await field('oc-programmes').innerText(), /XOF/);
  assert.match(await field('oc-programmes').innerText(), /XAF/);
  const lock = meal.locator('[data-oc-lock]');
  const lockedId = await meal.getAttribute('data-oc-offer');
  assert.ok(lockedId);
  await lock.click();
  assert.equal(await lock.getAttribute('aria-pressed'), 'true', 'Verrou porté par le bouton de l’étape');
  assert.equal(await meal.getAttribute('data-oc-offer'), lockedId);
  await checkMobile(320);
  await checkMobile(390);
  await checkMobile(1280);

  const before = await page.evaluate(() => window.Sheet.count());
  const included = await remote.locator('li[data-oc-offer]').count();
  assert.ok(included >= 1);
  const add = remote.locator('[data-oc-plan-add]');
  await add.click();
  assert.ok((await field('oc-saved').innerText()).trim(), 'Confirmation après ajout');
  const retained = await page.evaluate(() => window.Sheet.count());
  assert.ok(retained >= before + included, 'Toutes les étapes proposées rejoignent le programme');
  await page.reload();
  await field('oc-form').waitFor({state:'visible'});
  assert.equal(await page.evaluate(() => window.Sheet.count()), retained, 'Programme conservé après rechargement');
  assert.equal(await field('oc-share').inputValue(),'40');
  assert.equal(await field('oc-allocation').inputValue(),'split');
  assert.match(await page.locator('#side').innerText(), /XAF/);

  // A two-step variant with several playable/creative formats, then several conversation formats.
  await setBrief({...brief, occasion:'date-a-deux', rythme:'any', debut:'10:15', fin:'18:30'});
  await click('oc-compose');
  const conventional = program('faire-puis-parler');
  await conventional.waitFor({state:'visible'});
  const steps = conventional.locator('li[data-oc-offer]');
  assert.ok(await steps.count() >= 2, 'Le rendez-vous associe au moins deux étapes');
  const first = steps.first(), second = steps.nth(1);
  const initialA = await first.getAttribute('data-oc-offer');
  const initialB = await second.getAttribute('data-oc-offer');
  await first.locator('[data-oc-lock]').click();
  await second.locator('[data-oc-skip]').click();
  assert.equal(await first.getAttribute('data-oc-offer'), initialA, 'Remplacer une étape préserve le choix verrouillé');
  assert.notEqual(await second.getAttribute('data-oc-offer'), initialB, 'Le moteur a réellement remplacé la seconde activité');
  assert.equal(await first.locator('[data-oc-lock]').getAttribute('aria-pressed'), 'true');

  // A group quotation belongs to the party and date for which it was entered.
  await setBrief({jour:'2026-11-28',ville:'Abidjan',participants:2,occasion:'retrouvailles',mode:'local',debut:'15:00',fin:'21:00',budget:12000,devise:'XOF',court:true});
  const memories=program('souvenir-croise');
  const choice=memories.locator('[data-oc-choice="0"]');
  await openDetailsFor(choice);await choice.selectOption('opt-035');
  const chooseQuote=memories.locator('[data-oc-offer="opt-035"] [data-oc-unit="XOF"]');
  await openDetailsFor(chooseQuote);await chooseQuote.fill('9000');await memories.locator('[data-oc-quote]').first().click();
  assert.match(await memories.innerText(),/9.?000 XOF/);
  await field('oc-size').selectOption('6');
  assert.equal(await memories.locator('li[data-oc-offer]').count(),0,'Devis pour deux invalidé au passage à six');
  await field('oc-size').selectOption('2');
  assert.match(await memories.innerText(),/10.?000 XOF/);
  await field('currency').selectOption('XAF');
  assert.equal(await memories.locator(':scope > .micro').textContent(),'À vérifier');
  assert.match(await memories.textContent(),/plafond en XAF ne couvre pas les dépenses en XOF/);
  await setBrief({...brief, occasion:'fete-a-distance', autre:'Abidjan'});
  assert.equal(await field('oc-programmes').locator('li[data-oc-offer]').count(),0,'Deux villes distinctes requises');
  const profileEditor=page.locator('#oc-people [data-ocp="axis"]');
  await openDetailsFor(profileEditor);
  assert.equal(await profileEditor.locator('option').count(),24);
  assert.equal(await profileEditor.locator('optgroup').count(),3);
  await profileEditor.selectOption('musique');
  await page.locator('#oc-people [data-ocp="apply"]').click();
  assert.match(await field('oc-people').innerText(),/musique/i);
  await click('oc-single');
  await field('r-output').waitFor({state:'visible'});
  await click('oc-start');
  await field('oc-form').waitFor({state:'visible'});
  assert.deepEqual(errors, [], 'Aucune exception JavaScript au cours du parcours');
  console.log('OK — inspiration, brief portable, formules individuelles et partagées, deux monnaies, recomposition et verrou, sauvegarde, catalogue, trois tailles.');
} finally {
  await browser.close();
}
