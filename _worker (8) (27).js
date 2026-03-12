// Cloudflare Pages Worker — Media Downloader
// Routes: / → PAGE_HOME | /tiktok → PAGE_TIKTOK | /terabox → PAGE_TERABOX
// API:    /api/tiktok?url=  |  /api/terabox?url=&server=

const HTML_HEADERS = { 'Content-Type': 'text/html; charset=UTF-8', 'Cache-Control': 'public, max-age=3600' };

const PAGE_HOME = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Media Downloader</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
:root {
  --bg: #0a0a0f;
  --card: rgba(255,255,255,0.05);
  --card-border: rgba(255,255,255,0.08);
  --blue: #3b82f6;
  --purple: #8b5cf6;
  --tiktok: #fe2c55;
  --terabox: #3b82f6;
  --green: #10b981;
  --red: #ef4444;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --nav-bg: rgba(10,10,15,0.85);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0f; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
.orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(80px);
  opacity: 0.35;
}
.orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #3b82f6, transparent 70%); top: -200px; left: -200px; animation: float 14s ease-in-out infinite; }
.orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #8b5cf6, transparent 70%); top: 40%; right: -150px; animation: float 18s ease-in-out infinite reverse; }
.orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, #fe2c55, transparent 70%); bottom: -100px; left: 30%; animation: float 22s ease-in-out infinite 4s; }
@keyframes float {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(30px,-40px) scale(1.05); }
  66%      { transform: translate(-20px,20px) scale(0.95); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
  50%      { box-shadow: 0 0 40px rgba(139,92,246,0.5); }
}
nav {
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--card-border);
  padding: 0 24px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 700; font-size: 1.1rem; color: var(--text); }
