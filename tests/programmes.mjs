import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';

const html = await readFile(new URL('../En-aparte.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const ctx = createContext({});
// The production modules need the browser global name, but never a DOM.
ctx.window = ctx;
const run = code => runInContext(code, ctx, { timeout: 10000 });

function scriptById(id) {
  const script = scripts.find(([, attrs]) => /\bid\s*=\s*["']([^"']+)["']/.exec(attrs)?.[1] === id);
  assert.ok(script, 'Module introuvable : ' + id);
  return script[2];
}
function between(source, start, stop) {
  const a = source.indexOf(start), b = source.indexOf(stop, a + start.length);
  assert.ok(a >= 0 && b > a, 'Déclarations introuvables : ' + start);
  return source.slice(a,b);
}
const corpus = scripts.find(([, , code]) => code.trimStart().startsWith('const allOptions='));
const dna = scripts.find(([, , code]) => code.includes('window.EA_DNA={axes,levels,profile}'));
const app = scripts.find(([, , code]) => code.includes('window.EAday=function') && code.includes('function remoteIdeas(city)'));
assert.ok(corpus && dna && app, 'Sources du catalogue et profils');
run(corpus[2]);
run(dna[2]);
run(between(app[2], 'const dates=', 'function save(){try{localStorage.setItem(catalogKey'));
run(between(app[2], 'function remoteIdeas(city)', 'function createEngine('));
for (const id of ['oc-editorial','oc-adapter','oc-engine']) run(scriptById(id));
const {composeOccasion, occasionOffers, OC_EDITION, allOptions} =
  run('({composeOccasion, occasionOffers, OC_EDITION, allOptions})');


const brief = {
  city:'Abidjan', partnerCity:'Douala', mode:'local', size:2, day:'2026-11-21',
  startMin:600, endMin:810, energy:'any', audience:'any', people:[{weights:{}},{weights:{}}],
  budget:{XOF:null,XAF:null}, transferMin:15, locks:{}, skipIds:[], omitOptional:false
};
const favorable = why => ({kind:'source', value:2, why});
const axes = Object.fromEntries(['effort','marche','assise','calme','abri','flex','simple','duo','groupe','conversation','intimite','prepaLegere']
  .map(k=>[k,favorable('Propriété de la fixture '+k)]));
axes.sucre = {kind:'na',value:null,why:'Aucun repas pour cette fixture.'};
function offer(id,pool,patch={}) {
  return {id,title:id,pools:[pool],kind:'local',city:brief.city,area:'Quartier A',
    price:0,currency:'XOF',priceBasis:'group',minDuration:10,energy:'low',axes,
    source:'Fixture',condition:'',dateStatus:'eligible',startAt:null,endAt:null,
    duplicateKey:id, ...patch};
}
function stage(role,pool,patch={}) {return {role,pool:[pool],minutes:20,...patch};}
function sample(stages,model={}) {
  return {id:'fixture',title:'Sortie de test',level:1,description:'',filters:{mode:'any',size:[1,6],energy:'any'},
    variants:[{id:'variant',title:'Essai',pitch:'',steps:stages}], ...model};
}
function evaluate(stages,items,changes={},model={}) {
  return composeOccasion(sample(stages,model),{...brief,...changes},items);
}
function feasible(plans) {return plans.filter(p=>p.status!=='impossible' && p.steps.length);}
function requirePlan(plans) {
  const found=feasible(plans)[0];
  assert.ok(found,'Aucun programme réalisable : '+JSON.stringify(plans));return found;
}
function expectImpossible(plans) {
  assert.ok(plans.some(p=>p.status==='impossible' && p.warnings.concat(p.reasons).some(Boolean)), 'Le refus doit être expliqué');
  assert.equal(feasible(plans).length,0,'Une contrainte certaine a été assouplie');
}

const cases = [];
function test(label,check) {check();cases.push(label);}

test('Une seule activité convient ; le prix par personne est porté au total du groupe',()=>{
  const p=requirePlan(evaluate([stage('Visite','culture')],[offer('expo','culture',{price:700,priceBasis:'person'})],
    {budget:{XOF:1400,XAF:0}}));
  assert.equal(p.steps.filter(s=>s.id==='expo').length,1);
  assert.equal(p.totals.XOF,1400);assert.equal(p.unknownCosts,0);assert.equal(p.steps.find(s=>s.id==='expo').duration,20);
  expectImpossible(evaluate([stage('Visite','culture')],[offer('expo','culture',{price:700,priceBasis:'person'})],{budget:{XOF:1399,XAF:0}}));
});

test('Prix manquant, gratuité explicite et plafond nul sont distincts',()=>{
  const p=requirePlan(evaluate([stage('Visite','culture')],[offer('prix-a-verifier','culture',{price:null,priceBasis:'unknown'})],
    {budget:{XOF:0,XAF:0}}));
  assert.equal(p.status,'verify');assert.ok(p.unknownCosts>=1);
  assert.equal(p.steps.find(s=>s.id==='prix-a-verifier').cost,null);
  const free=requirePlan(evaluate([stage('Visite','culture')],[offer('gratuit','culture')],{budget:{XOF:0,XAF:0}}));
  assert.equal(free.unknownCosts,0);assert.equal(free.totals.XOF,0);
});

test('Les enveloppes XOF et XAF sont indépendantes',()=>{
  const two=[stage('Création','create'),stage('Conversation','talk')];
  const options=[offer('echange-a','create',{kind:'remote',price:750,currency:'XOF'}),offer('echange-b','talk',{kind:'remote',price:450,currency:'XAF'})];
  const p=requirePlan(evaluate(two,options,{mode:'remote',budget:{XOF:750,XAF:450}}));
  assert.equal(p.totals.XOF,750);assert.equal(p.totals.XAF,450);
  expectImpossible(evaluate(two,options,{mode:'remote',budget:{XOF:5000,XAF:449}}));
});

test('Un indispensable documenté d’une personne ne disparaît pas dans la moyenne',()=>{
  const scene=offer('scene','music',{axes:{...axes,calme:{kind:'source',value:0,why:'Musique amplifiée confirmée.'}}});
  const people=[{weights:{assise:1,flex:1,simple:1}},{weights:{calme:2}}];
  expectImpossible(evaluate([stage('Écouter','music')],[scene],{people}));
  const uncertain={...scene,axes:{...axes,calme:{kind:'inconnu',value:null,why:'Aucune information.'}}};
  const p=requirePlan(evaluate([stage('Écouter','music')],[uncertain],{people}));
  assert.equal(p.status,'verify');
});

test('Une visite sans repas reste disponible quand l’option peu sucrée est indispensable',()=>{
  const p=requirePlan(evaluate([stage('Visiter','culture')],[offer('sans-repas','culture')],{people:[{weights:{sucre:2}},{weights:{}}]}));
  assert.ok(p.steps.some(s=>s.id==='sans-repas'));
});

test('Deux fiches du même lieu ne remplissent pas deux étapes distinctes',()=>{
  const linked='lieu-commun';
  expectImpossible(evaluate([stage('Visiter','culture'),stage('Jouer','play')],
    [offer('a','culture',{duplicateKey:linked}),offer('b','play',{duplicateKey:linked})]));
});

test('Une fermeture, un horaire fixe dépassé et une durée minimale impossible bloquent la visite',()=>{
  const visit=[stage('Visite','culture')];
  for(const bad of [{dateStatus:'out'},{startAt:570},{minDuration:90},{window:[500,595]},{earliestStart:625}])
    expectImpossible(evaluate(visit,[offer('visite','culture',bad)],{endMin:630}));
});

test('Le transfert entre quartiers et la fin de soirée sont évalués ensemble',()=>{
  const stages=[stage('Voir','culture'),stage('Jouer','play')];
  const options=[offer('expo','culture'),offer('jeu','play',{area:'Quartier B'})];
  expectImpossible(evaluate(stages,options,{endMin:650,transferMin:20}));
  const p=requirePlan(evaluate(stages,options,{endMin:680,transferMin:20}));
  const first=p.steps.find(s=>s.id==='expo'),second=p.steps.find(s=>s.id==='jeu');
  assert.ok(second.startMin>=first.endMin+20);assert.ok(second.endMin<=680);
  const pending=requirePlan(evaluate(stages,options,{transferMin:null}));
  assert.equal(pending.status,'verify');assert.ok(pending.warnings.length>0);
});

test('Un remplacement respecte une étape verrouillée et refuse un verrou incompatible',()=>{
  const stages=[stage('Voir','culture'),stage('Jouer','play')];
  const options=[offer('expo-a','culture'),offer('expo-b','culture'),offer('jeu-a','play'),offer('jeu-b','play')];
  const p=requirePlan(evaluate(stages,options,{locks:{Voir:'expo-b'},skipIds:['jeu-a']}));
  assert.ok(p.steps.some(s=>s.id==='expo-b'));assert.ok(p.steps.some(s=>s.id==='jeu-b'));
  assert.ok(!p.steps.some(s=>s.id==='jeu-a'));
  expectImpossible(evaluate(stages,options,{locks:{Voir:'absent'}}));
});

test('Un présentiel facultatif n’est jamais imposé quand on choisit un seul moment',()=>{
  const stages=[stage('Appel','talk'),stage('Visite individuelle','care',{optional:true,scope:'individual',target:'partner'})];
  const selected=requirePlan(evaluate(stages,[offer('appel','talk',{kind:'remote'}),offer('soin','care',{city:'Douala',currency:'XAF'})],
    {mode:'remote',omitOptional:true}));
  assert.equal(selected.steps.length,1);assert.equal(selected.steps[0].id,'appel');
});

test('Catalogue réel, occasions éditoriales et statuts de report',()=>{
  assert.equal(allOptions.length,91);
  assert.ok(OC_EDITION.length>=9);assert.equal(new Set(OC_EDITION.map(o=>o.id)).size,OC_EDITION.length);
  assert.ok(OC_EDITION.every(o=>o.variants.length>=2));
  const real=occasionOffers(allOptions,brief);
  assert.ok(real.some(o=>o.kind==='local' && o.city===brief.city));
  const abidjan=real.filter(o=>o.id.startsWith('opt-') && o.city===brief.city);
  assert.equal(abidjan.length,89);
  for(const id of ['opt-002','opt-076']) assert.equal(abidjan.find(o=>o.id===id)?.dateStatus,'out');
  const eligible=abidjan.filter(o=>o.dateStatus!=='out');
  assert.equal(eligible.length,84);
  assert.equal(new Set(eligible.map(o=>o.duplicateKey||o.id)).size,80);
  const dateUnverified=new Set(['opt-072','opt-074','opt-077']);
  assert.equal(new Set(eligible.filter(o=>!dateUnverified.has(o.id)).map(o=>o.duplicateKey||o.id)).size,77);
  const museum=occasionOffers(allOptions,{...brief,mode:'local',city:'Douala'}).find(o=>o.id==='opt-047');
  assert.ok(museum && museum.facets && museum.currency==='XAF');assert.equal(museum.axes.sucre.kind,'na');
});

test('Une occasion très spécifique est composable sur les véritables formats à distance',()=>{
  const occasion=OC_EDITION.find(o=>o.id==='distance-douce');assert.ok(occasion);
  assert.equal(occasion.filters.mode,'remote');assert.equal(occasion.filters.size[0],2);assert.equal(occasion.filters.size[1],2);
  const q={...brief,mode:'remote',energy:'soft',omitOptional:true,startMin:1020,endMin:1290,budget:{XOF:12000,XAF:9000}};
  const real=occasionOffers(allOptions,q), plans=composeOccasion(occasion,q,real);
  const p=requirePlan(plans);assert.ok(p.steps.some(s=>s.kind==='remote'));assert.ok(p.steps.every(s=>s.endMin<=q.endMin));
  assert.ok(!p.steps.some(s=>s.scope==='individual'));
  for(const c of ['XOF','XAF'])assert.ok(p.totals[c]<=q.budget[c]);
});

test('Un transfert chiffré entre dans le plafond de la ville et demeure inconnu avant chiffrage',()=>{
  const stages=[stage('Voir','culture'),stage('Jouer','play')];
  const options=[offer('expo','culture',{price:100}),offer('jeu','play',{area:'Quartier B',price:120})];
  const cost={XOF:50,XAF:70};
  expectImpossible(evaluate(stages,options,{budget:{XOF:269,XAF:500},transferCost:cost}));
  const p=requirePlan(evaluate(stages,options,{budget:{XOF:270,XAF:0},transferCost:cost}));
  assert.equal(p.totals.XOF,270);assert.equal(p.totals.XAF,0);
  assert.ok(requirePlan(evaluate(stages,options)).unknownCosts>0);
});

test('Un rythme doux départage le sport et un moment calme selon leur effort réel',()=>{
  const items=[offer('rythme-soutenu','play',{energy:'high'}),offer('rythme-doux','play',{energy:'low'})];
  const p=requirePlan(evaluate([stage('Jeu','play')],items,{energy:'soft'}));
  assert.equal(p.steps[0].id,'rythme-doux');
  const meal=offer('carte-inconnue','meal',{axes:{...axes,sucre:{value:null,kind:'inconnu',why:'Aucune carte de boissons.'}}});
  const unresolved=requirePlan(evaluate([stage('Repas','meal')],[meal],{people:[{weights:{sucre:2}},{weights:{}}]}));
  assert.equal(unresolved.status,'verify');
});

test('Le modèle à distance refuse le mauvais effectif, le mauvais mode ou un rythme incompatible',()=>{
  const occasion=OC_EDITION.find(o=>o.id==='distance-douce');
  for(const patch of [{size:3},{mode:'local'},{energy:'active'}]){
    const q={...brief,mode:'remote',energy:'soft',...patch};
    expectImpossible(composeOccasion(occasion,q,occasionOffers(allOptions,q)));
  }
});

test('Une étape annoncée en différé reste asynchrone, y compris en cas de remplacement',()=>{
  const occasion=OC_EDITION.find(o=>o.id==='distance-douce');
  const q={...brief,mode:'remote',energy:'soft',omitOptional:true};
  const formats=occasionOffers(allOptions,q);
  const alternatives=composeOccasion(occasion,q,formats);
  const plan=alternatives.find(p=>p.variantId==='signe-quand-vous-voulez');
  assert.ok(plan && plan.steps.length===1);
  const selected=formats.find(o=>o.id===plan.steps[0].id);
  assert.ok(['libre','mixte'].includes(selected.sync),'Un format en direct ne peut pas assurer un échange en différé.');
  const liveOnly=formats.filter(o=>o.id==='moment-hommage');
  assert.equal(liveOnly.length,1);
  expectImpossible(composeOccasion(occasion,q,liveOnly));
});

test('Un repas partagé entre deux villes garde un poste à chiffrer dans chaque devise',()=>{
  const occasion=OC_EDITION.find(o=>o.id==='distance-douce');
  const q={...brief,mode:'remote',energy:'soft',omitOptional:true};
  const plans=composeOccasion(occasion,q,occasionOffers(allOptions,q));
  const meal=plans.find(p=>p.variantId==='pause-ensemble');
  assert.ok(meal && meal.steps.length===1);
  assert.equal(meal.status,'verify');
  assert.equal(meal.unknownCosts,2);
  assert.equal(meal.steps[0].costs.XOF,null);assert.equal(meal.steps[0].costs.XAF,null);
  const same={...q,partnerCity:q.city};
  const domestic=composeOccasion(occasion,same,occasionOffers(allOptions,same)).find(p=>p.variantId==='pause-ensemble');
  assert.equal(domestic.unknownCosts,1);
});

test('Une fiche abondamment renseignée et favorable passe avant une fiche inconnue',()=>{
  const known=offer('balade-courte-documentee','culture');
  const missing=offer('aucune-description','culture',{axes:{}});
  const people=[{weights:{assise:1,calme:1,effort:1}},{weights:{simple:1,flex:1}}];
  const plan=requirePlan(evaluate([stage('Visiter','culture')],[missing,known],{people}));
  assert.equal(plan.steps[0].id,known.id);
  const onlyMissing=requirePlan(evaluate([stage('Visiter','culture')],[missing],{people}));
  assert.equal(onlyMissing.status,'verify');assert.ok(onlyMissing.warnings.some(Boolean));
});


test('Le catalogue et les formats des deux villes conservent 24 axes expliqués',()=>{
  const q={...brief,mode:'remote'},all=occasionOffers(allOptions,q);
  assert.equal(all.length,102);
  for(const o of all){
    assert.equal(Object.keys(o.axes).length,24);
    for(const [axis,trait] of Object.entries(o.axes)){
      assert.ok(['source','deduit','inconnu','na'].includes(trait.kind),o.id+' '+axis);
      assert.ok(trait.why,o.id+' '+axis+' sans provenance');
    }
  }
});

test('Changer le seul goût du partenaire modifie la première étape du rendez-vous',()=>{
  const q={...brief,day:'2026-11-28',mode:'remote',endMin:1000},all=occasionOffers(allOptions,q);
  const chosen=axis=>composeOccasion(OC_EDITION.find(o=>o.id==='date-a-deux'),
    {...q,people:[{weights:{}},{weights:{[axis]:1}}]},all).find(v=>v.variantId==='faire-puis-parler').steps[0].id;
  assert.equal(chosen('creation'),'maison-dessin');
  assert.equal(chosen('jeu'),'maison-jeu');
});

console.log(cases.length+' contrôles du compositeur réussis.');
