(() => {
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d');
  const themeEl = document.getElementById('theme');
  const moodEl = document.getElementById('mood');
  const durationEl = document.getElementById('duration');
  const ideaText = document.getElementById('ideaText');
  const captionEl = document.getElementById('caption');
  const hashtagsEl = document.getElementById('hashtags');
  const overlayCaption = document.getElementById('overlayCaption');
  const exportBtn = document.getElementById('exportBtn');
  const progressWrap = document.getElementById('progressWrap');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  const themes = {
    cyber: {
      ideas: [
        "Une ville futuriste brille sous la pluie, tandis que des néons colorés se reflètent sur les rues.",
        "Une mégalopole cyberpunk s'éveille au milieu d'une brume violette.",
        "Des gratte-ciel lumineux dominent une avenue futuriste presque irréelle."
      ], tags: "#IA #AIVideo #Cyberpunk #Futur #TikTokFR"
    },
    space: {
      ideas: [
        "La caméra survole une planète lumineuse entourée d'anneaux et de poussière d'étoiles.",
        "Un astronaute minuscule observe une nébuleuse immense et colorée.",
        "Des planètes flottent dans un cosmos violet rempli de lumières."
      ], tags: "#IA #AIVideo #Espace #Cosmos #Univers"
    },
    ocean: {
      ideas: [
        "Une cité sous-marine illuminée apparaît derrière une eau bleue cristalline.",
        "Des méduses lumineuses flottent au-dessus d'un récif fantastique.",
        "Un palais mystérieux repose au fond d'un océan turquoise."
      ], tags: "#IA #AIVideo #Ocean #Fantasy #Visuel"
    },
    aurora: {
      ideas: [
        "Des aurores boréales dansent au-dessus de montagnes enneigées sous un ciel étoilé.",
        "Une vallée glacée s'illumine sous des rubans verts et violets.",
        "Un lac miroir reflète un ciel polaire presque irréel."
      ], tags: "#IA #AIVideo #AuroresBoreales #Nature #Relax"
    },
    dream: {
      ideas: [
        "Une île flottante couverte de cascades traverse les nuages dorés du coucher du soleil.",
        "Une petite maison fantastique flotte au-dessus d'un océan de nuages.",
        "Un jardin lumineux pousse sur une île suspendue dans le ciel."
      ], tags: "#IA #AIVideo #Fantasy #DreamWorld #Imagine"
    }
  };
  const palettes = {
    cyber: ['#07091d', '#32105d', '#00f5d4', '#ff3cac'],
    space: ['#05091c', '#25105c', '#8d7bff', '#63d7ff'],
    ocean: ['#031b36', '#087eaa', '#54f2d4', '#a7fff0'],
    aurora: ['#061c2b', '#164b56', '#60ffb5', '#b57aff'],
    dream: ['#21164c', '#ed8bcb', '#ffcf82', '#81e5ff']
  };
  let seed = Math.random() * 10000;
  let stars = [];
  let particles = [];
  let raf = null;

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function choose(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function currentTheme() {
    if (themeEl.value === 'random') return choose(['cyber', 'space', 'ocean', 'aurora', 'dream']);
    return themeEl.value;
  }
  function generateIdea() {
    const t = currentTheme();
    const item = themes[t];
    ideaText.textContent = choose(item.ideas);
    hashtagsEl.value = item.tags;
    captionEl.value = choose([
      "Tu visiterais cet endroit ? ✨",
      "Bienvenue dans un autre univers 🌌",
      "Imagine vivre ici… 👀",
      "Quel endroit je crée ensuite ?"
    ]);
    overlayCaption.textContent = captionEl.value;
    themeEl.dataset.active = t;
    seed = Math.random() * 10000;
    initParticles();
  }
  function initParticles() {
    stars = Array.from({length: 180}, () => ({
      x: rand(0, canvas.width), y: rand(0, canvas.height), r: rand(1, 4),
      speed: rand(.2, 1.8), alpha: rand(.2, .95), phase: rand(0, 6.28)
    }));
    particles = Array.from({length: 75}, () => ({
      x: rand(0, canvas.width), y: rand(0, canvas.height),
      r: rand(2, 11), speed: rand(.3, 2.2), phase: rand(0, 6.28)
    }));
  }
  function draw(tick) {
    const t = themeEl.dataset.active || currentTheme();
    const p = palettes[t] || palettes.dream;
    const w = canvas.width, h = canvas.height;
    const time = tick * .00015 + seed;
    const grad = ctx.createLinearGradient(0, 0, w * .6, h);
    grad.addColorStop(0, p[0]); grad.addColorStop(.5, p[1]); grad.addColorStop(1, '#030612');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

    // Glow / distant horizon
    const glow = ctx.createRadialGradient(w*.5, h*.54, 10, w*.5, h*.54, w*.65);
    glow.addColorStop(0, p[2] + '66'); glow.addColorStop(.5, p[3] + '22'); glow.addColorStop(1, '#00000000');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

    // Moving stars / particles
    stars.forEach((s, i) => {
      let y = (s.y + tick * s.speed * .04) % h;
      let x = s.x + Math.sin(time + s.phase) * 14;
      ctx.globalAlpha = s.alpha * (.55 + .45 * Math.sin(time * 2 + s.phase));
      ctx.fillStyle = i % 4 === 0 ? p[2] : '#ffffff';
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (t === 'cyber') drawCity(tick, p);
    if (t === 'space') drawPlanets(tick, p);
    if (t === 'ocean') drawOcean(tick, p);
    if (t === 'aurora') drawAurora(tick, p);
    if (t === 'dream') drawIsland(tick, p);

    // Soft cinematic vignette
    const vig = ctx.createRadialGradient(w/2, h/2, h*.18, w/2, h/2, h*.72);
    vig.addColorStop(.5, '#00000000'); vig.addColorStop(1, '#00000099');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);
    raf = requestAnimationFrame(draw);
  }
  function drawCity(tick, p) {
    const w=canvas.width,h=canvas.height, horizon=h*.68;
    ctx.fillStyle = '#050714';
    for(let i=0;i<25;i++){
      const bw=randDet(i, 14, 45), bh=randDet(i+50, 100, 440);
      const x=(i*w/23 - 30 + Math.sin(tick*.0002+i)*8);
      ctx.fillRect(x,horizon-bh,bw,bh+250);
      ctx.fillStyle = i%3===0 ? p[2] : p[3];
      for(let y=horizon-bh+25;y<horizon;y+=34){
        for(let xx=x+8;xx<x+bw-4;xx+=15){
          if(((Math.floor(xx)+Math.floor(y)+i)%4)!==0) ctx.fillRect(xx,y,5,9);
        }
      }
      ctx.fillStyle='#050714';
    }
    ctx.fillStyle='#090d1d'; ctx.beginPath(); ctx.moveTo(0,horizon); ctx.lineTo(w,horizon); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.fill();
    for(let i=0;i<12;i++){
      ctx.strokeStyle=(i%2?p[2]:p[3])+'88'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(w/2,horizon); ctx.lineTo(i*w/11,h); ctx.stroke();
    }
    for(let j=0;j<18;j++){
      let y=horizon+Math.pow(j/18,2)*h*.4;
      ctx.strokeStyle=p[2]+'55'; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
    }
  }
  function drawPlanets(tick,p) {
    const w=canvas.width,h=canvas.height;
    const x=w*.55+Math.sin(tick*.0003)*25, y=h*.43+Math.cos(tick*.0002)*18, r=w*.22;
    const g=ctx.createRadialGradient(x-r*.35,y-r*.4,5,x,y,r);
    g.addColorStop(0,'#ffffff');g.addColorStop(.25,p[3]);g.addColorStop(1,p[1]);
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.translate(x,y);ctx.rotate(-.25);
    ctx.strokeStyle=p[2]+'cc';ctx.lineWidth=13;ctx.beginPath();ctx.ellipse(0,0,r*1.8,r*.48,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    for(let i=0;i<5;i++){ctx.fillStyle=p[2]+'44';ctx.beginPath();ctx.arc((i*139+80)%w,(i*223+tick*.03)%h,randDet(i,15,38),0,Math.PI*2);ctx.fill();}
  }
  function drawOcean(tick,p) {
    const w=canvas.width,h=canvas.height, y0=h*.56;
    for(let layer=0;layer<7;layer++){
      ctx.beginPath();ctx.moveTo(0,y0+layer*50);
      for(let x=0;x<=w;x+=12){const y=y0+layer*47+Math.sin(x*.012+tick*.001+layer)*22+Math.sin(x*.027-tick*.0007)*8;ctx.lineTo(x,y);}
      ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
      ctx.fillStyle=layer%2?p[1]+'bb':p[2]+'55';ctx.fill();
    }
    for(let i=0;i<18;i++){
      let x=(i*97+tick*.025)%w, y=(i*131+tick*.05)%h;
      ctx.strokeStyle=p[2]+'aa';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,8+Math.sin(tick*.002+i)*4,0,Math.PI*2);ctx.stroke();
    }
  }
  function drawAurora(tick,p) {
    const w=canvas.width,h=canvas.height;
    for(let band=0;band<5;band++){
      ctx.beginPath();
      for(let x=0;x<=w;x+=8){
        const y=h*.22+band*95+Math.sin(x*.008+tick*.0005+band)*85+Math.sin(x*.017-tick*.0003)*35;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=(band%2?p[2]:p[3])+'66';ctx.lineWidth=55;ctx.lineCap='round';ctx.shadowBlur=55;ctx.shadowColor=p[2];ctx.stroke();ctx.shadowBlur=0;
    }
    ctx.fillStyle='#071522';ctx.beginPath();ctx.moveTo(0,h*.75);ctx.lineTo(w*.22,h*.55);ctx.lineTo(w*.42,h*.78);ctx.lineTo(w*.7,h*.51);ctx.lineTo(w,h*.76);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
  }
  function drawIsland(tick,p) {
    const w=canvas.width,h=canvas.height,cx=w*.5,cy=h*.57+Math.sin(tick*.001)*12;
    ctx.fillStyle='#12203d';ctx.beginPath();ctx.ellipse(cx,cy,w*.38,h*.075,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=p[2];ctx.beginPath();ctx.ellipse(cx,cy-15,w*.38,h*.09,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#15284a';ctx.beginPath();ctx.moveTo(cx-w*.27,cy);ctx.lineTo(cx+w*.27,cy);ctx.lineTo(cx+w*.13,cy+h*.19);ctx.lineTo(cx,cy+h*.27);ctx.lineTo(cx-w*.16,cy+h*.16);ctx.closePath();ctx.fill();
    // floating rocks and glowing waterfalls
    for(let i=0;i<5;i++){
      const x=cx+(i-2)*70, top=cy-100-Math.sin(tick*.001+i)*15;
      ctx.strokeStyle=p[3]+'99';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x+(i-2)*12,top+180);ctx.stroke();
      ctx.fillStyle='#1d3854';ctx.beginPath();ctx.ellipse(x,top,24,12,0,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#ffe7ac';ctx.beginPath();ctx.arc(cx,cy-100,25,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffd18b';ctx.fillRect(cx-32,cy-165,64,60);ctx.fillStyle='#2d2856';ctx.beginPath();ctx.moveTo(cx-42,cy-165);ctx.lineTo(cx,cy-210);ctx.lineTo(cx+42,cy-165);ctx.fill();
  }
  function randDet(n,min,max){ const x=Math.sin(n*127.1+seed*311.7)*43758.5453; return min+(x-Math.floor(x))*(max-min); }

  function updateOverlay() { overlayCaption.textContent = captionEl.value.trim() || 'Un autre monde t’attend…'; }
  document.getElementById('ideaBtn').addEventListener('click', generateIdea);
  document.getElementById('refreshBtn').addEventListener('click', () => { seed = Math.random()*10000; initParticles(); });
  captionEl.addEventListener('input', updateOverlay);
  themeEl.addEventListener('change', () => { themeEl.dataset.active = currentTheme(); seed=Math.random()*10000; initParticles(); });
  moodEl.addEventListener('change', () => {
    const moodCaptions = {cinematic:"Un autre monde t'attend…",calm:"Respire et profite de l'instant.",mystery:"Et si ce monde existait vraiment ?",bright:"Bienvenue dans un monde impossible !"};
    overlayCaption.textContent = moodCaptions[moodEl.value];
    captionEl.value = moodCaptions[moodEl.value];
  });
  document.getElementById('copyBtn').addEventListener('click', async () => {
    const text = `${captionEl.value.trim()}\n\n${hashtagsEl.value.trim()}`;
    try { await navigator.clipboard.writeText(text); alert('Description et hashtags copiés !'); }
    catch { prompt('Copie ce texte :', text); }
  });

  exportBtn.addEventListener('click', async () => {
    if (!canvas.captureStream || !window.MediaRecorder) {
      alert("Ton navigateur ne prend pas en charge l'export vidéo. Essaie Chrome ou Edge sur ordinateur.");
      return;
    }
    const seconds = Number(durationEl.value);
    let mime = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm';
    if (!MediaRecorder.isTypeSupported(mime)) {
      alert("L'export WebM n'est pas pris en charge par ce navigateur. Essaie Chrome ou Edge.");
      return;
    }
    const stream = canvas.captureStream(30);
    let recorder;
    try { recorder = new MediaRecorder(stream, {mimeType:mime, videoBitsPerSecond:5000000}); }
    catch { recorder = new MediaRecorder(stream); }
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onerror = () => { alert("Une erreur est survenue pendant l'export."); exportBtn.disabled = false; };
    recorder.onstop = () => {
      const blob = new Blob(chunks, {type:recorder.mimeType || 'video/webm'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `layon-ai-${new Date().toISOString().slice(0,10)}.webm`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      progressBar.style.width = '100%'; progressText.textContent = 'Vidéo prête : téléchargement lancé.';
      exportBtn.disabled = false;
      setTimeout(() => progressWrap.classList.add('hidden'), 3000);
      stream.getTracks().forEach(track => track.stop());
    };
    exportBtn.disabled = true;
    progressWrap.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = `Création de la vidéo (${seconds} s)… garde cet onglet ouvert.`;
    recorder.start();
    const start = performance.now();
    const timer = setInterval(() => {
      const pct = Math.min(100, ((performance.now()-start)/(seconds*1000))*100);
      progressBar.style.width = `${pct}%`;
      progressText.textContent = `Création de la vidéo… ${Math.round(pct)} %`;
      if (pct >= 100) { clearInterval(timer); if (recorder.state !== 'inactive') recorder.stop(); }
    }, 100);
  });

  themeEl.dataset.active = 'cyber';
  initParticles();
  draw(0);
})();
