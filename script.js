const SOCIAL_LABELS={facebook:'Facebook',instagram:'Instagram',tiktok:'TikTok',linkedin:'LinkedIn',x:'X',youtube:'YouTube',snapchat:'Snapchat',telegram:'Telegram'};
const defaultState={
  firstName:'Ibrahima',lastName:'Konta',jobTitle:'Fondateur & Directeur',companyName:'YONKO BUSINESS',
  bio:'Agence digitale — web design, branding, formation professionnelle et équipement technologique.',
  phone:'+221771234567',whatsapp:'221771234567',email:'contact@yonkobusiness.sn',
  address:'Thiès, Sénégal',website:'https://yonkobusiness.sn',
  photo:'',
  primary:'#2FBF88',warm:'#E3A857',
  social:[{platform:'linkedin',url:'https://linkedin.com'},{platform:'instagram',url:'https://instagram.com'}],
  links:[{label:'Portfolio',url:'https://yonkobusiness.sn/portfolio'}],
  services:[{title:'Création de sites web',description:'Sites vitrines et plateformes sur mesure.'}]
};
const published=window.PUBLIC_CARD||null;
const IS_PUBLIC=typeof location!=='undefined'&&(/[?&]v=public(&|$)/.test(location.search)||location.hash==='#public');
const isLocal=typeof location!=='undefined'&&/^(file:|https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0))/.test(location.href);
const PUBLIC_URL=!isLocal&&typeof location!=='undefined'?(location.origin+location.pathname):'https://khalilsigner.github.io/Carte-de-visite-digitale/';
const QR_TEXT=PUBLIC_URL?PUBLIC_URL+'?v=public':vcard();
let state=defaultState;
try{
  const saved=JSON.parse(localStorage.getItem('digitalCard')||'null');
  if(saved&&typeof saved==='object')state=Object.assign({},defaultState,published||{},saved);
  else if(published)state=Object.assign({},defaultState,published);
}catch(e){if(published)state=Object.assign({},defaultState,published);}

