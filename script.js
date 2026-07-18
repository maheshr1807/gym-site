/* ============================================================
   FORGE — shared front-end logic
   ============================================================ */

/* ---------- WhatsApp config (edit number/message here once) ---------- */
const WA_NUMBER = "919876543210"; // country code + number, no + or spaces
const WA_MESSAGE = "Hi FORGE! I'd like to know more about membership.";

function injectWhatsApp(){
  if(document.querySelector('.wa-float')) return;
  const a = document.createElement('a');
  a.className = 'wa-float';
  a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label','Chat with us on WhatsApp');
  a.innerHTML = '<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.4.6 4.6 1.8 6.6L3 29l6.9-1.8c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.7 12.7-12.7C28.7 8.7 23 3 16 3Z" fill="#08351c"/><path d="M23 19.3c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2s-1 1.1-1.2 1.3-.4.3-.8.1a9 9 0 0 1-4.5-3.9c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 3s1.3 3.4 1.4 3.7c.2.2 2.5 3.9 6.1 5.3.9.4 1.5.6 2.1.7.9.3 1.7.2 2.3.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4Z" fill="#0d4d26"/></svg>';
  document.body.appendChild(a);
}

/* ---------- Nav: scroll shadow + mobile burger ---------- */
function initNav(){
  const nav = document.querySelector('.nav');
  if(!nav) return;
  const burger = nav.querySelector('.nav-burger');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  });
  if(burger){
    burger.addEventListener('click', () => nav.classList.toggle('is-open'));
  }
}

/* ---------- Scroll reveal ---------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{ threshold:0.15 });
  items.forEach(i=>io.observe(i));
}

/* ---------- Animated counters ---------- */
function initCounters(){
  const nums = document.querySelectorAll('[data-count]');
  if(!nums.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count,10);
      const dur = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1,(now-start)/dur);
        const eased = 1 - Math.pow(1-p,3);
        el.textContent = Math.round(target*eased).toLocaleString('en-IN');
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  },{threshold:0.5});
  nums.forEach(n=>io.observe(n));
}

/* ---------- Generic tab filter (gallery / programs / blog) ---------- */
function initFilterTabs(){
  document.querySelectorAll('[data-filter-group]').forEach(group=>{
    const targetSelector = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSelector);
    group.querySelectorAll('.tab').forEach(tab=>{
      tab.addEventListener('click', () => {
        group.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        const val = tab.dataset.tab;
        items.forEach(it=>{
          const show = val === 'all' || it.dataset.cat === val;
          it.classList.toggle('hidden', !show);
        });
      });
    });
  });
}

/* ---------- Gallery lightbox ---------- */
function initLightbox(){
  const lb = document.querySelector('.lightbox');
  if(!lb) return;
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.gallery-item img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lbImg.src = img.src;
      lb.classList.add('show');
    });
  });
  lb.addEventListener('click', (e)=>{ if(e.target !== lbImg) lb.classList.remove('show'); });
}

/* ---------- BMI calculator ---------- */
function initBMI(){
  const form = document.getElementById('bmi-form');
  if(!form) return;
  const result = document.getElementById('bmi-result');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const h = parseFloat(document.getElementById('bmi-height').value)/100;
    const w = parseFloat(document.getElementById('bmi-weight').value);
    if(!h || !w || h<=0 || w<=0) return;
    const bmi = w/(h*h);
    let cat, tip, color;
    if(bmi < 18.5){ cat='Underweight'; color='var(--steel)'; tip='Add calorie-dense whole foods and prioritize strength training to build lean mass.'; }
    else if(bmi < 25){ cat='Healthy'; color='var(--gold)'; tip='Great range — maintain with balanced meals and consistent training 3-5x a week.'; }
    else if(bmi < 30){ cat='Overweight'; color='#e2a13a'; tip='Combine cardio with resistance training and a moderate calorie deficit for steady progress.'; }
    else { cat='Obese'; color='var(--crimson)'; tip='Start with low-impact cardio and consult our trainers for a structured, supervised plan.'; }
    result.innerHTML = `
      <div class="num" style="color:${color}">${bmi.toFixed(1)}</div>
      <div class="cat" style="color:${color}">${cat}</div>
      <p>${tip}</p>
    `;
    result.style.display='block';
  });
}

/* ---------- Contact form (demo submit) ---------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const success = document.getElementById('contact-success');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    success.classList.add('show');
    form.reset();
    setTimeout(()=>success.classList.remove('show'), 5000);
  });
}

/* ---------- Testimonial simple rotate on small screens is CSS grid; nothing needed ---------- */

/* ============================================================
   AUTH (demo, localStorage-based — swap for real backend later)
   ============================================================ */
