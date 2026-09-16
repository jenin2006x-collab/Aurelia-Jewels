(function(){
  const USER='aurelia_user_v3',TOKEN='aurelia_api_token';
  const cacheUser=u=>{if(u)localStorage.setItem(USER,JSON.stringify(u));else localStorage.removeItem(USER);return u};
  function getUser(){try{return JSON.parse(localStorage.getItem(USER)||'null')}catch{return null}}
  async function hydrate(){if(!localStorage.getItem(TOKEN))return getUser();try{const r=await AureliaAPI.get('/auth/me');return cacheUser(r.user)}catch{localStorage.removeItem(TOKEN);cacheUser(null);return null}}
  window.Auth={
    getUser,isLoggedIn:()=>!!getUser()&&!!localStorage.getItem(TOKEN),
    async login(email,password){const r=await AureliaAPI.post('/auth/login',{email,password});localStorage.setItem(TOKEN,r.token);cacheUser(r.user);return {success:true,message:'Welcome back, '+r.user.name+'!',user:r.user}},
    async register(nameOrData,email,phone,password){const d=typeof nameOrData==='object'?nameOrData:{name:nameOrData,email,phone,password};const r=await AureliaAPI.post('/auth/register',d);localStorage.setItem(TOKEN,r.token);cacheUser(r.user);return {success:true,message:'Account created successfully!',user:r.user}},
    logout(){localStorage.removeItem(TOKEN);cacheUser(null);localStorage.removeItem('aurelia_cart_v2');location.href='index.html'},
    async update(data){const r=await AureliaAPI.put('/auth/me',data);cacheUser(r.user);return {success:true,message:'Profile updated successfully.',user:r.user}},
    async updateProfile(data){return this.update(data)},
    async getAddresses(){try{const r=await AureliaAPI.get('/addresses');localStorage.setItem('aurelia_addresses_cache',JSON.stringify(r.addresses));return r.addresses}catch{try{return JSON.parse(localStorage.getItem('aurelia_addresses_cache')||'[]')}catch{return []}}},
    async saveAddress(addr){const r=await AureliaAPI.post('/addresses',addr);localStorage.setItem('aurelia_addresses_cache',JSON.stringify(r.addresses));return r.addresses},
    async deleteAddress(id){const r=await AureliaAPI.del('/addresses/'+encodeURIComponent(id));localStorage.setItem('aurelia_addresses_cache',JSON.stringify(r.addresses));return r.addresses},
    async setDefault(id){return this.getAddresses()}
  };
  window.Auth.hydrate=hydrate;
})();
