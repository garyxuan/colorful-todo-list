(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{9542:function(e,t,o){Promise.resolve().then(o.bind(o,1088)),Promise.resolve().then(o.t.bind(o,3608,23)),Promise.resolve().then(o.t.bind(o,7960,23))},1088:function(e,t,o){"use strict";o.d(t,{C:function(){return i},SyncProvider:function(){return c}});var r=o(7437),a=o(2265),n=o(4963);let l={startColor:"#F0E6FA",endColor:"#E0F2FE"},s=(0,a.createContext)({isLoggedIn:!1,userEmail:null,lastSync:null,isLoading:!1,autoSync:!0,preferences:l,login:async()=>{},logout:()=>{},syncTodos:async()=>[],updatePreferences:async()=>{},setAutoSync:()=>{},handleLoginSuccess:()=>{}});function c(e){let{children:t}=e,o=(0,n.h)(),[c,i]=(0,a.useState)(!1),[u,f]=(0,a.useState)(null),[S,m]=(0,a.useState)(null),[p,d]=(0,a.useState)(!1),[g,y]=(0,a.useState)(null),[h,w]=(0,a.useState)(!0),[I,k]=(0,a.useState)(l);(0,a.useEffect)(()=>{let e=localStorage.getItem("token"),t=localStorage.getItem("userEmail"),o=localStorage.getItem("lastSync"),r=localStorage.getItem("autoSync"),a=localStorage.getItem("preferences");e&&t&&(y(e),f(t),i(!0),o&&m(new Date(o)),a&&k(JSON.parse(a))),null!==r&&w("true"===r)},[]);let b=(0,a.useCallback)(()=>{y(null),f(null),m(null),i(!1),k(l),localStorage.removeItem("token"),localStorage.removeItem("userEmail"),localStorage.removeItem("lastSync"),localStorage.removeItem("preferences")},[]),v=(0,a.useCallback)(async e=>{try{localStorage.setItem("token",e),y(e);let t=await fetch("".concat(o,"/auth/me"),{headers:{Authorization:"Bearer ".concat(e),"Content-Type":"application/json"}});if(!t.ok)throw Error("获取用户信息失败");let r=await t.json();f(r.email),m(new Date(r.lastSync)),k(r.preferences||l),i(!0),localStorage.setItem("userEmail",r.email),localStorage.setItem("lastSync",r.lastSync),localStorage.setItem("preferences",JSON.stringify(r.preferences||l))}catch(e){throw console.error("Login error:",e),b(),e}},[b,o]),E=(0,a.useCallback)(()=>{b()},[b]),C=(0,a.useCallback)(async e=>{d(!0);try{let t=await fetch("".concat(o,"/auth"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,preferences:I})});if(!t.ok)throw Error("登录失败");let r=await t.json();y(r.token),f(r.user.email),m(new Date(r.user.lastSync));let a=r.user.preferences||I;k(a),i(!0),localStorage.setItem("token",r.token),localStorage.setItem("userEmail",r.user.email),localStorage.setItem("lastSync",r.user.lastSync),localStorage.setItem("preferences",JSON.stringify(a))}catch(e){throw console.error("Login error:",e),e}finally{d(!1)}},[I,o]),_=(0,a.useCallback)(async e=>{if(!g||!c){k(e),localStorage.setItem("preferences",JSON.stringify(e));return}d(!0);try{let t=await fetch("".concat(o,"/preferences"),{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(g)},body:JSON.stringify({preferences:e})});if(!t.ok)throw Error("更新偏好设置失败");let r=(await t.json()).preferences||e;k(r),localStorage.setItem("preferences",JSON.stringify(r))}catch(t){throw console.error("Update preferences error:",t),k(e),localStorage.setItem("preferences",JSON.stringify(e)),t}finally{d(!1)}},[g,c,o]),N=(0,a.useCallback)(async e=>{if(!g||!c)return e;d(!0);try{if(0===e.length){console.log("Fetching todos from server...");let e=await fetch("".concat(o,"/todos"),{headers:{Authorization:"Bearer ".concat(g),"Content-Type":"application/json"}});if(!e.ok)throw Error("获取云端数据失败");let t=await e.json();if(console.log("Received data from server:",t),!t.todos||!Array.isArray(t.todos))throw console.error("Invalid data format from server:",t),Error("服务器返回的数据格式无效");let r=t.todos.map(e=>({id:e.id,text:e.text||"",completed:!!e.completed,color:e.color||"#F0E6FA",order:Number(e.order)||0})).sort((e,t)=>e.order-t.order);return console.log("Processed todos:",r),m(new Date),localStorage.setItem("lastSync",new Date().toISOString()),r}{console.log("Uploading todos to server:",e);let t=await fetch("".concat(o,"/todos"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(g)},body:JSON.stringify({todos:e})});if(!t.ok){let e=await t.json().catch(()=>({}));throw console.error("Upload error:",e),Error(e.details||"同步失败")}let r=await t.json();return console.log("Upload response:",r),m(new Date),localStorage.setItem("lastSync",new Date().toISOString()),e}}catch(e){throw console.error("Sync error:",e),e}finally{d(!1)}},[g,c,o]);return(0,r.jsx)(s.Provider,{value:{isLoggedIn:c,userEmail:u,lastSync:S,isLoading:p,preferences:I,login:C,logout:E,syncTodos:N,updatePreferences:_,autoSync:h,setAutoSync:e=>{w(e),localStorage.setItem("autoSync",String(e))},handleLoginSuccess:v},children:t})}let i=()=>(0,a.useContext)(s)},4963:function(e,t,o){"use strict";o.d(t,{h:function(){return l}});var r=o(2265);let a="https://colorful-todo-list-kappa.vercel.app/api",n=()=>window.location.hostname.includes("github.io")?"https://colorful-todo-list-kappa.vercel.app/api":"localhost"===window.location.hostname||"127.0.0.1"===window.location.hostname?"/api":a,l=()=>{let[e,t]=(0,r.useState)(a);return(0,r.useEffect)(()=>{t(n())},[]),e};n()},7960:function(){},3608:function(e){e.exports={style:{fontFamily:"'__Inter_f41ab8', '__Inter_Fallback_f41ab8'",fontStyle:"normal"},className:"__className_f41ab8"}}},function(e){e.O(0,[26,971,117,744],function(){return e(e.s=9542)}),_N_E=e.O()}]);