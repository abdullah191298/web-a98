const t=document.querySelector(".tabs"),a=t&&t.querySelector('.tab[aria-current="page"]');
if(t&&a&&t.scrollWidth>t.clientWidth)a.scrollIntoView({block:"nearest",inline:"center"});
const c=document.querySelector(".copy-status");let l;
function s(m,e=!1){if(!c)return;clearTimeout(l);c.textContent=m;c.classList.toggle("error",e);l=setTimeout(()=>{c.textContent="";c.classList.remove("error")},4e3)}
async function cp(v){if(navigator.clipboard&&window.isSecureContext)try{await navigator.clipboard.writeText(v);return!0}catch{}const x=document.createElement("textarea");x.value=v;x.setAttribute("readonly","");x.style.position="fixed";x.style.top="0";x.style.opacity="0";document.body.appendChild(x);x.select();x.setSelectionRange(0,x.value.length);let o=!1;try{o=document.execCommand("copy")}finally{x.remove()}return o}
let p="en";
const he=document.documentElement;
function updateUI(k){
  try{
    p=k;
    he.setAttribute("lang",k);
    he.setAttribute("dir",k==="ar"?"rtl":"ltr");
    document.querySelectorAll("[data-key]").forEach(el=>{
      const key=el.getAttribute("data-key");
      const val=translations[k]&&translations[k][key];
      if(val){
        if(el.tagName==="INPUT"||el.tagName==="TEXTAREA")el.placeholder=val;
        else if(/<[a-z][\s\S]*>/i.test(val))el.innerHTML=val;
        else el.textContent=val;
      }
    });
    document.querySelectorAll(".lang-btn").forEach(btn=>{
      const isActive=btn.dataset.lang===k;
      btn.setAttribute("aria-pressed",isActive);
      btn.classList.toggle("active",isActive);
      btn.textContent=translations[k]&&translations[k][`lang_${btn.dataset.lang}`]?translations[k][`lang_${btn.dataset.lang}`]:btn.dataset.lang.toUpperCase();
    });
    localStorage.setItem("site-lang",k);
    const titleEl=document.querySelector("title");
    const metaKeys=["description","og:title","og:description","twitter:title","twitter:description"];
    metaKeys.forEach(mk=>{
      const el=document.querySelector(`meta[name="${mk}"],meta[property="${mk}"]`);
      if(el){
        const page=location.pathname.split("/").pop()||"index.html";
        const isTitle=mk==="og:title"||mk==="twitter:title";
        const key=isTitle?`meta_title_${page.replace(".html","")}`:`meta_desc_${page.replace(".html","")}`;
        const val=translations[k]&&translations[k][key];
        if(val){
          if(isTitle&&titleEl)titleEl.textContent=val;
          else el.setAttribute("content",val);
        }
      }
    });
    if(titleEl){
      const page=location.pathname.split("/").pop()||"index.html";
      const val=translations[k]&&translations[k][`meta_title_${page.replace(".html","")}`];
      if(val)titleEl.textContent=val;
    }
  }catch(err){
    console.error("updateUI error:",err);
  }
}
document.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",async()=>{
  try{
    const o=await cp(b.dataset.copy);
    o?s(translations[p]&&translations[p].copy_ok?translations[p].copy_ok:"[ok] تم النسخ إلى الحافظة."):s(translations[p]&&translations[p].copy_err?translations[p].copy_err:"[err] تعذّر النسخ.",!0)
  }catch{}
}));
const f=document.querySelector("#contact-form");
if(f){
  const n=document.querySelector("#contact-name"),m=document.querySelector("#contact-message"),g=document.querySelector("#form-status");
  f.addEventListener("submit",e=>{
    e.preventDefault();
    const r=n.value.trim(),u=m.value.trim();
    g.classList.remove("error");
    if(!r){
      g.textContent=translations[p]&&translations[p].name_required?translations[p].name_required:"اكتب اسمك أولاً.";
      g.classList.add("error");
      n.focus();
      return
    }
    if(!u){
      g.textContent=translations[p]&&translations[p].message_required?translations[p].message_required:"اكتب نص الرسالة.";
      g.classList.add("error");
      m.focus();
      return
    }
    const wm=p==="ar"?translations[p].whatsapp_message_ar:translations[p].whatsapp_message_en;
    const q=wm.replace("${u}",u).replace("${r}",r),z=document.createElement("a");
    z.href=`https://wa.me/201012012544?text=${encodeURIComponent(q)}`;
    z.target="_blank";
    z.rel="noopener noreferrer";
    document.body.appendChild(z);
    z.click();
    z.remove();
    g.textContent=translations[p]&&translations[p].form_status_ok?translations[p].form_status_ok:"[ok] تم فتح واتساب برسالتك.";
    f.reset()
  })
}
const langBtns=document.querySelectorAll(".lang-btn");
if(langBtns.length){
  updateUI(p);
  langBtns.forEach(btn=>btn.addEventListener("click",()=>{
    const n=btn.dataset.lang;
    updateUI(n)
  }))
}
