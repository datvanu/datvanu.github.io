(function(root){
function ibanValid(iban){const s=iban.replace(/\s+/g,'').toUpperCase();if(!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s))return false;
 const r=(s.slice(4)+s.slice(0,4)).replace(/[A-Z]/g,c=>c.charCodeAt(0)-55);let m=0;for(const d of r)m=(m*10+ +d)%97;return m===1}
function epcPayload({name,iban,bic='',amount,text=''}){
 iban=iban.replace(/\s+/g,'').toUpperCase();if(!ibanValid(iban))throw new Error('IBAN ungültig: '+iban);
 if(!name||name.length>70)throw new Error('Name fehlt/zu lang');
 const a=amount===''||amount==null?'':Number(String(amount).replace(',','.'));
 if(a!==''&&(!(a>=0.01)||a>999999999.99))throw new Error('Betrag ungültig');
 if(text.length>140)throw new Error('Verwendungszweck > 140 Zeichen');
 const p=['BCD','002','1','SCT',bic,name,iban,a===''?'':'EUR'+a.toFixed(2),'','',text].join('\n');
 if(new TextEncoder().encode(p).length>331)throw new Error('Payload > 331 Bytes');return p}
function parseCsv(txt){const lines=txt.trim().split(/\r?\n/);const sep=lines[0].includes(';')?';':',';
 const head=lines[0].split(sep).map(h=>h.trim().toLowerCase());return lines.slice(1).filter(l=>l.trim()).map(l=>{const c=l.split(sep);const o={};head.forEach((h,i)=>o[h]=(c[i]||'').trim());return o})}
function fillTemplate(t,row){return t.replace(/\{(\w+)\}/g,(_,k)=>row[k.toLowerCase()]??'')}
const api={ibanValid,epcPayload,parseCsv,fillTemplate};if(typeof module!=='undefined')module.exports=api;else root.EPC=api})(this);
