const keys=['comunicados','beneficios','cursos','agenda','autoridades'];
function validate(d){if(!d||!d.config||Array.isArray(d.config))throw Error('Configuración inválida');
const fields=['gremial','nombre','titulo','descripcion','conduccion','color','whatsapp','direccion','horarios','email','dominio','afiliacion','stream','instagram','x'];
for(const k of fields)if(typeof d.config[k]!=='string'||d.config[k].length>2000)throw Error('Campo inválido: '+k);
if(!/^#[0-9a-f]{6}$/i.test(d.config.color))throw Error('Color inválido');
if(d.config.whatsapp&&!/^\d{10,15}$/.test(d.config.whatsapp))throw Error('WhatsApp: solo números, con código de país');
for(const k of ['afiliacion','stream','instagram','x'])if(d.config[k]&&new URL(d.config[k]).protocol!=='https:')throw Error('Los enlaces deben usar HTTPS');
for(const k of keys){if(!Array.isArray(d[k])||d[k].length>200)throw Error('Sección inválida: '+k);for(const x of d[k]){if(typeof x.id!=='string'||x.id.length>100||typeof x.titulo!=='string'||!x.titulo.trim()||x.titulo.length>240||typeof x.texto!=='string'||x.texto.length>6000||typeof x.url!=='string'||x.url.length>2000)throw Error('Publicación inválida');if(x.url&&new URL(x.url).protocol!=='https:')throw Error('Enlace inválido')}}
return {config:Object.fromEntries(fields.map(k=>[k,d.config[k]])),...Object.fromEntries(keys.map(k=>[k,d[k].map(({id,titulo,texto,url})=>({id,titulo,texto,url}))]))};}
export async function onRequest({env,request}){
const reply=(d,status=200)=>Response.json(d,{status,headers:{'Cache-Control':'no-store'}});
if(!env.ADMIN_TOKEN||!env.UADAV_CONTENT)return reply({error:'Configurá ADMIN_TOKEN y UADAV_CONTENT en Cloudflare.'},503);
const provided=request.headers.get('Authorization')||'';
const encoder=new TextEncoder();const hash=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(s)));const a=await hash(provided),b=await hash('Bearer '+env.ADMIN_TOKEN);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];if(diff)return reply({error:'Acceso denegado'},401);
if(request.method==='GET'){const raw=await env.UADAV_CONTENT.get('site-state');const state=raw?JSON.parse(raw):null;const content=state?state.content:await(await env.ASSETS.fetch(new URL('/assets/content.json',request.url))).json();return reply({content,revision:state?.revision??null})}
if(request.method!=='PUT')return reply({error:'Método no permitido'},405);
const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Origen no permitido'},403);
try{const text=await request.text();if(text.length>1000000)return reply({error:'Respaldo demasiado grande'},413);const body=JSON.parse(text);const stored=await env.UADAV_CONTENT.get('site-state','json');const old=stored?.revision??null;if((body.revision??null)!==old)return reply({error:'El contenido cambió. Exportá tu borrador y volvé a conectar para revisar la versión vigente.'},409);const content=validate(body.content),revision=crypto.randomUUID();await env.UADAV_CONTENT.put('site-state',JSON.stringify({content,revision}));return reply({ok:true,revision})}catch(e){return reply({error:e.message||'Datos inválidos'},400)}
}