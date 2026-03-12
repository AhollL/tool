/**
 * CLOUDFLARE PAGES ADVANCED WORKER
 * Upload file ini dengan nama: _worker.js
 */

const HTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Generator Streaming & Download Terabox</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-base: #050509;
            --glass-panel: rgba(20, 20, 35, 0.75); 
            --glass-border: rgba(255, 255, 255, 0.08);
            --input-bg: rgba(0, 0, 0, 0.4); 
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            --text-main: #ffffff; 
            --text-muted: #9ca3af; 
            --success: #10b981;
            --radius-xl: 24px; 
            --radius-lg: 16px; 
            --radius-md: 12px;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        /* --- FIX BLINKING/SCROLL ISSUE --- */
        body {
            margin: 0;
            background-color: var(--bg-base);
            color: var(--text-main);
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow-x: hidden;
        }

        /* Background ditaruh di pseudo-element agar smooth & tidak repaint saat scroll */
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.15) 0px, transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
                radial-gradient(circle at 50% 90%, rgba(6, 182, 212, 0.15) 0px, transparent 50%);
            pointer-events: none;
        }

        /* --- NAVBAR --- */
        .navbar {
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(5, 5, 9, 0.6);
            border-bottom: 1px solid var(--glass-border);
        }
        
        .brand {
            font-weight: 800;
            font-size: 20px;
            letter-spacing: -0.5px;
            background: linear-gradient(to right, #fff, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 30px 20px;
            flex: 1; /* Agar footer terdorong ke bawah */
            width: 100%;
        }

        /* --- HERO PANEL --- */
        .hero-panel {
            background: var(--glass-panel);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-xl);
            padding: 25px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4);
            margin-bottom: 40px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .panel-header { margin-bottom: 20px; text-align: center; }
        .panel-subtitle { font-size: 15px; font-weight: 500; color: #a8a8b3; }

        /* INPUTS */
        .input-group { position: relative; margin-bottom: 15px; }
        .input-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--text-muted); transition: 0.3s; z-index: 2; pointer-events: none; }
        
        input#url {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: 16px 20px 16px 50px;
            color: white;
            font-size: 14px;
            font-family: 'Outfit', sans-serif;
            transition: all 0.3s;
        }
        input#url:focus { outline: none; border-color: #818cf8; background: rgba(0,0,0,0.6); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }

        /* SERVER SELECT */
        .server-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: 12px 18px;
            margin-bottom: 20px;
        }
        .server-label { font-size: 13px; color: #d1d5db; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .server-icon { width: 16px; height: 16px; fill: var(--text-muted); }
        .select-wrapper { position: relative; min-width: 140px; }
        select.server-select {
            appearance: none;
            width: 100%;
            background: transparent;
            border: none;
            color: #60a5fa;
            font-family: inherit;
            font-size: 13px;
            font-weight: 600;
            padding-right: 20px;
            cursor: pointer;
            outline: none;
            text-align: right;
            direction: rtl;
        }
        .select-arrow { position: absolute; right: 0; top: 50%; transform: translateY(-50%); pointer-events: none; width: 10px; height: 10px; fill: #60a5fa; }
        select option { background: #0f172a; color: white; direction: ltr; }

        /* BUTTON */
        button#btn {
            width: 100%;
            background: var(--primary-gradient);
            border: none;
            padding: 16px;
            border-radius: var(--radius-lg);
            color: white;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 8px 20px -5px rgba(99, 102, 241, 0.3);
            display: flex; align-items: center; justify-content: center; gap: 10px;
            text-transform: uppercase;
        }
        button#btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        button#btn:disabled { opacity: 0.7; cursor: wait; transform: none; }

        /* RESULTS */
        #results { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        @media (min-width: 768px) { #results { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
        
        .card {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            overflow: hidden;
            display: flex; flex-direction: column;
            transition: transform 0.3s;
            position: relative;
        }
        .card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.06); }
        
        .thumb-box { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; overflow: hidden; cursor: pointer; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.5s; }
        .play-icon {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 32px; height: 32px; background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
            border-radius: 50%; border: 1px solid rgba(255,255,255,0.5);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 12px;
        }

        .card-body { padding: 12px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; }
        .file-title { font-size: 12px; font-weight: 500; line-height: 1.4; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 34px; color: #f3f4f6; }
        .badge { display: inline-block; font-size: 9px; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); margin-bottom: 10px; }
        
        .btn-download {
            display: block; width: 100%; padding: 8px 0;
            background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
            border-radius: 8px; color: white; text-align: center; text-decoration: none;
            font-size: 11px; font-weight: 600; text-transform: uppercase; transition: 0.2s;
        }
        .btn-download:hover { background: var(--success); border-color: var(--success); color: #fff; }

        /* FOOTER */
        .footer {
            margin-top: auto;
            border-top: 1px solid var(--glass-border);
            background: rgba(5, 5, 9, 0.8);
            backdrop-filter: blur(20px);
            padding: 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
        }
        
        .tech-support-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: #fff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            transition: all 0.3s ease;
        }
        
        .tech-support-btn:hover {
            background: rgba(41, 182, 246, 0.15); /* Telegram Blue Hint */
            border-color: #29b6f6;
            transform: translateY(-2px);
        }
        
        .telegram-logo {
            width: 20px;
            height: 20px;
            fill: #29b6f6; /* Telegram Official Blue */
        }

        /* MODAL & STATUS */
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .modal.active { display: flex; animation: fadeIn 0.2s; }
        .video-wrapper { width: 95%; max-width: 800px; position: relative; border-radius: 16px; overflow: hidden; background: #000; border: 1px solid var(--glass-border); }
        video { width: 100%; display: block; max-height: 80vh; }
        .close-modal { position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.1); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; z-index: 2; font-size: 16px; display:flex; align-items:center; justify-content:center;}
        #status { text-align: center; margin: 20px 0; color: #a855f7; display: none; font-size: 13px; font-weight: 500; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