.nav-dot { width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); box-shadow: 0 0 12px rgba(59,130,246,0.7); }
.nav-links { display: flex; gap: 4px; }
.nav-links a { padding: 6px 16px; border-radius: 8px; text-decoration: none; color: var(--muted); font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
.nav-links a:hover { color: var(--text); background: rgba(255,255,255,0.07); }
.nav-links a.active { color: var(--text); background: rgba(59,130,246,0.15); }
main { position: relative; z-index: 1; }
.hero { text-align: center; padding: 100px 24px 80px; animation: fadeUp 0.7s ease both; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25);
  border-radius: 100px; padding: 6px 16px; font-size: 0.8rem; color: var(--blue);
  font-weight: 600; margin-bottom: 28px; letter-spacing: 0.05em; text-transform: uppercase;
}
.hero h1 {
  font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 24px;
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6, #60a5fa);
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradientShift 6s ease infinite;
}
.hero p { font-size: clamp(1rem, 2.5vw, 1.2rem); color: var(--muted); max-width: 520px; margin: 0 auto 48px; line-height: 1.7; }
.hero-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--blue), var(--purple));
  color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none;
  font-weight: 700; font-size: 1rem; transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 24px rgba(59,130,246,0.35);
}
.hero-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(139,92,246,0.45); }
.cards-section { padding: 0 24px 80px; }
.cards-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
.feature-card {
  background: var(--card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--card-border); border-radius: 20px; padding: 36px 32px;
  text-decoration: none; color: var(--text); transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeUp 0.7s ease both; display: block;
}
.feature-card:nth-child(2) { animation-delay: 0.1s; }
.feature-card:hover { transform: translateY(-6px); }
.feature-card.tiktok:hover { box-shadow: 0 16px 48px rgba(254,44,85,0.3); }
.feature-card.terabox:hover { box-shadow: 0 16px 48px rgba(59,130,246,0.3); }
.card-icon { font-size: 2.8rem; margin-bottom: 20px; display: block; }
.card-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 12px; }
.feature-card.tiktok .card-title { background: linear-gradient(135deg, var(--tiktok), #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.feature-card.terabox .card-title { background: linear-gradient(135deg, var(--blue), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.card-desc { color: var(--muted); line-height: 1.65; margin-bottom: 24px; font-size: 0.95rem; }
.card-link { font-weight: 600; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 6px; transition: gap 0.2s; }
.feature-card.tiktok .card-link { color: var(--tiktok); }
.feature-card.terabox .card-link { color: var(--blue); }
.feature-card:hover .card-link { gap: 10px; }
footer { position: relative; z-index: 1; text-align: center; padding: 24px; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--card-border); }
</style>
</head>
<body>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>
<nav>
  <a href="/" class="nav-brand"><span class="nav-dot"></span>MediaDL</a>
  <div class="nav-links">
    <a href="/" class="active">Home</a>
    <a href="/tiktok">TikTok</a>
    <a href="/terabox">Terabox</a>
  </div>
</nav>
<main>
  <section class="hero">
    <div class="hero-badge">&#x2726; Free &amp; Fast</div>
    <h1>Media Downloader</h1>
    <p>Download TikTok videos without watermarks and access Terabox files instantly — fast, free, and beautifully simple.</p>
    <a href="/tiktok" class="hero-cta">Get Started &#x2193;</a>
  </section>
  <section class="cards-section">
    <div class="cards-grid">
      <a href="/tiktok" class="feature-card tiktok">
        <span class="card-icon">&#127925;</span>
        <div class="card-title">TikTok Downloader</div>
        <p class="card-desc">Download TikTok videos in HD quality — no watermark. Save as MP4 or extract audio as MP3 with a single click.</p>
        <span class="card-link">Get Started &rarr;</span>
      </a>
      <a href="/terabox" class="feature-card terabox">
        <span class="card-icon">&#128230;</span>
        <div class="card-title">Terabox Downloader</div>
        <p class="card-desc">Access and download files stored on Terabox directly. Stream videos or download files through dual-server support.</p>
        <span class="card-link">Get Started &rarr;</span>
      </a>
    </div>
  </section>
</main>
<footer>&copy; 2025 MediaDL &mdash; Built with &hearts; on Cloudflare Pages</footer>
</body>
</html>`;

const PAGE_TIKTOK = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>TikTok Downloader</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
:root {
  --bg: #0a0a0f; --card: rgba(255,255,255,0.05); --card-border: rgba(255,255,255,0.08);
  --blue: #3b82f6; --purple: #8b5cf6; --tiktok: #fe2c55; --terabox: #3b82f6;
  --green: #10b981; --red: #ef4444; --text: #f1f5f9; --muted: #94a3b8;
  --nav-bg: rgba(10,10,15,0.85);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0f; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
.orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.3; }
.orb-1 { width: 550px; height: 550px; background: radial-gradient(circle, #fe2c55, transparent 70%); top: -150px; right: -150px; animation: float 16s ease-in-out infinite; }
.orb-2 { width: 450px; height: 450px; background: radial-gradient(circle, #8b5cf6, transparent 70%); bottom: 10%; left: -100px; animation: float 20s ease-in-out infinite reverse; }
.orb-3 { width: 350px; height: 350px; background: radial-gradient(circle, #3b82f6, transparent 70%); top: 50%; right: 20%; animation: float 24s ease-in-out infinite 6s; }
@keyframes float { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,-30px) scale(1.04); } 66% { transform: translate(-15px,15px) scale(0.96); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes pulse { 0%,100% { box-shadow: 0 0 20px rgba(254,44,85,0.3); } 50% { box-shadow: 0 0 40px rgba(254,44,85,0.6); } }
nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); background: var(--nav-bg); border-bottom: 1px solid var(--card-border); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 700; font-size: 1.1rem; color: var(--text); }
.nav-dot { width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); box-shadow: 0 0 12px rgba(59,130,246,0.7); }
.nav-links { display: flex; gap: 4px; }
.nav-links a { padding: 6px 16px; border-radius: 8px; text-decoration: none; color: var(--muted); font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
.nav-links a:hover { color: var(--text); background: rgba(255,255,255,0.07); }
.nav-links a.active { color: var(--text); background: rgba(254,44,85,0.15); }
main { position: relative; z-index: 1; padding: 60px 24px 80px; max-width: 760px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 48px; animation: fadeUp 0.6s ease both; }
.page-header h1 {
  font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800;
  background: linear-gradient(135deg, var(--tiktok), #ff6b6b, #ff9eae, var(--tiktok));
  background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: gradientShift 5s ease infinite; margin-bottom: 12px;
}
.page-header p { color: var(--muted); font-size: 1rem; }
.glass-card { background: var(--card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 32px; animation: fadeUp 0.6s ease both; }
.form-label { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.input-wrap { display: flex; gap: 12px; align-items: stretch; }
.input-icon-wrap { position: relative; flex: 1; }
.input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; pointer-events: none; }
input[type="text"] { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px 14px 46px; color: var(--text); font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
input[type="text"]::placeholder { color: rgba(148,163,184,0.5); }
input[type="text"]:focus { border-color: rgba(254,44,85,0.5); box-shadow: 0 0 0 3px rgba(254,44,85,0.1); }
.btn-download { display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, var(--tiktok), #ff6b6b); color: #fff; border: none; border-radius: 12px; padding: 14px 28px; font-family: inherit; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; white-space: nowrap; box-shadow: 0 4px 20px rgba(254,44,85,0.35); }
.btn-download:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(254,44,85,0.5); }
.btn-download:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
.btn-download.loading .spinner { display: block; }
.btn-download.loading .btn-text { display: none; }
.status-box { margin-top: 20px; border-radius: 14px; padding: 16px 20px; display: none; align-items: center; gap: 14px; animation: fadeUp 0.4s ease both; }
.status-box.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }
.status-box.loading-box { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; }
.status-box.show { display: flex; }
.status-icon { font-size: 1.3rem; flex-shrink: 0; }
.status-spinner { width: 20px; height: 20px; border: 2px solid rgba(147,197,253,0.3); border-top-color: #93c5fd; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
.result-card { margin-top: 28px; background: var(--card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; overflow: hidden; display: none; animation: fadeUp 0.5s ease both; }
.result-card.show { display: block; }
.thumb-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #1a1a2e; }
.thumb-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.thumb-wrap:hover img { transform: scale(1.04); }
.duration-badge { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border-radius: 6px; padding: 4px 10px; font-size: 0.8rem; font-weight: 600; color: #fff; }
.stats-overlay { position: absolute; bottom: 12px; left: 12px; display: flex; gap: 8px; }
.stat-chip { background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border-radius: 20px; padding: 4px 12px; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 5px; }
.result-body { padding: 24px 28px; }
.author-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.author-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(254,44,85,0.4); }
.author-avatar-placeholder { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--tiktok), #ff6b6b); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
.author-name { font-weight: 700; font-size: 0.95rem; }
.author-handle { color: var(--muted); font-size: 0.82rem; }
.caption { color: rgba(241,245,249,0.8); font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.dl-list { display: flex; flex-direction: column; gap: 10px; }
.dl-item { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 12px 16px; text-decoration: none; color: var(--text); transition: background 0.2s, transform 0.2s; }
.dl-item:hover { background: rgba(255,255,255,0.09); transform: translateX(4px); }
.dl-item-left { display: flex; align-items: center; gap: 12px; }
.dl-badge { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; }
.badge-hd { background: rgba(254,44,85,0.2); color: #fe2c55; border: 1px solid rgba(254,44,85,0.3); }
.badge-sd { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
.badge-wm { background: rgba(148,163,184,0.15); color: var(--muted); border: 1px solid rgba(148,163,184,0.2); }
.badge-mp3 { background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
.dl-label { font-size: 0.9rem; font-weight: 500; }
.dl-size { font-size: 0.78rem; color: var(--muted); }
.dl-arrow { color: var(--muted); font-size: 0.9rem; }
footer { position: relative; z-index: 1; text-align: center; padding: 24px; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--card-border); }
</style>
</head>
<body>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>
<nav>
  <a href="/" class="nav-brand"><span class="nav-dot"></span>MediaDL</a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/tiktok" class="active">TikTok</a>
    <a href="/terabox">Terabox</a>
  </div>
</nav>
<main>
  <div class="page-header">
    <h1>TikTok Downloader</h1>
    <p>Download TikTok videos in HD &mdash; no watermark, no hassle.</p>
  </div>
  <div class="glass-card" style="animation-delay:0.1s">
    <label class="form-label" for="ttUrl">Video URL</label>
    <div class="input-wrap">
      <div class="input-icon-wrap">
        <span class="input-icon">&#128203;</span>
        <input type="text" id="ttUrl" placeholder="Paste TikTok URL here&hellip;" autocomplete="off"/>
      </div>
      <button class="btn-download" id="ttBtn" onclick="doFetch()">
        <div class="spinner"></div>
        <span class="btn-text">Download</span>
      </button>
    </div>
    <div class="status-box error" id="errBox">
      <span class="status-icon">&#10060;</span>
      <span id="errMsg">Something went wrong.</span>
    </div>
    <div class="status-box loading-box" id="loadBox">
      <div class="status-spinner"></div>
      <span>Fetching video info&hellip;</span>
    </div>
  </div>
  <div class="result-card" id="resultCard">
    <div class="thumb-wrap" id="thumbWrap">
      <img id="thumbImg" src="" alt="Thumbnail"/>
      <div class="duration-badge" id="durBadge"></div>
      <div class="stats-overlay" id="statsOverlay"></div>
    </div>
    <div class="result-body">
      <div class="author-row" id="authorRow"></div>
      <p class="caption" id="caption"></p>
      <div class="dl-list" id="dlList"></div>
    </div>
  </div>
</main>
<footer>&copy; 2025 MediaDL &mdash; Built with &hearts; on Cloudflare Pages</footer>
<script>
function fmtNum(n){if(!n)return'0';n=parseInt(n);if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return n.toString();}
function fmtDur(s){s=parseInt(s)||0;const m=Math.floor(s/60),sec=s%60;return m+':'+(sec<10?'0':'')+sec;}
function fmtSize(b){if(!b)return'';b=parseInt(b);if(b>=1e6)return(b/1e6).toFixed(1)+' MB';if(b>=1e3)return(b/1e3).toFixed(1)+' KB';return b+' B';}
function showErr(msg){document.getElementById('errMsg').textContent=msg;document.getElementById('errBox').classList.add('show');document.getElementById('loadBox').classList.remove('show');}
function setLoading(on){const btn=document.getElementById('ttBtn');btn.disabled=on;btn.classList.toggle('loading',on);document.getElementById('loadBox').classList.toggle('show',on);document.getElementById('errBox').classList.remove('show');if(!on)document.getElementById('resultCard').classList.remove('show');}
async function doFetch(){
  const url=document.getElementById('ttUrl').value.trim();
  if(!url)return showErr('Please enter a TikTok URL.');
  setLoading(true);
  try{
    const res=await fetch('/api/tiktok?url='+encodeURIComponent(url));
    const data=await res.json();
    setLoading(false);
    if(data.code!==0||!data.data)return showErr(data.msg||'No data returned.');
    renderResult(data.data);
  }catch(e){setLoading(false);showErr('Network error: '+e.message);}
}
function renderResult(d){
  const card=document.getElementById('resultCard');
  document.getElementById('thumbImg').src=d.cover||d.origin_cover||'';
  const dur=document.getElementById('durBadge');
  dur.textContent=d.duration?fmtDur(d.duration):'';
  const stats=document.getElementById('statsOverlay');
  stats.innerHTML='';
  if(d.play_count)stats.innerHTML+='<span class="stat-chip">&#9654; '+fmtNum(d.play_count)+'</span>';
  if(d.digg_count)stats.innerHTML+='<span class="stat-chip">&#9829; '+fmtNum(d.digg_count)+'</span>';
  const author=document.getElementById('authorRow');
  const av=d.author&&d.author.avatar?d.author.avatar:'';
  author.innerHTML=(av?'<img class="author-avatar" src="'+av+'" alt="avatar" onerror="this.style.display=\'none\'">':'<div class="author-avatar-placeholder">&#128100;</div>')
    +'<div><div class="author-name">'+(d.author&&d.author.nickname?d.author.nickname:'Unknown')+'</div>'
    +'<div class="author-handle">@'+(d.author&&d.author.unique_id?d.author.unique_id:'')+'</div></div>';
  document.getElementById('caption').textContent=d.title||'';
  const list=document.getElementById('dlList');
  list.innerHTML='';
  const links=[
    {badge:'badge-hd',label:'HD Video (No Watermark)',url:d.hdplay||d.play,size:d.hd_size||d.size},
    {badge:'badge-sd',label:'SD Video (No Watermark)',url:d.play,size:d.size},
    {badge:'badge-wm',label:'Video with Watermark',url:d.wmplay,size:d.wm_size},
    {badge:'badge-mp3',label:'Audio MP3',url:d.music,size:d.music_info&&d.music_info.play_url?d.music_info.play_url.size:null},
  ];
  links.forEach(function(item){
    if(!item.url)return;
    var tag=item.badge.replace('badge-','').toUpperCase();
    list.innerHTML+='<a class="dl-item" href="'+item.url+'" target="_blank" rel="noopener">'
      +'<div class="dl-item-left"><span class="dl-badge '+item.badge+'">'+tag+'</span>'
      +'<span class="dl-label">'+item.label+'</span></div>'
      +'<div style="display:flex;align-items:center;gap:10px">'
      +(item.size?'<span class="dl-size">'+fmtSize(item.size)+'</span>':'')
      +'<span class="dl-arrow">&#8595;</span></div></a>';
  });
  card.classList.add('show');
  card.scrollIntoView({behavior:'smooth',block:'nearest'});
}
document.getElementById('ttUrl').addEventListener('keydown',function(e){
  if(e.key==='Enter')doFetch();
  if(e.key==='Escape'){e.target.value='';document.getElementById('errBox').classList.remove('show');document.getElementById('resultCard').classList.remove('show');}
});
</script>
</body>
</html>`;

const PAGE_TERABOX = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Terabox Downloader</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
:root {
  --bg: #0a0a0f; --card: rgba(255,255,255,0.05); --card-border: rgba(255,255,255,0.08);
  --blue: #3b82f6; --purple: #8b5cf6; --tiktok: #fe2c55; --terabox: #3b82f6;
  --green: #10b981; --red: #ef4444; --text: #f1f5f9; --muted: #94a3b8;
  --nav-bg: rgba(10,10,15,0.85);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0f; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
.orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.3; }
.orb-1 { width: 580px; height: 580px; background: radial-gradient(circle, #3b82f6, transparent 70%); top: -150px; left: -100px; animation: float 15s ease-in-out infinite; }
.orb-2 { width: 460px; height: 460px; background: radial-gradient(circle, #8b5cf6, transparent 70%); bottom: 10%; right: -100px; animation: float 19s ease-in-out infinite reverse; }
.orb-3 { width: 380px; height: 380px; background: radial-gradient(circle, #10b981, transparent 70%); top: 55%; left: 20%; animation: float 23s ease-in-out infinite 5s; }
@keyframes float { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(25px,-35px) scale(1.04); } 66% { transform: translate(-18px,18px) scale(0.96); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes pulse { 0%,100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.6); } }
nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); background: var(--nav-bg); border-bottom: 1px solid var(--card-border); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; font-weight: 700; font-size: 1.1rem; color: var(--text); }
.nav-dot { width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--purple)); box-shadow: 0 0 12px rgba(59,130,246,0.7); }
.nav-links { display: flex; gap: 4px; }
.nav-links a { padding: 6px 16px; border-radius: 8px; text-decoration: none; color: var(--muted); font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
.nav-links a:hover { color: var(--text); background: rgba(255,255,255,0.07); }
.nav-links a.active { color: var(--text); background: rgba(59,130,246,0.15); }
main { position: relative; z-index: 1; padding: 60px 24px 80px; max-width: 1100px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 48px; animation: fadeUp 0.6s ease both; }
.page-header h1 {
  font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800;
  background: linear-gradient(135deg, var(--blue), var(--purple), #60a5fa, var(--blue));
  background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: gradientShift 5s ease infinite; margin-bottom: 12px;
}
.page-header p { color: var(--muted); font-size: 1rem; }
.glass-card { background: var(--card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 32px; animation: fadeUp 0.6s ease both; max-width: 760px; margin: 0 auto; }
.form-label { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.input-wrap { display: flex; gap: 12px; align-items: stretch; }
.input-icon-wrap { position: relative; flex: 1; }
.input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; pointer-events: none; }
input[type="text"] { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px 14px 46px; color: var(--text); font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
input[type="text"]::placeholder { color: rgba(148,163,184,0.5); }
input[type="text"]:focus { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.server-row { display: flex; align-items: center; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
.server-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
select { flex: 1; min-width: 200px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 11px 40px 11px 16px; color: var(--text); font-family: inherit; font-size: 0.9rem; outline: none; cursor: pointer; transition: border-color 0.2s; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; }
select:focus { border-color: rgba(59,130,246,0.5); }
select option { background: #1e1e2e; color: var(--text); }
.btn-fetch { display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, var(--blue), var(--purple)); color: #fff; border: none; border-radius: 12px; padding: 14px 28px; font-family: inherit; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; white-space: nowrap; box-shadow: 0 4px 20px rgba(59,130,246,0.35); }
.btn-fetch:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(59,130,246,0.5); }
.btn-fetch:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
.btn-fetch.loading .spinner { display: block; }
.btn-fetch.loading .btn-text { display: none; }
.status-box { margin-top: 20px; border-radius: 14px; padding: 16px 20px; display: none; align-items: center; gap: 14px; animation: fadeUp 0.4s ease both; }
.status-box.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }
.status-box.loading-box { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; }
.status-box.show { display: flex; }
.status-icon { font-size: 1.3rem; flex-shrink: 0; }
.status-spinner { width: 20px; height: 20px; border: 2px solid rgba(147,197,253,0.3); border-top-color: #93c5fd; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
.files-section { margin-top: 40px; display: none; animation: fadeUp 0.5s ease both; }
.files-section.show { display: block; }
.files-heading { text-align: center; margin-bottom: 24px; color: var(--muted); font-size: 0.9rem; }
.files-heading span { color: var(--text); font-weight: 700; }
.files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.file-card { background: var(--card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.5s ease both; transition: transform 0.3s, box-shadow 0.3s; }
.file-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(59,130,246,0.2); }
.file-thumb { position: relative; aspect-ratio: 16/9; background: #1a1a2e; overflow: hidden; }
.file-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.file-card:hover .file-thumb img { transform: scale(1.06); }
.thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1)); }
.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); opacity: 0; transition: opacity 0.3s; }
.file-card:hover .play-overlay { opacity: 1; }
.play-btn-overlay { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: transform 0.2s, background 0.2s; }
.play-btn-overlay:hover { transform: scale(1.1); background: rgba(255,255,255,0.25); }
.file-body { padding: 16px; }
.file-name { font-size: 0.88rem; font-weight: 600; line-height: 1.45; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.file-info { font-size: 0.78rem; color: var(--muted); margin-bottom: 14px; }
.file-actions { display: flex; gap: 8px; }
.btn-dl { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); border-radius: 10px; padding: 9px 12px; color: #6ee7b7; font-family: inherit; font-size: 0.82rem; font-weight: 600; text-decoration: none; transition: background 0.2s, transform 0.2s; cursor: pointer; }
.btn-dl:hover { background: rgba(16,185,129,0.22); transform: translateY(-1px); }
.btn-play { display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25); border-radius: 10px; padding: 9px 14px; color: #93c5fd; font-family: inherit; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.2s; }
.btn-play:hover { background: rgba(59,130,246,0.22); transform: translateY(-1px); }
.modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: none; align-items: center; justify-content: center; padding: 24px; }
.modal-overlay.open { display: flex; }
.modal-inner { position: relative; width: 100%; max-width: 860px; animation: fadeUp 0.3s ease both; }
.modal-close { position: absolute; top: -14px; right: -14px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: var(--text); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; z-index: 10; }
.modal-close:hover { background: rgba(239,68,68,0.3); transform: scale(1.1); }
.modal-video { width: 100%; border-radius: 16px; background: #000; display: block; max-height: 80vh; }
footer { position: relative; z-index: 1; text-align: center; padding: 24px; color: var(--muted); font-size: 0.85rem; border-top: 1px solid var(--card-border); }
</style>
</head>
<body>
<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>
<div class="modal-overlay" id="videoModal" onclick="closeModal(event)">
  <div class="modal-inner">
    <button class="modal-close" onclick="closeModal(null,true)">&#10005;</button>
    <video class="modal-video" id="modalVideo" controls playsinline></video>
  </div>
</div>
<nav>
  <a href="/" class="nav-brand"><span class="nav-dot"></span>MediaDL</a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/tiktok">TikTok</a>
    <a href="/terabox" class="active">Terabox</a>
  </div>
</nav>
<main>
  <div class="page-header">
    <h1>Terabox Downloader</h1>
    <p>Access and download files stored on Terabox &mdash; stream videos instantly.</p>
  </div>
  <div class="glass-card" style="animation-delay:0.1s">
    <label class="form-label" for="tbUrl">File URL</label>
    <div class="input-wrap">
      <div class="input-icon-wrap">
        <span class="input-icon">&#128279;</span>
        <input type="text" id="tbUrl" placeholder="Paste Terabox share URL here&hellip;" autocomplete="off"/>
      </div>
      <button class="btn-fetch" id="tbBtn" onclick="doFetch()">
        <div class="spinner"></div>
        <span class="btn-text">Fetch Files</span>
      </button>
    </div>
    <div class="server-row">
      <span class="server-label">API Server</span>
      <select id="tbServer">
        <option value="1">Server 1 &mdash; PlayTerabox (Primary)</option>
        <option value="2">Server 2 &mdash; SonzaIX (Alt)</option>
      </select>
    </div>
    <div class="status-box error" id="errBox">
      <span class="status-icon">&#10060;</span>
      <span id="errMsg">Something went wrong.</span>
    </div>
    <div class="status-box loading-box" id="loadBox">
      <div class="status-spinner"></div>
      <span>Fetching file list&hellip;</span>
    </div>
  </div>
  <div class="files-section" id="filesSection">
    <p class="files-heading" id="filesHeading"></p>
    <div class="files-grid" id="filesGrid"></div>
  </div>
</main>
<footer>&copy; 2025 MediaDL &mdash; Built with &hearts; on Cloudflare Pages</footer>
<script>
function showErr(msg){document.getElementById('errMsg').textContent=msg;document.getElementById('errBox').classList.add('show');document.getElementById('loadBox').classList.remove('show');}
function setLoading(on){const btn=document.getElementById('tbBtn');btn.disabled=on;btn.classList.toggle('loading',on);document.getElementById('loadBox').classList.toggle('show',on);document.getElementById('errBox').classList.remove('show');if(!on)document.getElementById('filesSection').classList.remove('show');}
async function doFetch(){
  const url=document.getElementById('tbUrl').value.trim();
  const server=document.getElementById('tbServer').value;
  if(!url)return showErr('Please enter a Terabox URL.');
  setLoading(true);
  try{
    const res=await fetch('/api/terabox?url='+encodeURIComponent(url)+'&server='+server);
    const data=await res.json();
    setLoading(false);
    if(data.error)return showErr(data.error+(data.details?': '+data.details:''));
    if(!data.files||data.files.length===0)return showErr('No files found.');
    renderFiles(data.files);
  }catch(e){setLoading(false);showErr('Network error: '+e.message);}
}
function isVideo(fn,pl){if(pl)return true;return/\.(mp4|mkv|webm|mov|avi|flv)$/i.test(fn||'');}
function renderFiles(files){
  const grid=document.getElementById('filesGrid');
  const heading=document.getElementById('filesHeading');
  const section=document.getElementById('filesSection');
  heading.innerHTML='Found <span>'+files.length+' file'+(files.length!==1?'s':'')+'</span>';
  grid.innerHTML='';
  files.forEach(function(f,i){
    var vid=isVideo(f.filename,f.play_link);
    var src=f.play_link||f.download_link||'';
    var thumbHtml=f.thumbnail
      ?'<img src="'+f.thumbnail+'" alt="thumbnail" loading="lazy">'
      :'<div class="thumb-placeholder">'+(vid?'&#127916;':'&#128196;')+'</div>';
    var playOverlay=vid?'<div class="play-overlay"><div class="play-btn-overlay" onclick="openModal(\''+src+'\')">&#9654;</div></div>':'';
    var playBtn=vid?'<button class="btn-play" onclick="openModal(\''+src+'\')">&#9654; Play</button>':'';
    var card=document.createElement('div');
    card.className='file-card';
    card.style.animationDelay=(i*0.06)+'s';
    card.innerHTML='<div class="file-thumb">'+thumbHtml+playOverlay+'</div>'
      +'<div class="file-body">'
      +'<div class="file-name">'+(f.filename||'Unknown')+'</div>'
      +(f.info?'<div class="file-info">'+f.info+'</div>':'')
      +'<div class="file-actions">'
      +'<a class="btn-dl" href="'+(f.download_link||'#')+'" target="_blank" rel="noopener">&#8595; Download</a>'
      +playBtn
      +'</div></div>';
    grid.appendChild(card);
  });
  section.classList.add('show');
  section.scrollIntoView({behavior:'smooth',block:'start'});
}
function openModal(src){var modal=document.getElementById('videoModal');var video=document.getElementById('modalVideo');video.src=src;modal.classList.add('open');video.play().catch(function(){});}
function closeModal(e,force){if(force||(e&&e.target===document.getElementById('videoModal'))){var video=document.getElementById('modalVideo');video.pause();video.src='';document.getElementById('videoModal').classList.remove('open');}}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal(null,true);});
document.getElementById('tbUrl').addEventListener('keydown',function(e){if(e.key==='Enter')doFetch();});
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const p   = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }});
    }

    if (p === '/api/tiktok')  return handleTikTok(url);
    if (p === '/api/terabox') return handleTerabox(url);
    if (p === '/tiktok')      return new Response(PAGE_TIKTOK,  { headers: HTML_HEADERS });
    if (p === '/terabox')     return new Response(PAGE_TERABOX, { headers: HTML_HEADERS });

    return new Response(PAGE_HOME, { headers: HTML_HEADERS });
  },
};

