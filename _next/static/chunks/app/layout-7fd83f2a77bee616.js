(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{6799:function(e,t,r){Promise.resolve().then(r.bind(r,4873)),Promise.resolve().then(r.t.bind(r,8313,23)),Promise.resolve().then(r.t.bind(r,7960,23))},1088:function(e,t,r){"use strict";r.d(t,{C:function(){return i},O:function(){return c}});var o=r(7437),a=r(2265),n=r(4963);let l={startColor:"#F0E6FA",endColor:"#E0F2FE"},s=(0,a.createContext)({isLoggedIn:!1,userEmail:null,lastSync:null,isLoading:!1,autoSync:!0,preferences:l,login:async()=>{},logout:()=>{},syncTodos:async()=>[],updatePreferences:async()=>{},setAutoSync:()=>{},handleLoginSuccess:()=>{}});function c(e){let{children:t}=e,[r,c]=(0,a.useState)(!1),[i,u]=(0,a.useState)(null),[S,f]=(0,a.useState)(null),[d,g]=(0,a.useState)(!1),[y,m]=(0,a.useState)(null),[h,p]=(0,a.useState)(!0),[w,k]=(0,a.useState)(l);(0,a.useEffect)(()=>{let e=localStorage.getItem("token"),t=localStorage.getItem("userEmail"),r=localStorage.getItem("lastSync"),o=localStorage.getItem("autoSync"),a=localStorage.getItem("preferences");e&&t&&(m(e),u(t),c(!0),r&&f(new Date(r)),a&&k(JSON.parse(a))),null!==o&&p("true"===o)},[]);let I=(0,a.useCallback)(e=>{m(e),c(!0)},[]),C=(0,a.useCallback)(()=>{m(null),u(null),f(null),c(!1),k(l),localStorage.removeItem("token"),localStorage.removeItem("userEmail"),localStorage.removeItem("lastSync"),localStorage.removeItem("preferences")},[]),_=(0,a.useCallback)(async e=>{g(!0);try{let t=await fetch("".concat(n.C,"/auth"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,preferences:w})});if(!t.ok)throw Error("登录失败");let r=await t.json();m(r.token),u(r.user.email),f(new Date(r.user.lastSync));let o=r.user.preferences||w;k(o),c(!0),localStorage.setItem("token",r.token),localStorage.setItem("userEmail",r.user.email),localStorage.setItem("lastSync",r.user.lastSync),localStorage.setItem("preferences",JSON.stringify(o))}catch(e){throw console.error("Login error:",e),e}finally{g(!1)}},[w]),b=(0,a.useCallback)(async e=>{if(!y||!r){k(e),localStorage.setItem("preferences",JSON.stringify(e));return}g(!0);try{let t=await fetch("".concat(n.C,"/preferences"),{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(y)},body:JSON.stringify({preferences:e})});if(!t.ok)throw Error("更新偏好设置失败");let r=(await t.json()).preferences||e;k(r),localStorage.setItem("preferences",JSON.stringify(r))}catch(t){throw console.error("Update preferences error:",t),k(e),localStorage.setItem("preferences",JSON.stringify(e)),t}finally{g(!1)}},[y,r]),E=(0,a.useCallback)(async e=>{if(!y||!r)return e;g(!0);try{if(0===e.length){let e=await fetch("".concat(n.C,"/todos"),{headers:{Authorization:"Bearer ".concat(y),"Content-Type":"application/json"}});if(!e.ok)throw Error("获取云端数据失败");let t=await e.json();return f(new Date),localStorage.setItem("lastSync",new Date().toISOString()),t.todos}{let t=await fetch("".concat(n.C,"/todos"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(y)},body:JSON.stringify({todos:e})});if(!t.ok){let e=await t.json().catch(()=>({}));throw Error(e.details||"同步失败")}return f(new Date),localStorage.setItem("lastSync",new Date().toISOString()),e}}catch(e){throw console.error("Sync error:",e instanceof Error?e.message:e),e instanceof Error&&e.stack&&console.error("Stack trace:",e.stack),e}finally{g(!1)}},[y,r]);return(0,o.jsx)(s.Provider,{value:{isLoggedIn:r,userEmail:i,lastSync:S,isLoading:d,preferences:w,login:_,logout:C,syncTodos:E,updatePreferences:b,autoSync:h,setAutoSync:e=>{p(e),localStorage.setItem("autoSync",String(e))},handleLoginSuccess:I},children:t})}let i=()=>(0,a.useContext)(s)},4873:function(e,t,r){"use strict";r.d(t,{Providers:function(){return n}});var o=r(7437),a=r(1088);function n(e){let{children:t}=e;return(0,o.jsx)(a.O,{children:t})}},4963:function(e,t,r){"use strict";r.d(t,{C:function(){return o}});let o=(window.location.hostname.includes("github.io"),"https://colorful-todo-list-kappa.vercel.app/api")},7960:function(){},8313:function(e){e.exports={style:{fontFamily:"'__GeistSans_ded60d', '__GeistSans_Fallback_ded60d'"},className:"__className_ded60d",variable:"__variable_ded60d"}}},function(e){e.O(0,[630,971,117,744],function(){return e(e.s=6799)}),_N_E=e.O()}]);