</head>
<body>
    <nav class="navbar"><div class="brand">Terabox Generator</div></nav>
    
    <div class="container">
        <div class="hero-panel">
            <div class="panel-header"><div class="panel-subtitle">Generate & Stream Fast</div></div>
            <div class="input-group">
                <input type="text" id="url" placeholder="Tempel link Terabox di sini..." autocomplete="off">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <div class="server-row">
                <div class="server-label">
                    <svg class="server-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    Pilih Server
                </div>
                <div class="select-wrapper">
                    <select id="serverSelect" class="server-select"><option value="1">Server 1 (Primary)</option><option value="2">Server 2 (Alt)</option></select>
                    <svg class="select-arrow" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                </div>
            </div>
            <button id="btn"><span>DAPATKAN FILE</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></button>
        </div>
        <div id="status">Sedang memproses permintaan...</div>
        <div id="results"></div>
    </div>

    <footer class="footer">
        <a href="https://t.me/imediafairy" target="_blank" class="tech-support-btn">
            Technical Support
            <svg class="telegram-logo" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
        </a>
    </footer>

    <div id="videoModal" class="modal">
        <div class="video-wrapper">
            <button class="close-modal" id="closeModal">✕</button>
            <video id="player" controls controlsList="nodownload" playsinline></video>
        </div>
    </div>

    <script>
        const btn = document.getElementById('btn'), results = document.getElementById('results'), status = document.getElementById('status'), modal = document.getElementById('videoModal'), player = document.getElementById('player'), closeModal = document.getElementById('closeModal'), serverSelect = document.getElementById('serverSelect');
        btn.onclick = async () => {
            const link = document.getElementById('url').value.trim();
            const server = serverSelect.value;
            if(!link) { alert("Mohon masukkan link Terabox."); return; }
            btn.disabled = true; const originalBtnText = btn.innerHTML; btn.innerHTML = '<span>MEMPROSES...</span>'; status.style.display = 'block'; results.innerHTML = '';
            try {
                const response = await fetch('/api?url=' + encodeURIComponent(link) + '&server=' + server);
                const data = await response.json();
                if(data.files && data.files.length > 0) {
                    data.files.forEach(file => {
                        const card = document.createElement('div'); card.className = 'card';
                        let mediaHTML = '<div class="thumb-box"'; if (file.play_link) { mediaHTML += ' onclick="openVideo(\\'' + file.play_link + '\\')"'; } mediaHTML += '><img class="thumb-img" src="' + file.thumbnail + '" loading="lazy">'; if (file.play_link) { mediaHTML += '<div class="play-icon">▶</div>'; } mediaHTML += '</div>';
                        let metaInfo = ''; if (file.info) metaInfo = '<span class="badge">' + file.info + '</span>';
                        card.innerHTML = mediaHTML + '<div class="card-body"><div><div class="file-title">' + file.filename + '</div>' + metaInfo + '</div><a class="btn-download" href="' + file.download_link + '" target="_blank">Download</a></div>';
                        results.appendChild(card);
                    });
                } else { alert('File tidak ditemukan / Link Private.'); }
            } catch (e) { console.error(e); alert('Gagal terhubung ke server.'); } finally { btn.disabled = false; btn.innerHTML = originalBtnText; status.style.display = 'none'; }
        };
        function openVideo(url) { player.src = url; modal.classList.add('active'); player.play().catch(e => console.log("Autoplay blocked")); }
        function closeVideo() { modal.classList.remove('active'); player.pause(); setTimeout(() => { player.src = ""; }, 200); }
        closeModal.onclick = closeVideo; modal.onclick = (e) => { if(e.target === modal) closeVideo(); }; document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeVideo(); });
    </script>
