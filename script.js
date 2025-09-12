// ===== HELPERS =====
const $ = (q)=>document.querySelector(q); const $$ = (q)=>document.querySelectorAll(q);

// ===== YEAR =====
$("#year").textContent = new Date().getFullYear();

// ===== LOADER =====
window.addEventListener("load", ()=>{ $("#loader").classList.add("hidden"); });

// ===== MOBILE NAV =====
const navToggle = $(".nav-toggle"); const nav = $(".nav");
navToggle.addEventListener("click", ()=>{ const isOpen = nav.style.display === "flex"; nav.style.display = isOpen ? "none" : "flex"; });

// ===== THEMES =====
const root = document.documentElement; const themeToggle = $("#themeToggle"); const contrastToggle = $("#contrastToggle");
const savedTheme = localStorage.getItem("theme"); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if(savedTheme==="dark" || (!savedTheme && prefersDark)) root.classList.add("theme-dark");
if(savedTheme==="contrast") root.classList.add("theme-contrast");
themeToggle.textContent = root.classList.contains("theme-dark") ? "☀️" : "🌙";
themeToggle.addEventListener("click", ()=>{ root.classList.toggle("theme-dark"); root.classList.remove("theme-contrast"); const mode = root.classList.contains("theme-dark") ? "dark" : "light"; localStorage.setItem("theme", mode); themeToggle.textContent = mode==="dark" ? "☀️" : "🌙"; });
contrastToggle.addEventListener("click", ()=>{ root.classList.toggle("theme-contrast"); root.classList.remove("theme-dark"); localStorage.setItem("theme", root.classList.contains("theme-contrast") ? "contrast" : "light"); });

// ===== SCROLL BAR =====
const bar = $("#scrollbar"); window.addEventListener("scroll", ()=>{ const t=window.scrollY; const h=document.body.scrollHeight-window.innerHeight; const p=Math.max(0,Math.min(1,t/h)); bar.style.width=(p*100)+"%"; });

// ===== REVEAL =====
const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); } }); }, {threshold:0.15});
$$(".reveal, .stagger-parent").forEach(el=>io.observe(el));