function initials(){return ((state.firstName||'')[0]||'')+((state.lastName||'')[0]||'')}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function render(){
  try{
  document.documentElement.style.setProperty('--primary',state.primary);
  document.documentElement.style.setProperty('--warm',state.warm);
  const s=state;
  let html=`
  <div class="head">
    <div class="avatar">${s.photo?`<img src="${s.photo}" alt="Photo de profil">`:initials()}</div>
    <h1>${esc(s.firstName)} ${esc(s.lastName)}</h1>
    <div class="role">${esc(s.jobTitle||'')}</div>
    <div class="company">${esc(s.companyName||'')}</div>
    <div class="bio">${esc(s.bio||'')}</div>
  </div>
  <div class="actions">
    ${s.phone?`<a href="tel:${esc(s.phone)}">${icon('phone')}Appeler</a>`:''}
    ${s.whatsapp?`<a href="https://wa.me/${esc(s.whatsapp)}" target="_blank">${icon('whatsapp')}WhatsApp</a>`:''}
    ${s.email?`<a href="mailto:${esc(s.email)}">${icon('mail')}E-mail</a>`:''}
    ${s.address?`<a href="https://maps.google.com/?q=${encodeURIComponent(s.address)}" target="_blank">${icon('map')}Maps</a>`:''}
  </div>
  <button class="save-btn" onclick="downloadVCard()">${icon('user')}Enregistrer le contact</button>`;

  if(s.phone||s.email||s.address||s.website){
    html+=`<div class="section"><h2>Coordonnées</h2>`;
    if(s.phone)html+=row('phone',s.phone);
    if(s.email)html+=row('mail',s.email);
    if(s.address)html+=row('map',s.address);
    if(s.website)html+=`<a class="row" href="${esc(s.website)}" target="_blank">${icon('link')}<span>${esc(s.website)}</span></a>`;
    html+=`</div>`;
  }
  if(Array.isArray(s.social)&&s.social.length){
    html+=`<div class="section"><h2>Réseaux sociaux</h2><div class="socials">`;
    s.social.forEach(x=>html+=`<a href="${esc(x.url)}" target="_blank" title="${esc(SOCIAL_LABELS[x.platform]||x.platform)}">${(SOCIAL_LABELS[x.platform]||x.platform).slice(0,2).toUpperCase()}</a>`);
    html+=`</div></div>`;
  }
  if(Array.isArray(s.services)&&s.services.length){
    html+=`<div class="section"><h2>Services</h2>`;
    s.services.forEach(x=>html+=`<div class="service"><h3>${esc(x.title)}</h3>${x.description?`<p>${esc(x.description)}</p>`:''}</div>`);
    html+=`</div>`;
  }
  if(Array.isArray(s.links)&&s.links.length){
    html+=`<div class="section"><h2>Liens</h2>`;
    s.links.forEach(x=>html+=`<a class="row" href="${esc(x.url)}" target="_blank">${icon('link')}<span>${esc(x.label)}</span></a>`);
    html+=`</div>`;
  }
  if(!IS_PUBLIC){
    html+=`<div class="section"><h2>QR Code</h2><div class="qr-box"><div id="qrcode"></div>
      <p class="qr-hint">Scannez pour retrouver ma carte</p>
      <div class="qr-actions"><button class="ghost-btn" onclick="downloadQR()">Télécharger</button>
      <button class="ghost-btn" onclick="shareCard()">Partager</button></div></div></div>`;
  }

  document.getElementById('publicView').innerHTML=html;
  if(!IS_PUBLIC){
    const qrEl=document.getElementById('qrcode');
    try{
      qrEl.innerHTML='';
      if(typeof QRCode==='undefined'){qrEl.textContent='QR Code indisponible (librairie non chargée)';return;}
      new QRCode(qrEl,{text:QR_TEXT,width:200,height:200,colorDark:'#0B1210',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
    }catch(err){qrEl.textContent='QR Code indisponible: '+esc(err&&err.message||err);}
  }
  }catch(err){
    console.error(err);
    document.getElementById('publicView').innerHTML=`<div class="head" style="text-align:center;padding-top:24px"><h1>Erreur d'affichage</h1><p style="color:var(--muted)">${esc(err&&err.message||err)}</p></div>`;
  }
}
function row(type,text){return `<div class="row">${icon(type)}<span>${esc(text)}</span></div>`}
function icon(name){
  const p={
    phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/>',
    whatsapp:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    mail:'<path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/>',
    map:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p[name]||''}</svg>`;
}

function vcard(){
  const s=state;
  const escV=v=>String(v||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
  const phoneNum=(s.phone||'').replace(/[^0-9]/g,'');
  const waNum=(s.whatsapp||'').replace(/[^0-9]/g,'');
  const lines=['BEGIN:VCARD','VERSION:3.0',`N:${escV(s.lastName)};${escV(s.firstName)};;;`,`FN:${escV(s.firstName)} ${escV(s.lastName)}`];
  if(s.jobTitle)lines.push(`TITLE:${escV(s.jobTitle)}`);
  if(s.companyName)lines.push(`ORG:${escV(s.companyName)}`);
  if(phoneNum)lines.push(`TEL;TYPE=CELL;TYPE=VOICE:${(s.phone||'').replace(/[^0-9+]/g,'')}`);
  if(waNum&&waNum!==phoneNum)lines.push(`TEL;TYPE=CELL;TYPE=VOICE:+${waNum}`);
  if(s.email)lines.push(`EMAIL:${String(s.email).trim()}`);
  if(s.address)lines.push(`ADR;TYPE=HOME:;;${escV(s.address)};;;;`);
  if(s.website)lines.push(`URL:${String(s.website).trim()}`);
  if(s.bio)lines.push(`NOTE:${escV(s.bio)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
async function downloadVCard(){
  const data=vcard();
  const dl=await getDownloads();
  if(dl){try{await dl.save({filename:`${state.firstName}-${state.lastName}.vcf`,data});return}catch(e){}}
  const blob=new Blob([data],{type:'text/vcard'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${state.firstName}-${state.lastName}.vcf`;a.click();
}
async function downloadQR(){
  const canvas=document.querySelector('#qrcode canvas');
  if(!canvas)return;
  const dataUrl=canvas.toDataURL('image/png');
  const dl=await getDownloads();
  if(dl){try{await dl.save({filename:'qrcode.png',data:dataUrl});return}catch(e){}}
  const a=document.createElement('a');a.href=dataUrl;a.download='qrcode.png';a.click();
}
let _downloads;
async function getDownloads(){
  if(_downloads!==undefined)return _downloads;
  try{_downloads=window.claude?await window.claude.use('downloads'):null;}catch(e){_downloads=null;}
  return _downloads;
}
function shareCard(){
  const url=QR_TEXT||location.href;
  if(navigator.share){navigator.share({title:`${state.firstName} ${state.lastName}`,url}).catch(()=>{});}
  else{navigator.clipboard.writeText(url);alert('Lien copié.');}
}

// Editor
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');document.getElementById('pane-'+t.dataset.tab).classList.add('active');
}));
function openEditor(){
  ['firstName','lastName','jobTitle','companyName','bio','phone','whatsapp','email','address','website'].forEach(k=>document.getElementById('f-'+k).value=state[k]||'');
  document.getElementById('f-primary').value=state.primary;
  document.getElementById('f-warm').value=state.warm;
  document.getElementById('f-photo').value='';
  photoDraft=state.photo||'';
  updatePhotoPreview();
  renderSocialEditor();renderLinkEditor();renderServiceEditor();
  document.getElementById('editor').classList.add('open');
}
function closeEditor(){document.getElementById('editor').classList.remove('open')}

// Photo de profil
let photoDraft='';
function updatePhotoPreview(){
  const pv=document.getElementById('photoPreview');
  pv.innerHTML=photoDraft?`<img src="${photoDraft}" alt="Aperçu">`:`<span>${initials()}</span>`;
  document.getElementById('photoRemove').style.display=photoDraft?'':'none';
}
function pickPhoto(input){
  const file=input.files&&input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      const max=512;
      let w=img.width,h=img.height;
      if(w>h&&w>max){h=Math.round(h*max/w);w=max;}
      else if(h>max){w=Math.round(w*max/h);h=max;}
      const c=document.createElement('canvas');c.width=w;c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      photoDraft=c.toDataURL('image/jpeg',0.85);
      updatePhotoPreview();
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}
function removePhoto(){photoDraft='';document.getElementById('f-photo').value='';updatePhotoPreview();}

function renderSocialEditor(){
  document.getElementById('socialList').innerHTML=state.social.map((x,i)=>`
    <div class="list-item">
      <input value="${esc(x.platform)}" placeholder="plateforme (ex: instagram)" onchange="state.social[${i}].platform=this.value">
      <input value="${esc(x.url)}" placeholder="URL" onchange="state.social[${i}].url=this.value">
      <button class="rm" onclick="state.social.splice(${i},1);renderSocialEditor()">×</button>
    </div>`).join('');
}
function addSocial(){state.social.push({platform:'',url:''});renderSocialEditor()}
function renderLinkEditor(){
  document.getElementById('linkList').innerHTML=state.links.map((x,i)=>`
    <div class="list-item">
      <input value="${esc(x.label)}" placeholder="Nom du lien" onchange="state.links[${i}].label=this.value">
      <input value="${esc(x.url)}" placeholder="URL" onchange="state.links[${i}].url=this.value">
      <button class="rm" onclick="state.links.splice(${i},1);renderLinkEditor()">×</button>
    </div>`).join('');
}
function addLink(){state.links.push({label:'',url:''});renderLinkEditor()}
function renderServiceEditor(){
  document.getElementById('serviceList').innerHTML=state.services.map((x,i)=>`
    <div class="list-item">
      <input value="${esc(x.title)}" placeholder="Titre" onchange="state.services[${i}].title=this.value">
      <input value="${esc(x.description||'')}" placeholder="Description" onchange="state.services[${i}].description=this.value">
      <button class="rm" onclick="state.services.splice(${i},1);renderServiceEditor()">×</button>
    </div>`).join('');
}
function addService(){state.services.push({title:'',description:''});renderServiceEditor()}

function collectState(){
  ['firstName','lastName','jobTitle','companyName','bio','phone','whatsapp','email','address','website'].forEach(k=>state[k]=document.getElementById('f-'+k).value);
  state.primary=document.getElementById('f-primary').value;
  state.warm=document.getElementById('f-warm').value;
  state.photo=photoDraft;
}
function saveCard(){
  collectState();
  try{localStorage.setItem('digitalCard',JSON.stringify(state));}catch(e){}
  closeEditor();render();
  if(!IS_PUBLIC){const h=document.getElementById('publishHint');if(h)h.style.display='flex';}
}
function exportCardData(){
  collectState();
  const js='// Carte de visite digitale — données publiques\n// Remplacez le contenu de card-data.js par ce fichier, puis republiez le site (git push).\nwindow.PUBLIC_CARD='+JSON.stringify(state,null,2)+';\n';
  const blob=new Blob([js],{type:'application/javascript;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='card-data.js';a.click();
}
// Mode public (page scannée) : masquer le bouton édition
if(IS_PUBLIC){const f=document.getElementById('fab');if(f)f.style.display='none';}
render();