</body>
</html>`;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const { pathname, searchParams } = url;

        if (pathname === "/" || pathname === "/index.html") {
            return new Response(HTML, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
        }

        if (pathname === "/api") {
            const targetUrl = searchParams.get("url");
            const serverType = searchParams.get("server") || "1";
            if (!targetUrl) return new Response(JSON.stringify({ error: "No URL" }), { status: 400 });

            try {
                let normalizedFiles = [];
                if (serverType === "1") {
                    // SERVER 1: PlayTerabox
                    const apiRes = await fetch(`https://api.playterabox.com/api/proxy?secret=pk_8shhnbrz4sa0vkjvcs000lm&url=${encodeURIComponent(targetUrl)}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36" } });
                    if (!apiRes.ok) throw new Error("Server 1 Error");
                    const result = await apiRes.json();
                    if (result.status === "success" && Array.isArray(result.list)) {
                        normalizedFiles = result.list.filter(file => file.is_dir === "0").map(file => {
                            const infoParts = [];
                            if (file.size_formatted) infoParts.push(file.size_formatted);
                            if (file.quality) infoParts.push(file.quality);
                            return {
                                filename: file.name,
                                thumbnail: file.thumbnail || 'https://via.placeholder.com/300x169/1a1f35/ffffff?text=No+Preview',
                                info: infoParts.join(' • '),
                                download_link: file.fast_download_link || file.download_link,
                                play_link: file.type === "video" ? (file.stream_url || file.download_link) : null
                            };
                        });
                    }
                } else {
                    // SERVER 2: Sonzaix
                    const apiRes = await fetch("https://api.sonzaix.indevs.in/terabox?url=" + encodeURIComponent(targetUrl), { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/110.0.0.0 Safari/537.36" } });
                    if (!apiRes.ok) throw new Error("Server 2 Error");
                    const result = await apiRes.json();
                    if (result.files && Array.isArray(result.files)) {
                        normalizedFiles = result.files.map(file => {
                            const isVideo = /\.(mp4|mkv|webm|mov|avi|flv)$/i.test(file.filename);
                            return {
                                filename: file.filename,
                                thumbnail: file.thumbnail || 'https://via.placeholder.com/300x169/1a1f35/ffffff?text=No+Preview',
                                info: file.size || 'Unknown',
                                download_link: file.download_link,
                                play_link: isVideo ? file.download_link : null
                            };
                        });
                    }
                }
                return new Response(JSON.stringify({ files: normalizedFiles }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
            } catch (err) {
                return new Response(JSON.stringify({ error: "API Error", details: err.message }), { status: 500 });
            }
        }
        return new Response("Not Found", { status: 404 });
    }
};