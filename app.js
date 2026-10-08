'use strict';
// Personnaliser ces deux constantes AVANT de publier sur GitHub Pages.
const DEFAULT_EMAIL = 'association.divertissement.gn@gmail.com';
const DEFAULT_ACTIVITIES = ['Laestrom'];
const STORAGE_KEY = 'adgn_remboursement_settings_v1';
const $ = id => document.getElementById(id);
let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (_) { saved = {}; }
let activities = Array.isArray(saved.activities) && saved.activities.length ? saved.activities : [...DEFAULT_ACTIVITIES];
let destination = saved.destination || DEFAULT_EMAIL;
let expenseCount = 0, attachmentCount = 0;
const money = new Intl.NumberFormat('fr-CA', {style:'currency',currency:'CAD'});
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function refreshActivities(){
 const old=$('activity').value;
 $('activity').innerHTML = '<option value="">Choisir une activité...</option>' + activities.map(a=>`<option value="${escapeHTML(a)}">${escapeHTML(a)}</option>`).join('');
 if(activities.includes(old)) $('activity').value=old;
 $('activitiesSettings').innerHTML='';
 activities.forEach((a,i)=>{
   const s=document.createElement('span');s.className='chip';s.append(document.createTextNode(a+' '));
   const b=document.createElement('button');b.type='button';b.textContent='×';b.setAttribute('aria-label','Retirer '+a);
   b.addEventListener('click',()=>{if(activities.length===1)return alert('Gardez au moins une activité.');activities.splice(i,1);refreshActivities();});s.append(b);$('activitiesSettings').append(s);
 });
}
function save(){destination=$('destination').value.trim();localStorage.setItem(STORAGE_KEY,JSON.stringify({destination,activities}));$('feedback').textContent='';alert('Configuration enregistrée sur cet appareil.');}
$('settingsToggle').addEventListener('click',()=>{$('settingsPanel').classList.toggle('hidden');});
$('destination').value=destination;
$('addActivity').addEventListener('click',()=>{const v=$('newActivity').value.trim();if(!v)return;if(activities.some(a=>a.toLowerCase()===v.toLowerCase()))return alert('Cette activité existe déjà.');activities.push(v);$('newActivity').value='';refreshActivities();});
$('saveSettings').addEventListener('click',save);
function addExpense(){
 expenseCount++;
 const div=document.createElement('div');div.className='expense';div.innerHTML=`<div class="expenseHead"><strong>Dépense #${expenseCount}</strong><button type="button" class="remove">Retirer</button></div><div class="two"><label>Quoi ? (article ou service) <em>*</em><input class="item" required placeholder="Ex. : chandelles, bois, repas..."></label><label>Où ? (commerce ou fournisseur) <em>*</em><input class="store" required placeholder="Ex. : quincaillerie"></label><label>Quand ? (date de l'achat) <em>*</em><input class="date" type="date" required></label><label>Montant CAD (taxes incluses) <em>*</em><input class="amount" required type="number" min="0.01" step="0.01" placeholder="0.00"></label></div>`;
 div.querySelector('.remove').addEventListener('click',()=>{if($('expenses').children.length===1)return alert('Il faut au moins une dépense.');div.remove();recalculate();});
 div.querySelector('.amount').addEventListener('input',recalculate);
 $('expenses').append(div);recalculate();
}
function recalculate(){let total=0;document.querySelectorAll('.expense .amount').forEach(e=>total+=Math.max(0,Number(e.value)||0));$('total').textContent=money.format(total);return total;}
function addAttachment(){
 attachmentCount++;const box=document.createElement('div');box.className='attachment';
 const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp,application/pdf';input.name='facture_'+attachmentCount;input.setAttribute('aria-label','Facture '+attachmentCount);input.addEventListener('change',checkFiles);
 const btn=document.createElement('button');btn.type='button';btn.textContent='Retirer';btn.addEventListener('click',()=>{box.remove();checkFiles();});box.append(input,btn);$('attachments').append(box);
}
function checkFiles(){const files=[...document.querySelectorAll('.attachment input')].flatMap(e=>[...e.files]);const size=files.reduce((s,f)=>s+f.size,0);const limit=10*1024*1024;$('sizeMessage').textContent=`${files.length} fichier(s) — ${(size/1024/1024).toFixed(2)} Mo sur 10 Mo`; $('sizeMessage').style.color=size>limit?'#af182f':'';return size<=limit;}
$('addExpense').addEventListener('click',addExpense);
$('addAttachment').addEventListener('click',addAttachment);
$('method').addEventListener('change',()=>{$('paymentContact').required=$('method').value==='Virement Interac';});
$('claimForm').addEventListener('submit',ev=>{
 const form=$('claimForm');$('feedback').textContent='';
 if(!navigator.onLine){ev.preventDefault();$('feedback').textContent='Vous êtes hors ligne. Reconnectez-vous avant l’envoi de la demande et des factures.';return;}
 if(!form.checkValidity()){ev.preventDefault();form.reportValidity();return;}
 if(!checkFiles()){ev.preventDefault();$('feedback').textContent='Les fichiers dépassent la limite totale de 10 Mo.';return;}
 if(!$('attachments').querySelector('input[type=file]:not([value=""])') || ![...document.querySelectorAll('.attachment input')].some(i=>i.files.length)){
   ev.preventDefault();$('feedback').textContent='Joignez au moins une preuve d’achat.';return;
 }
 const email=($('destination').value || destination || '').trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ev.preventDefault();$('settingsPanel').classList.remove('hidden');$('feedback').textContent='Configurez d’abord une adresse courriel de destination valide.';window.scrollTo({top:0,behavior:'smooth'});return;}
 const rows=[...document.querySelectorAll('.expense')].map((d,i)=>({item:d.querySelector('.item').value,store:d.querySelector('.store').value,date:d.querySelector('.date').value,amount:Number(d.querySelector('.amount').value)}));
 // Fields added dynamically give the recipient a readable, itemized expense summary.
 form.querySelectorAll('.generated').forEach(e=>e.remove());
 function hidden(name,value){const i=document.createElement('input');i.type='hidden';i.className='generated';i.name=name;i.value=value;form.append(i);}
 rows.forEach((r,i)=>hidden(`Dépense ${i+1}`,`${r.item} | ${r.store} | ${r.date} | ${money.format(r.amount)}`));
 hidden('Total demandé',money.format(recalculate()));
 hidden('Nombre de factures',[...document.querySelectorAll('.attachment input')].filter(i=>i.files.length).length);
 $('emailSubject').value=`ADGN - Remboursement - ${$('activity').value} - ${$('person').value}`;
 form.action='https://formsubmit.co/'+encodeURIComponent(email);
 // Actual delivery is handled by FormSubmit; no success is claimed before submitting.
});
refreshActivities();addExpense();addAttachment();checkFiles();

// Installation PWA : l’invite native existe surtout sur Android/Chrome.
let deferredInstallPrompt;
window.addEventListener('beforeinstallprompt', e => {
 e.preventDefault(); deferredInstallPrompt = e;
 $('installButton').classList.remove('hidden');
});
$('installButton').addEventListener('click', async () => {
 if(!deferredInstallPrompt) return;
 deferredInstallPrompt.prompt();
 await deferredInstallPrompt.userChoice;
 deferredInstallPrompt = null;
 $('installButton').classList.add('hidden');
});
window.addEventListener('appinstalled', () => $('installButton').classList.add('hidden'));
if('serviceWorker' in navigator){window.addEventListener('load', () => {
 navigator.serviceWorker.register('./sw.js').catch(err => console.warn('Mode hors ligne indisponible :', err));
});}