function getUsers(){ return JSON.parse(localStorage.getItem('forge_users') || '{}'); }
function saveUsers(u){ localStorage.setItem('forge_users', JSON.stringify(u)); }
function getSession(){ return JSON.parse(localStorage.getItem('forge_session') || 'null'); }
function setSession(email){ localStorage.setItem('forge_session', JSON.stringify({email})); }
function clearSession(){ localStorage.removeItem('forge_session'); }

function seedDemoUser(){
  const users = getUsers();
  if(!users['demo@forge.fit']){
    users['demo@forge.fit'] = {
      name: 'Arjun Vel', email:'demo@forge.fit', password:'demo1234',
      plan:'Premium', joined:'12 Jan 2026',
      bookings:[
        {day:'Monday', time:'6:00 AM', cls:'Yoga', status:'upcoming'},
        {day:'Wednesday', time:'5:00 PM', cls:'CrossFit', status:'upcoming'},
        {day:'Friday', time:'8:00 AM', cls:'Cardio Burn', status:'completed'}
      ],
      bmiHistory: [ {date:'01 Jun', bmi:24.8}, {date:'01 Jul', bmi:23.9} ]
    };
    saveUsers(users);
  }
}

function initAuthPage(){
  const tabs = document.querySelectorAll('.auth-tabs button');
  if(!tabs.length) return;
  seedDemoUser();
  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabs.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.auth-panel').forEach(p=>p.classList.remove('active'));
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });

  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  loginForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value;
    const users = getUsers();
    if(users[email] && users[email].password === pass){
      setSession(email);
      window.location.href = 'dashboard.html';
    } else {
      loginError.textContent = 'Incorrect email or password. Try demo@forge.fit / demo1234.';
      loginError.style.display='block';
    }
  });

  const regForm = document.getElementById('register-form');
  const regError = document.getElementById('register-error');
  regForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-password').value;
    const users = getUsers();
    if(users[email]){
      regError.textContent = 'An account with this email already exists.';
      regError.style.display='block';
      return;
    }
    users[email] = { name, email, password:pass, plan:'Basic', joined: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}), bookings:[], bmiHistory:[] };
    saveUsers(users);
    setSession(email);
    window.location.href = 'dashboard.html';
  });
}

function initDashboard(){
  const root = document.querySelector('.dash');
  if(!root) return;
  seedDemoUser();
  const session = getSession();
  if(!session){ window.location.href = 'login.html'; return; }
  const users = getUsers();
  const user = users[session.email];
  if(!user){ clearSession(); window.location.href='login.html'; return; }

  document.getElementById('dash-name').textContent = user.name;
  document.getElementById('dash-plan').textContent = user.plan + ' Member';
  document.getElementById('dash-initial').textContent = user.name.split(' ').map(n=>n[0]).slice(0,2).join('');
  document.getElementById('dash-plan-stat').textContent = user.plan;
  document.getElementById('dash-joined-stat').textContent = user.joined;
  document.getElementById('dash-bookings-stat').textContent = user.bookings.length;

  const list = document.getElementById('booking-list');
  if(list){
    list.innerHTML = user.bookings.length ? user.bookings.map(b=>`
      <div class="booking-row">
        <div>
          <b>${b.cls}</b>
          <div class="meta">${b.day} &middot; ${b.time}</div>
        </div>
        <span class="pill ${b.status === 'upcoming' ? 'active' : 'done'}">${b.status}</span>
      </div>
    `).join('') : '<p>No classes booked yet. Head to the schedule page to book your first session.</p>';
  }

  document.getElementById('dash-logout')?.addEventListener('click', ()=>{
    clearSession();
    window.location.href = 'index.html';
  });

  // sidebar nav switching
  const navBtns = document.querySelectorAll('.dash-nav button');
  navBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      navBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
      document.getElementById(btn.dataset.target)?.classList.add('active');
    });
  });

  // mini bmi inside dashboard
  initBMI();
}

/* ---------- Class booking (schedule page) ---------- */
function initSchedule(){
  const slots = document.querySelectorAll('.slot:not(.full)');
  if(!slots.length) return;
  slots.forEach(slot=>{
    slot.addEventListener('click', ()=>{
      const seatsEl = slot.querySelector('.seats-tag');
      const isBooked = slot.classList.contains('booked');
      if(isBooked){
        slot.classList.remove('booked');
        if(seatsEl){ const n = parseInt(seatsEl.dataset.seats,10)+1; seatsEl.dataset.seats=n; seatsEl.textContent = n+' seats left'; }
      } else {
        const seats = seatsEl ? parseInt(seatsEl.dataset.seats,10) : 1;
        if(seats <= 0) return;
        slot.classList.add('booked');
        if(seatsEl){ const n = seats-1; seatsEl.dataset.seats=n; seatsEl.textContent = n+' seats left'; }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectWhatsApp();
  initNav();
  initReveal();
  initCounters();
  initFilterTabs();
  initLightbox();
  initBMI();
  initContactForm();
  initAuthPage();
  initDashboard();
  initSchedule();
});
