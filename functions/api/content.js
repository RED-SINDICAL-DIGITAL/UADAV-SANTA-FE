export async function onRequestGet({env,request}){
const state=env.UADAV_CONTENT?await env.UADAV_CONTENT.get('site-state','json'):null;let data=state?.content;
if(!data){const response=await env.ASSETS.fetch(new URL('/assets/content.json',request.url));data=await response.json()}
return Response.json(data,{headers:{'Cache-Control':'no-store'}});
}