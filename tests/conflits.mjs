import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';

const html = await readFile(new URL('../En-aparte.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const timeSource = scripts.find(code => code.includes('function otherLocal('));
const sheetSource = scripts.find(code => code.includes("const KEY='en-aparte-public-programme-v1'"));
assert.ok(timeSource && sheetSource, 'Modules des horaires et du programme présents');
const store = new Map();
const ctx = createContext({
  localStorage:{ setItem:(key,value) => store.set(key,value) },
  document:{ dispatchEvent(){} },
  Event:class {}
});
ctx.window = ctx;
runInContext(timeSource,ctx);
runInContext(sheetSource,ctx);
const sh = ctx.Sheet;
const host = { innerHTML:'', addEventListener(){} };
sh.render(host);
const row=(id,city,time,duration,changes={},local={})=>({item:{id,name:id,city,currency:city==='Douala'?'XAF':'XOF',costValue:0,...local},opts:{day:'2026-11-21',time,duration,...changes}});
const testResults=[];const eq=(v,x,m)=>{if(v!==x)throw Error(m+': '+JSON.stringify([v,x]));testResults.push(m)};
sh.setContext({day:'2026-11-21'});
const ah=row('Temps réservé','Douala','19:05',20),call=row('Repas en commun','Abidjan','18:00',25,{partnerCity:'Douala',sync:'direct'}),part=row('Part en XAF','Douala','',null),transition=row('Trajet à Douala','Douala','19:08',8);
eq(sh.addPlan([ah]),true,'ajout initial');const preview=sh.conflicts([call,part]);eq(preview.length,1,'une alerte interville avant ajout');eq(preview[0].includes('à Douala'),true,'alerte dans la ville de participation');eq(sh.count(),1,'prévisualisation sans ajout');eq(sh.conflicts([part]).length,0,'ligne budgétaire exclue');
eq(sh.conflicts([row('Seuil exact','Douala','19:25',30)]).length,0,'créneaux adjacents acceptés');eq(sh.conflicts([row('Autre ville','Abidjan','18:15',10)]).length,0,'villes indépendantes');eq(sh.conflicts([row('Message libre','Abidjan','18:00',20,{partnerCity:'Douala',sync:'libre'})]).length,0,'envoi en différé neutre chez le destinataire');
eq(sh.conflicts([transition]).length,1,'plage de trajet incidente');eq(sh.addPlan([call,part]),true,'ajout du repas et de la part');eq(host.innerHTML.includes(preview[0]),true,'même alerte une fois enregistré');
eq(sh.conflicts([call]).length,0,'identité déjà inscrite ignorée');
eq(sh.conflicts([row('Parallèle A','Abidjan','20:00',20,{pair:'p'}),row('Parallèle B','Abidjan','20:00',20,{pair:'p'})]).length,0,'paire liée exclue');
eq(sh.conflicts([row('Début de nuit','Abidjan','23:55',20,{partnerCity:'Douala',sync:'direct'}),row('Après minuit','Douala','01:00',15,{day:'2026-11-22'})]).length,1,'changement de date locale et minuit');
eq(sh.conflicts([row('Réf A','Abidjan','23:55',20,{}, {duplicateGroup:'same'}),row('Réf B','Abidjan','23:55',20,{}, {duplicateGroup:'same'})]).length,0,'références en doublon');
eq(sh.conflicts([row('Jour suivant','Douala','19:05',20,{day:'2026-11-22'})]).length,0,'jours différents');
const saved=JSON.parse(store.get('en-aparte-public-programme-v1'));eq(saved.find(x=>x.id==='Repas en commun').sync,'direct','mode conservé dans la sauvegarde');
console.log(testResults.length+' contrôles des horaires de Mon programme réussis.');
