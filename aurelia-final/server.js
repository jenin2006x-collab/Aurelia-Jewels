const http=require('http');
const fs=require('fs');
const path=require('path');
const {handle}=require('./backend/api');
const {db,save,hashPassword}=require('./backend/db');
const PORT=3000;
const ROOT=__dirname;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp'};
// Seed demo accounts once. Passwords are stored as scrypt hashes, never plaintext.
if(!db.users.some(u=>u.email==='priya@example.com')){const h=hashPassword('demo123');db.users.push({id:'demo-priya',name:'Priya Menon',email:'priya@example.com',phone:'+91 98765 43210',role:'customer',passwordHash:h.hash,passwordSalt:h.salt,createdAt:new Date().toISOString()});save();}
if(!db.users.some(u=>u.email==='admin@aurelia.local')){const h=hashPassword('admin123');db.users.push({id:'demo-admin',name:'Aurelia Admin',email:'admin@aurelia.local',phone:'',role:'admin',passwordHash:h.hash,passwordSalt:h.salt,createdAt:new Date().toISOString()});save();}
const server=http.createServer(async(req,res)=>{
  const pathname=decodeURI(req.url.split('?')[0]);
  if(pathname.startsWith('/api/')){try{const handled=await handle(req,res,pathname);if(!handled&& !res.writableEnded){res.writeHead(404,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'API route not found'}));}}catch(e){console.error(e);if(!res.writableEnded){res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Internal server error'}));}}return;}
  let reqPath=pathname||'/';if(reqPath==='/'||reqPath==='')reqPath='/index.html';if(reqPath==='/admin'||reqPath==='/admin/')reqPath='/admin/index.html';
  let filePath=path.resolve(ROOT,'.'+reqPath);if(!filePath.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  if(!fs.existsSync(filePath)&&fs.existsSync(filePath+'.html')) filePath=filePath+'.html';
  fs.stat(filePath,(err,stats)=>{if(err||!stats.isFile()){const e=path.join(ROOT,'404.html');return fs.readFile(e,(er,d)=>{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(er?'<h1>404 Not Found</h1>':d);});}res.writeHead(200,{'Content-Type':MIME[path.extname(filePath).toLowerCase()]||'application/octet-stream'});fs.createReadStream(filePath).pipe(res);});
});
server.listen(PORT,'0.0.0.0',()=>console.log(`Aurelia Jewels full-stack server: http://0.0.0.0:${PORT}/`));
