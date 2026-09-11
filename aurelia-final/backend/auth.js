const crypto=require('crypto');
const SECRET=process.env.AURELIA_SECRET||'aurelia-demo-change-this-secret';
function b64(s){return Buffer.from(s).toString('base64url')}
function token(payload){const body=b64(JSON.stringify(payload));const sig=crypto.createHmac('sha256',SECRET).update(body).digest('base64url');return body+'.'+sig}
function verify(t){try{const [body,sig]=String(t||'').split('.');if(!body||!sig)return null;const expected=crypto.createHmac('sha256',SECRET).update(body).digest('base64url');if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;const p=JSON.parse(Buffer.from(body,'base64url').toString());if(!p.exp||p.exp<Date.now())return null;return p;}catch{return null}}
function issue(user){return token({sub:user.id,role:user.role||'customer',exp:Date.now()+1000*60*60*24*7});}
function bearer(req){const h=req.headers.authorization||'';return h.startsWith('Bearer ')?h.slice(7):null}
module.exports={issue,verify,bearer};
