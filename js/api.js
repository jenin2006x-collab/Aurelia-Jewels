(function(){
  const API_BASE='/api';
  async function request(path,options={}){const opts={...options,headers:{'Content-Type':'application/json',...(options.headers||{})}};const token=localStorage.getItem('aurelia_api_token');if(token)opts.headers.Authorization='Bearer '+token;const r=await fetch(API_BASE+path,opts);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||'Request failed');return d}
  window.AureliaAPI={request,async get(path){return request(path)},async post(path,data){return request(path,{method:'POST',body:JSON.stringify(data)})},async put(path,data){return request(path,{method:'PUT',body:JSON.stringify(data)})},async del(path){return request(path,{method:'DELETE'})},isOnline:()=>navigator.onLine};
})();