async function handleTikTok(url) {
  const H = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=UTF-8' };
  const videoUrl = url.searchParams.get('url');
  if (!videoUrl) return new Response(JSON.stringify({ code: -1, msg: 'Parameter url wajib diisi' }), { status: 400, headers: H });
  try {
    const res = await fetch('https://tikwm.com/api/?hd=1&url=' + encodeURIComponent(videoUrl), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://tikwm.com/',
      },
      cf: { cacheEverything: true, cacheTtl: 300 },
    });
    if (!res.ok) throw new Error('Upstream HTTP ' + res.status);
    const data = await res.json();
    return new Response(JSON.stringify(data), { headers: { ...H, 'Cache-Control': 'public, max-age=300' } });
  } catch (err) {
    return new Response(JSON.stringify({ code: -1, msg: 'Gagal: ' + err.message }), { status: 502, headers: H });
  }
}

async function handleTerabox(url) {
  const H   = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=UTF-8' };
  const tgt = url.searchParams.get('url');
  const srv = url.searchParams.get('server') || '1';
  if (!tgt) return new Response(JSON.stringify({ error: 'No URL' }), { status: 400, headers: H });
  try {
    let files = [];
    if (srv === '1') {
      const r = await fetch('https://api.playterabox.com/api/proxy?secret=pk_8shhnbrz4sa0vkjvcs000lm&url=' + encodeURIComponent(tgt), {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36' }
      });
      if (!r.ok) throw new Error('Server 1 HTTP ' + r.status);
      const j = await r.json();
      if (j.status === 'success' && Array.isArray(j.list)) {
        files = j.list.filter(f => f.is_dir === '0').map(f => ({
          filename: f.name || 'Unknown',
          thumbnail: f.thumbnail || '',
          info: [f.size_formatted, f.quality].filter(Boolean).join(' · '),
          download_link: f.fast_download_link || f.download_link || '',
          play_link: f.type === 'video' ? (f.stream_url || f.download_link || null) : null,
        }));
      }
    } else {
      const r = await fetch('https://api.sonzaix.indevs.in/terabox?url=' + encodeURIComponent(tgt), {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/110.0.0.0 Safari/537.36' }
      });
      if (!r.ok) throw new Error('Server 2 HTTP ' + r.status);
      const j = await r.json();
      if (j.files && Array.isArray(j.files)) {
        files = j.files.map(f => ({
          filename: f.filename || 'Unknown',
          thumbnail: f.thumbnail || '',
          info: f.size || '',
          download_link: f.download_link || '',
          play_link: /\.(mp4|mkv|webm|mov|avi|flv)$/i.test(f.filename || '') ? f.download_link : null,
        }));
      }
    }
    return new Response(JSON.stringify({ files }), { headers: { ...H, 'Cache-Control': 'no-store' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'API Error', details: err.message }), { status: 500, headers: H });
  }
}