// ===== PARTICLES =====
const canvas = $("#particles"); const ctx = canvas.getContext("2d"); let W,H,particles,mouse;
function resize(){ const r=canvas.getBoundingClientRect(); W=canvas.width=r.width; H=canvas.height=r.height; }
window.addEventListener("resize", resize); resize();
function rand(a,b){ return Math.random()*(b-a)+a; }
function make(n){ const arr=[]; for(let i=0;i<n;i++){ arr.push({x:rand(0,W),y:rand(0,H),vx:rand(-0.35,0.35),vy:rand(-0.35,0.35),r:rand(1.6,3.2)});} return arr; }
particles = make(160); mouse={x:0,y:0,active:false};
canvas.addEventListener("mousemove",(e)=>{ const r=canvas.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; mouse.active=true; }); canvas.addEventListener("mouseleave",()=>mouse.active=false);
function step(){ ctx.clearRect(0,0,W,H); for(let i=0;i<particles.length;i++){ const p=particles[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1; if(mouse.active){ const dx=p.x-mouse.x,dy=p.y-mouse.y; const d=Math.hypot(dx,dy); if(d<100){ p.vx+=dx/(d*d)*2; p.vy+=dy/(d*d)*2; } } }
  ctx.fillStyle="rgba(0,179,179,0.9)"; for(const p of particles){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
  ctx.strokeStyle="rgba(0,179,179,0.28)"; for(let i=0;i<particles.length;i++){ const p=particles[i]; for(let j=i+1;j<particles.length;j++){ const q=particles[j]; const dx=p.x-q.x,dy=p.y-q.y; const d2=dx*dx+dy*dy; if(d2<130*130){ const a=1-d2/(130*130); ctx.globalAlpha=a*0.9; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); } } } ctx.globalAlpha=1; requestAnimationFrame(step); }
requestAnimationFrame(step);

// ===== PARALLAX =====
const parallaxTargets = $$(".hero-art, .project-card"); window.addEventListener("scroll", ()=>{ const y=window.scrollY*0.03; parallaxTargets.forEach(el=>el.style.transform=`translateY(${y}px)`); });

// ===== RIPPLE POINTER POS =====
document.addEventListener("pointerdown",(e)=>{ const t=e.target.closest(".btn.ripple"); if(!t) return; const r=t.getBoundingClientRect(); t.style.setProperty("--x",(e.clientX-r.left)+"px"); t.style.setProperty("--y",(e.clientY-r.top)+"px"); });

// ===== CONTACT FORM =====
const FORM_ENDPOINT = "/api/contact"; const PHP_ENDPOINT = "server_php/contact.php"; const USE_PHP = false;
const form = $("#contactForm"); form.addEventListener("submit", async (e)=>{ e.preventDefault(); const payload={ name:$("#name").value.trim(), email:$("#email").value.trim(), message:$("#message").value.trim(), recaptcha_token:$("#recaptcha_token").value };
  if(!payload.name||!payload.email||!payload.message){ toast("Please fill in all fields."); return; }
  try{ const endpoint = USE_PHP ? PHP_ENDPOINT : FORM_ENDPOINT; const res = await fetch(endpoint,{method:"POST",headers:USE_PHP?{}:{"Content-Type":"application/json"},body: USE_PHP ? new URLSearchParams(payload) : JSON.stringify(payload)}); if(!res.ok) throw new Error("Network"); const data = await res.json(); if(data.success){ toast("Thanks! Your message was sent."); form.reset(); } else { toast(data.error||"Could not send."); } }catch(err){ console.error(err); toast("Error sending message."); } });

// ===== COMMENTS (Live) =====
const COMMENTS_API = "/api/comments"; const COMMENTS_PHP = "server_php/comments.php"; const USE_PHP_COMMENTS = false; // Toggle to use PHP
const list = $("#commentsList"); const cform = $("#commentForm");
async function fetchComments(){ try{ const res = await fetch(USE_PHP_COMMENTS?COMMENTS_PHP:COMMENTS_API); if(!res.ok) throw 0; const data = await res.json(); renderComments(data.comments || []); }catch(e){ renderComments([]); } }
function renderComments(items){ list.innerHTML = ""; if(items.length===0){ const empty = document.createElement("p"); empty.className="section-text"; empty.textContent="No comments yet — be the first to write one!"; list.appendChild(empty); return; } items.forEach(addCommentCard); }
function addCommentCard(c){ const card=document.createElement("div"); card.className="comment-card"; card.innerHTML = `<div class="comment-head"><img class="avatar" src="https://i.pravatar.cc/72?u=${encodeURIComponent(c.name||'anon')}" alt="avatar"><div><p class="c-name">${(c.name||'Anonymous')}</p><p class="c-role">${(c.role||'')}</p></div></div><p class="c-text"></p><span class="c-meta"></span>`; card.querySelector(".c-text").textContent = c.text; card.querySelector(".c-meta").textContent = new Date(c.ts||Date.now()).toLocaleString(); list.appendChild(card); }
cform.addEventListener("submit", async (e)=>{ e.preventDefault(); const payload={ name:$("#c_name").value.trim(), role:$("#c_role").value.trim(), text:$("#c_text").value.trim() }; if(!payload.name||!payload.text){ toast("Please write your name and comment."); return; } try{ const res = await fetch(USE_PHP_COMMENTS?COMMENTS_PHP:COMMENTS_API, { method:"POST", headers: USE_PHP_COMMENTS? {} : {"Content-Type":"application/json"}, body: USE_PHP_COMMENTS ? new URLSearchParams(payload) : JSON.stringify(payload) }); if(!res.ok) throw 0; const data = await res.json(); if(data.success){ $("#c_text").value=""; addCommentCard({ ...payload, ts: Date.now() }); toast("Comment added."); } else { toast(data.error||"Could not add comment."); } }catch(err){ toast("Error adding comment."); } });
fetchComments();

// ===== TOAST =====
function toast(t){ let el=document.createElement("div"); el.className="toast"; el.textContent=t; document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add("show")); setTimeout(()=>{ el.classList.remove("show"); setTimeout(()=>el.remove(),300); },2200); }

// ===== A11Y =====
(function(){ function handleFirstTab(e){ if(e.key==="Tab"){ document.documentElement.classList.add("user-is-tabbing"); window.removeEventListener("keydown",handleFirstTab); } } window.addEventListener("keydown",handleFirstTab); })();
