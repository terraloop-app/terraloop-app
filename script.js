/* ============================================================
   SISA+ — SCRIPT.JS
   Berisi seluruh JavaScript: Landing Page, Login, Web Customer,
   Web Admin, dan Login Handler
   (digabung dari beberapa blok <script> asli, urutan dipertahankan)
   ============================================================ */


        // Navbar Scroll Effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // BUGFIX: Tutup mobile menu saat link diklik (agar tidak menghalangi konten)
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // BUGFIX: Tutup mobile menu saat klik di luar area navbar
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navbar')) {
                navLinks.classList.remove('active');
            }
        });

        // BUGFIX: Tutup mobile menu saat touch di luar area navbar (touch devices)
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('#navbar')) {
                navLinks.classList.remove('active');
            }
        }, { passive: true });

        // Intersection Observer for Fade Up Animations
        const fadeElements = document.querySelectorAll('.fade-up');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));

        // Animated Counters
        const counters = document.querySelectorAll('.counter');
        let hasCounted = false;

        const countUp = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const speed = 200;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(countUp, 10);
                } else {
                    counter.innerText = target + (target > 100 ? '+' : '%');
                }
            });
        };

        const statsSection = document.querySelector('.stats-section');
        if(statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !hasCounted) {
                    countUp();
                    hasCounted = true;
                }
            });
            statsObserver.observe(statsSection);
        }

        // Carousel Functionality
        const caseStudyGrid = document.getElementById('caseStudyGrid');
        const cards = document.querySelectorAll('.cs-card');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicatorsContainer = document.getElementById('indicators');
        
        let currentSlide = 0;
        const totalSlides = cards.length;

        // Determine cards to show based on screen width
        const getCardsToShow = () => {
            if (window.innerWidth >= 1024) return 1;
            if (window.innerWidth >= 768) return 1;
            return 1;
        };

        let cardsToShow = getCardsToShow();

        // Create indicators
        const createIndicators = () => {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = `indicator-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(dot);
            }
        };

        // Update carousel position
        const updateCarousel = () => {
            const cardWidth = cards[0].offsetWidth;
            const offset = -currentSlide * cardWidth;
            caseStudyGrid.style.transform = `translateX(${offset}px)`;

            // Update buttons
            prevBtn.classList.toggle('disabled', currentSlide === 0);
            nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);

            // Update indicators
            document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };

        // Go to specific slide
        const goToSlide = (n) => {
            currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
            updateCarousel();
        };

        // Next slide
        const nextSlide = () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateCarousel();
            }
        };

        // Previous slide
        const prevSlide = () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        };

        // Button event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            cardsToShow = getCardsToShow();
            updateCarousel();
        });

        // Initialize carousel
        createIndicators();
        updateCarousel();

        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        caseStudyGrid.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        caseStudyGrid.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        };
    

// ===== next block =====


        // ============================================================================
        // 🚀 OPTIMIZATION: Cache Configuration & Smart Cache Manager
        // ============================================================================
        const CACHE_CONFIG = {
            pickups:   { maxAge: 60000,  key: 'adminPickupsCache' },      // 60 detik (diperpanjang dari 30s)
            orders:    { maxAge: 60000,  key: 'adminOrdersCache' },       // 60 detik (diperpanjang dari 30s)
            customers: { maxAge: 120000, key: 'adminCustomersCache' },    // 2 menit (diperpanjang dari 60s)
            claims:    { maxAge: 180000, key: 'adminClaimsCache' },       // 3 menit (diperpanjang dari 2 menit)
            products:  { maxAge: 120000, key: 'adminProductsCache' }      // ⬅️ BARU
        };

        class AdminCache {
            static get(type) {
                const config = CACHE_CONFIG[type];
                if (!config) return null;
                
                try {
                    const stored = localStorage.getItem(config.key);
                    if (!stored) return null;
                    
                    const { data, timestamp } = JSON.parse(stored);
                    const age = Date.now() - timestamp;
                    
                    if (age > config.maxAge) return null;
                    
                    console.log(`✅ Cache HIT untuk ${type} (age: ${Math.round(age/1000)}s)`);
                    return data;
                } catch (e) {
                    return null;
                }
            }
            
            static set(type, data) {
                const config = CACHE_CONFIG[type];
                if (!config) return;
                
                try {
                    const cacheData = { data: data, timestamp: Date.now() };
                    localStorage.setItem(config.key, JSON.stringify(cacheData));
                    console.log(`💾 Cache SET untuk ${type}`);
                } catch (e) {}
            }
            
            static clear(type) {
                const config = CACHE_CONFIG[type];
                if (config) localStorage.removeItem(config.key);
            }
        }

        // ============================================================
        // APPS SCRIPT URL
        // ============================================================
        const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrdFowsn3BL07YlsCV0_pwbz6H00C1cNHqxnKiNJaLj_HMVzQo3FtxI4fD9VLIWWwQ/exec";

        // ============================================================
        // TOAST NOTIFICATION
        // ============================================================
        function showToast(message, type) {
            type = type || 'info';
            let container = document.getElementById('sisa-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'sisa-toast-container';
                container.style.cssText = 'position:fixed;right:12px;bottom:80px;z-index:9999;';
                document.body.appendChild(container);
            }
            const el = document.createElement('div');
            el.textContent = message;
            el.style.cssText = 'margin-top:8px;padding:10px 14px;border-radius:10px;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.15);font-size:13px;font-weight:600;animation:fadeIn 0.3s ease;';
            if (type === 'error') el.style.background = '#ef4444';
            else if (type === 'success') el.style.background = '#10b981';
            else el.style.background = '#2563EB';
            container.appendChild(el);
            setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.4s'; setTimeout(() => el.remove(), 450); }, 3500);
        }

        // ============================================================
        // USER-SCOPED LOCALSTORAGE HELPERS
        // ============================================================
        function getUserSuffix() {
            try {
                const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
                return (login.telepon || login.nama || 'guest').toString().replace(/\s+/g, '_');
            } catch (e) { return 'guest'; }
        }
        function activePickupKey()  { return 'activePickup_' + getUserSuffix(); }
        function pickupHistoryKey() { return 'pickupHistory_' + getUserSuffix(); }
        function getActivePickup()  { return JSON.parse(localStorage.getItem(activePickupKey()) || 'null'); }
        function setActivePickup(obj) { localStorage.setItem(activePickupKey(), JSON.stringify(obj)); }
        function removeActivePickup() { localStorage.removeItem(activePickupKey()); }
        function getPickupHistory() { return JSON.parse(localStorage.getItem(pickupHistoryKey()) || '[]'); }
        function setPickupHistory(arr) { localStorage.setItem(pickupHistoryKey(), JSON.stringify(arr)); }
	
	// ===== LEVEL BADGE SVG (bentuk shield, warna beda per tier) =====
const LEVEL_BADGES = {
    'Perunggu':    { c1: '#D97757', c2: '#92400E' },
    'Silver':      { c1: '#CBD5E1', c2: '#64748B' },
    'Emas':        { c1: '#FDE68A', c2: '#D97706' },
    'Platinum':    { c1: '#E0E7FF', c2: '#4338CA' },
    'Diamond':     { c1: '#67E8F9', c2: '#0891B2' },
    'Emerald':     { c1: '#6EE7B7', c2: '#047857' },
    'Ruby':        { c1: '#FCA5A5', c2: '#B91C1C' },
    'Sapphire':    { c1: '#93C5FD', c2: '#1D4ED8' },
    'Master':      { c1: '#D8B4FE', c2: '#7E22CE' },
    'Grandmaster': { c1: '#FDE68A', c2: '#0A192F' }
};

// ===== RATE KONVERSI KOIN KE RUPIAH =====
const KOIN_TO_RUPIAH = 1; // 1 koin = Rp1
function formatKoinToRupiah(koin) {
    const rupiah = Number(koin || 0) * KOIN_TO_RUPIAH;
    return 'Rp ' + rupiah.toLocaleString('id-ID');
}
function updateHomeRupiahText(koin) {
    const el = document.getElementById('totalWasteRupiah');
    if (el) el.textContent = '= ' + formatKoinToRupiah(koin);
}
// ===== RATE KOIN PER KATEGORI =====
const WASTE_RATES = {
    organik: 200,   // koin per kg
    plastik: 1000   // koin per kg
};

function kgToKoin(category, kg) {
    const rate = WASTE_RATES[category] || 0;
    return Math.round(Number(kg || 0) * rate);
}
function getLevelBadgeSVG(levelName) {
    const colors = LEVEL_BADGES[levelName] || { c1: '#CBD5E1', c2: '#94A3B8' };
    const gradId = 'grad_' + levelName.replace(/\s/g, '');
    return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors.c1}"/>
                <stop offset="100%" stop-color="${colors.c2}"/>
            </linearGradient>
        </defs>
        <path d="M50 5 L90 22 V55 C90 75 72 90 50 97 C28 90 10 75 10 55 V22 Z"
              fill="url(#${gradId})" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <path d="M50 30 L62 42 L50 66 L38 42 Z" fill="rgba(255,255,255,0.85)"/>
    </svg>`;
}
        // ============================================================
        // STATUS NORMALIZE HELPERS
        // ============================================================
        function normalizeStatus(s) {
	if (!s && s !== 0) return '';
            s = String(s).toLowerCase().trim();
            const map = {
                'dijadwalkan':'scheduled', 'scheduled':'scheduled',
                'dijemput':'picked',       'picked':'picked',
                'diproses':'processed',    'processed':'processed',
                'selesai':'completed',     'completed':'completed'
            };
            return map[s] || s;
        }
        function sheetStatusFromClient(s) {
	if (!s && s !== 0) return '';
            s = String(s).toLowerCase().trim();
            const map = { 'scheduled':'dijadwalkan','picked':'dijemput','processed':'diproses','completed':'selesai','cancelled':'dibatalkan' };
            return map[s] || s;
        }
        function computeLevel(total) {
    if (total >= 1000000) return 'Grandmaster';
    if (total >= 500000)  return 'Master';
    if (total >= 350000)  return 'Sapphire';
    if (total >= 200000)  return 'Ruby';
    if (total >= 100000)  return 'Emerald';
    if (total >= 60000)   return 'Diamond';
    if (total >= 30000)   return 'Platinum';
    if (total >= 15000)   return 'Emas';
    if (total >= 5000)    return 'Silver';
    if (total > 0)         return 'Perunggu';
    return 'Belum Ada Level';
}

        // ============================================================
        // FAILED QUEUE
        // ============================================================
        const FAILED_QUEUE_KEY = 'sisa_failed_queue_v1';
        function enqueueFailed(payload) {
            try {
                const q = JSON.parse(localStorage.getItem(FAILED_QUEUE_KEY) || '[]');
                q.push({ payload, at: new Date().toISOString() });
                localStorage.setItem(FAILED_QUEUE_KEY, JSON.stringify(q));
            } catch (e) { console.error('enqueueFailed error', e); }
        }
        async function processFailedQueueOnce() {
            try {
                const q = JSON.parse(localStorage.getItem(FAILED_QUEUE_KEY) || '[]');
                if (!q || q.length === 0) return;
                try {
                    await sendToSheetNow(q[0].payload);
                    q.shift();
                    localStorage.setItem(FAILED_QUEUE_KEY, JSON.stringify(q));
                    showToast('Retry sukses', 'success');
                } catch (err) { /* try later */ }
            } catch (e) { console.error('processFailedQueueOnce error', e); }
        }
        setInterval(processFailedQueueOnce, 300000);

        function clientGenerateId(prefix) {
            return (prefix || 'ID') + '-' + Date.now() + '-' + Math.floor(Math.random() * 9000 + 1000);
        }

        // ============================================================
        // NETWORK BUSY STATE (hanya disable tombol schedule/order)
        // ============================================================
        function setNetworkBusy(isBusy) {
            // Jangan disable semua tombol — hanya disable tombol submit yang relevan
        }

        // ============================================================
        // SEND TO SHEET
        // ============================================================
        async function sendToSheetNow(data, opts) {
            if (!data || !data.type) throw new Error('Missing data.type');
            if (data.berat !== undefined) data.berat = Number(String(data.berat).replace(/[^0-9.-]+/g, '')) || 0;
            if (data.total !== undefined) data.total = Number(String(data.total).replace(/[^0-9.-]+/g, '')) || 0;
            if (data.totalLimbah !== undefined) data.totalLimbah = Number(String(data.totalLimbah).replace(/[^0-9.-]+/g, '')) || 0;
            if (data.type === 'pickup' && !data.PickupID) data.PickupID = clientGenerateId('P');
            if (data.type === 'order'  && !data.OrderID)  data.OrderID  = clientGenerateId('O');
            if (data.type === 'claim'  && !data.ClaimID)  data.ClaimID  = clientGenerateId('CL');

            // PATCH: Kirim sebagai form-urlencoded TANPA custom header
            // Google Apps Script menerima e.parameter secara otomatis dari form-urlencoded
            // Tidak pakai mode:'no-cors' agar response bisa dibaca untuk error handling
            const params = new URLSearchParams();
            Object.keys(data).forEach(k => {
                if (data[k] !== undefined && data[k] !== null) {
                    params.append(k, String(data[k]));
                }
            });

            let res;
            try {
                // Coba dengan cors dulu (jika dibuka dari server/hosting)
                res = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: params.toString(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                if (res && res.ok) {
                    try {
                        const json = await res.json();
                        console.log('📥 GAS response:', json);
                        if (json && json.success === false) {
                            console.error('GAS error:', json.error);
                        }
                    } catch(e) { /* response tidak bisa dibaca, tapi data sudah terkirim */ }
                }
            } catch (corsErr) {
                // Fallback: jika CORS error (misal buka dari file://), pakai no-cors
                console.warn('CORS gagal, fallback ke no-cors:', corsErr.message);
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: params.toString(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            }
            // FIX: balikin ID yang barusan digenerate/dipakai, supaya caller (schedulePickup dkk)
            // bisa nyimpen ID itu ke localStorage dan dipakai buat sync status yang akurat.
            return {
                success: true,
                pickupID: data.PickupID,
                orderID:  data.OrderID,
                claimID:  data.ClaimID
            };
        }

        async function sendToSheet(data) {
            if (!data || !data.type) return null;
            console.log('📤 Sending to Apps Script:', data);
            try {
                const result = await sendToSheetNow(data);
                return result;
            } catch (err) {
                console.error('sendToSheet failed', err);
                enqueueFailed(data);
                return { success: false, error: err.toString() };
            }
        }

        async function sendOrder(order) {
            const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
            let totalPrice = 0;
            if (order.price) {
                const match = String(order.price).match(/Rp?\s*([0-9.]+)/i);
                if (match) totalPrice = Number(match[1].replace(/\./g, '')) || 0;
            }
            const payload = {
                type: 'order',
                nama: login.nama || '',
                namaToko: login.toko || '',
                alamat: login.alamat || '',
                items: order.name || '',
                total: totalPrice * (order.quantity || 1),
                quantity: order.quantity || 1,
                status: 'pending',
                waktu: new Date().toISOString()
            };
            return await sendToSheet(payload);
        }

        function sendCustomer() {
            const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
            if (!login || !login.nama) return null;
            const history = getPickupHistory();
            const total = history.reduce((s, it) => s + (it.koin != null ? Number(it.koin) : kgToKoin(it.category || 'organik', it.weight)), 0);
            return sendToSheet({
                type: 'customer',
                nama: login.nama,
                namaToko: login.toko || '',
                telepon: login.telepon || '',
                alamat: login.alamat || '',
                totalLimbah: total,
                level: computeLevel(total)
            });
        }

        // ============================================================
        // INIT CUSTOMER — dipanggil setelah login
        // ============================================================
        function updateProfileStats() {
            try {
                var login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
                var history = getPickupHistory ? getPickupHistory() : [];
   	  	var localTotal = history.reduce(function(s,i){ return s + (i.koin != null ? Number(i.koin) : kgToKoin(i.category || 'organik', i.weight)); }, 0);
                var serverTotal = Number(localStorage.getItem('sisaCachedTotal_' + getUserSuffix()) || 0);
                var total = Math.max(localTotal, serverTotal);
                var level = computeLevel(total);

                var elKg = document.getElementById('profileTotalKg');
                var elPick = document.getElementById('profileTotalPickup');
                var elLvl = document.getElementById('profileLevel');
                var elBadge = document.getElementById('profileLevelBadge');
                var elHeaderBadge = document.getElementById('headerLevelBadge');
                if (elKg) elKg.textContent = total;
                if (elPick) elPick.textContent = history.length;
                if (elLvl) elLvl.textContent = level;
                if (elBadge) elBadge.textContent = level;
                if (elHeaderBadge) elHeaderBadge.textContent = '⭐ ' + level;
            } catch(e) {}
        }

        function initCustomer() {
            updateStats();
            updateLevel();
            updateHistory();
            updateTrackingStatus();
            updateActivePickupStatus();
    	    loadSimartProducts();
            loadNewsFromServer();
            syncPickupStatusWithServer();
            syncPickupStatusWithServer();
            fetchCustomerTotalFromServer();
            syncOrderStatusFromServer();
            if (!window.sisaPickupSyncInterval) {
                window.sisaPickupSyncInterval = setInterval(syncPickupStatusWithServer, 5000);
            }
            if (!window.sisaOrderSyncInterval) {
                window.sisaOrderSyncInterval = setInterval(syncOrderStatusFromServer, 5000);
            }
            // Refresh total limbah dari server setiap 60 detik
            if (!window.sisaCustomerTotalInterval) {
                window.sisaCustomerTotalInterval = setInterval(fetchCustomerTotalFromServer, 60000);
            }
        }

        // ============================================================
        // SYNC ORDER STATUS DARI SERVER — update home activity & simart
        // ============================================================
        async function syncOrderStatusFromServer() {
            try {
                const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
                if (!login.nama) return;
                const resp = await fetch(APPS_SCRIPT_URL + '?type=list_orders&t=' + Date.now());
                if (!resp.ok) return;
                const data = await resp.json();
                const allOrders = (data && data.orders) ? data.orders : [];
                const lNama = login.nama.toLowerCase().trim();
                const myOrders = allOrders.filter(o => (o.Nama || o.nama || '').toLowerCase().trim() === lNama);

                // DEBUG: tampilkan status terbaru dari server di console
                console.log('🔄 syncOrder: total orders di server=' + allOrders.length + 
                    ', milik saya=' + myOrders.length + 
                    ', nama dicari="' + lNama + '"');
                if (myOrders.length > 0) {
                    myOrders.forEach(o => {
                        console.log('  → Order:', (o.OrderID||o.id), '| Status:', (o.Status||o.status), '| Items:', (o.Items||o.items));
                    });
                } else if (allOrders.length > 0) {
                    console.log('  ⚠️ Ada orders tapi tidak ada yang cocok nama "' + lNama + '"');
                    console.log('  Nama di sheet:', allOrders.slice(0,3).map(o => '"'+(o.Nama||o.nama)+'"').join(', '));
                }

                // Selalu update home activity
                updateHomeActivity(myOrders);

                // Selalu update myOrdersList
                const container = document.getElementById('myOrdersList');
                if (container) renderOrderStepTracker(container, myOrders);

                // Update jumlah pesanan di profil
                var elOrder = document.getElementById('profileTotalOrder');
                if (elOrder) elOrder.textContent = myOrders.length;

            } catch(e) { console.log('syncOrderStatusFromServer error:', e); }
        }

        // Ambil TotalLimbah customer dari Google Sheets dan cache di localStorage
        async function fetchCustomerTotalFromServer() {
            try {
                const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
                if (!login.nama) return;
                const resp = await fetch(APPS_SCRIPT_URL + '?type=list_customers&t=' + Date.now());
                if (!resp.ok) return;
                const data = await resp.json();
                const customers = (data && data.customers) ? data.customers : [];
                const lNama = login.nama.toLowerCase().trim();
                const me = customers.find(c => (c.Nama || c.nama || '').toLowerCase().trim() === lNama);
                if (me) {
                    const serverTotal = Number(me.TotalLimbah || me.totalLimbah || 0);
                    const cacheKey = 'sisaCachedTotal_' + getUserSuffix();
                    localStorage.setItem(cacheKey, String(serverTotal));
                    // Update level display if server total > local total
                    const history = getPickupHistory();
                    const localTotal = history.reduce((s,i) => s + (i.koin != null ? Number(i.koin) : kgToKoin(i.category || 'organik', i.weight)), 0);
                    if (serverTotal > localTotal) {
                        // Update hero value
                       const el = document.getElementById('totalWaste');
                        if (el) el.textContent = serverTotal;
                        updateHomeRupiahText(serverTotal);
                        updateLevelFromTotal(serverTotal);
                        updateLevelFromTotal(serverTotal);
                    }
                }
            } catch(e) { /* silent */ }
        }

        function updateLevel() {
    	const history = getPickupHistory();
    	const total   = history.reduce((sum, item) => sum + (item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight)), 0);
    	applyLevelUI(total);
	}

        function applyLevelUI(total) {
            const badgeEl      = document.getElementById('levelBadgeText');
            const progressBar  = document.getElementById('progressBar');
            const levelText    = document.getElementById('levelText');
            const levelNameEl  = document.getElementById('levelName');
            const levelProgEl  = document.getElementById('levelProgress');

            let level = 'Belum Ada Level', cls = 'none', progress = 0, text = 'Kumpulkan 1 kg untuk level Perunggu';
            if      (total >= 2500) { level='Grandmaster'; cls='diamond';  progress=100;                          text='Level Tertinggi! Total: '+total+' kg'; }
            else if (total >= 1800) { level='Master';      cls='diamond';  progress=((total-1800)/700)*100;       text=(2500-total)+' kg lagi → Grandmaster'; }
            else if (total >= 1300) { level='Sapphire';    cls='platinum'; progress=((total-1300)/500)*100;       text=(1800-total)+' kg lagi → Master'; }
            else if (total >= 900)  { level='Ruby';        cls='platinum'; progress=((total-900)/400)*100;        text=(1300-total)+' kg lagi → Sapphire'; }
            else if (total >= 600)  { level='Emerald';     cls='gold';     progress=((total-600)/300)*100;        text=(900-total)+' kg lagi → Ruby'; }
            else if (total >= 400)  { level='Diamond';     cls='diamond';  progress=((total-400)/200)*100;        text=(600-total)+' kg lagi → Emerald'; }
            else if (total >= 250)  { level='Platinum';    cls='platinum'; progress=((total-250)/150)*100;        text=(400-total)+' kg lagi → Diamond'; }
            else if (total >= 150)  { level='Emas';        cls='gold';     progress=((total-150)/100)*100;        text=(250-total)+' kg lagi → Platinum'; }
            else if (total >= 50)   { level='Silver';      cls='silver';   progress=((total-50)/100)*100;         text=(150-total)+' kg lagi → Emas'; }
            else if (total > 0)     { level='Perunggu';    cls='bronze';   progress=(total/50)*100;               text=(50-total)+' kg lagi → Silver'; }

            if (badgeEl)     { badgeEl.textContent = level; badgeEl.className = 'level-badge-text ' + cls; }
            if (progressBar) progressBar.style.width = progress + '%';
            if (levelText)   levelText.textContent = text;
            if (levelNameEl) levelNameEl.textContent = level;
            if (levelProgEl) levelProgEl.textContent = text;
        }

        // Update level UI dari total tertentu (untuk sync server)
        function updateLevelFromTotal(total) {
            applyLevelUI(total);
        }

        // ============================================================
        // SYNC PICKUP STATUS DARI SERVER — ambil status real dari Sheets
        // ============================================================
        async function syncPickupStatusWithServer() {
            try {
                const userSuffix  = getUserSuffix();
                const storageKey  = 'activePickup_' + userSuffix;
                const localPickup = JSON.parse(localStorage.getItem(storageKey) || 'null');
                const loginData   = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');

                // Harus ada login nama untuk bisa sync
                if (!loginData.nama) return;
                // Kalau tidak ada active pickup sama sekali, skip
                if (!localPickup) return;

                let serverPickup = null;

                // Selalu ambil list_pickups — paling reliable
                try {
                    const resp = await fetch(APPS_SCRIPT_URL + '?type=list_pickups&t=' + Date.now());
                    if (resp.ok) {
                        const d   = await resp.json();
                        const all = (d && d.pickups) ? d.pickups : [];
                        const lNama = loginData.nama.toLowerCase().trim();

                        // Cari by ID dulu (paling akurat)
                        if (localPickup.id) {
                            for (const p of all) {
                                const pid = (p.PickupID || p.pickupID || p.id || '').toString();
                                if (pid === localPickup.id.toString()) { serverPickup = p; break; }
                            }
                        }

                        // Kalau tidak ketemu by ID, cari by nama saja (ambil yang paling baru / status bukan selesai dulu)
                        if (!serverPickup) {
                            const byNama = all.filter(p => (p.Nama || p.nama || '').toLowerCase().trim() === lNama);
                            if (byNama.length > 0) {
                                // Coba cocokkan tanggal
                                const lDate = (localPickup.date || '').toString().substring(0, 10);
                                const byDate = byNama.filter(p => {
                                    const pDate = (p.Tanggal || p.tanggal || '').toString().substring(0, 10);
                                    return pDate === lDate;
                                });
                                if (byDate.length > 0) {
                                    serverPickup = byDate[byDate.length - 1]; // ambil yang paling bawah (terbaru)
                                } else {
                                    // Tidak cocok tanggal — ambil yang statusnya bukan selesai/completed
                                    const aktif = byNama.filter(p => {
                                        const s = (p.Status || p.status || '').toLowerCase();
                                        return s !== 'selesai' && s !== 'completed';
                                    });
                                    if (aktif.length > 0) serverPickup = aktif[aktif.length - 1];
                                    else serverPickup = byNama[byNama.length - 1]; // fallback ke yang terakhir
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log('syncPickupStatusWithServer fetch error:', e);
                    return;
                }

                if (!serverPickup) {
                    console.log('🔄 SYNC: tidak ada pickup cocok di server untuk', loginData.nama);
                    return;
                }

                // Update ID dan berat dari server
                const serverId    = serverPickup.PickupID || serverPickup.pickupID || serverPickup.id || '';
                const serverBerat = Number(serverPickup.Berat || serverPickup.berat || serverPickup['Berat (KG)'] || 0);

                if (serverId && localPickup.id !== serverId) localPickup.id = serverId;
                if (serverBerat > 0 && !localPickup.weight) localPickup.weight = serverBerat;

                const serverStatusRaw = (serverPickup.Status || serverPickup.status || '').toString().trim();
                const serverStatus    = normalizeStatus(serverStatusRaw);

                console.log('🔄 SYNC - Server raw:', serverStatusRaw, '→ normalized:', serverStatus, '| Local:', localPickup.status);

                // Update localStorage dan UI setiap kali ada perubahan status
                if (serverStatus && serverStatus !== localPickup.status) {
                    console.log('🎯 STATUS BERUBAH:', localPickup.status, '→', serverStatus);
                    localPickup.status = serverStatus;
                    localStorage.setItem(storageKey, JSON.stringify(localPickup));
                    updateTrackingStatus();
                    updateActivePickupStatus();
                    showToast('Status penjemputan diperbarui: ' + serverStatusRaw, 'success');
                } else if (serverStatus) {
                    // Status sama tapi tetap update localStorage supaya ID/berat tersimpan
                    localStorage.setItem(storageKey, JSON.stringify(localPickup));
                }

            // Jika completed — masukkan ke history
                if (serverStatus === 'completed') {
                    const beratFinal = Number(localPickup.weight || serverBerat || 0);
                    const history    = getPickupHistory();
                    const alreadyIn  = history.some(h =>
                        (h.id && localPickup.id && h.id === localPickup.id) ||
                        (h.date && h.date.toString().substring(0, 10) === (localPickup.date || '').toString().substring(0, 10))
                    );
                    if (!alreadyIn) {
                        const kategoriFinal = localPickup.category || serverPickup.Kategori || serverPickup.kategori || 'organik';  // ← BARU
                        const koinFinal = kgToKoin(kategoriFinal, beratFinal);                                                        // ← BARU
                        history.push({
                            id: localPickup.id || serverId || '',
                            date: localPickup.date,
                            weight: beratFinal,
                            category: kategoriFinal,   // ← BARU
                            koin: koinFinal,           // ← BARU
                            status: 'Selesai',
                            completedAt: new Date().toISOString()
                        });
                        setPickupHistory(history);
                        updateStats();
                        updateLevel();
                        updateHistory();
                        sendCustomer();
                        showToast('✅ Penjemputan selesai! Kontribusi Anda bertambah ' + beratFinal + ' kg (+' + koinFinal + ' koin)', 'success');   // ← diubah, tambah info koin
                    }
                    localStorage.removeItem(storageKey);
                    updateActivePickupStatus();
                    updateTrackingStatus();
                }

                // Jika dibatalkan oleh admin — clear active pickup
                if (serverStatus === 'cancelled') {
                    localStorage.removeItem(storageKey);
                    updateActivePickupStatus();
                    updateTrackingStatus();
                    showToast('Penjemputan Anda telah dibatalkan oleh admin', 'info');
                }

            } catch (error) {
                console.log('syncPickupStatusWithServer error:', error);
            }
        }

        // ============================================================
        // UPDATE STATS
        // ============================================================
       function updateStats() {
    const history = getPickupHistory();
    const totalKg   = history.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);   // ← nama diganti totalKg
    const totalKoin = history.reduce((sum, item) => sum + (item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight)), 0);  // ← BARU

const el = document.getElementById('totalWaste');
    if (el) el.textContent = totalKoin;   // ← pakai totalKoin, bukan total lagi
    updateHomeRupiahText(totalKoin);

    const level = computeLevel(totalKoin);                            // ← BARU, pakai totalKoin
    const iconEl = document.getElementById('levelIconHome');           // ← BARU
    if (iconEl) iconEl.innerHTML = getLevelBadgeSVG(level);             // ← BARU

    const now   = new Date();
    const month = now.getMonth(), year = now.getFullYear();
    const monthly = history.filter(item => {
        const d = new Date(item.completedAt || item.date);
        return d.getMonth() === month && d.getFullYear() === year;
    });
    const mpEl = document.getElementById('monthlyPickups');
    const mkEl = document.getElementById('monthlyKg');
    if (mpEl) mpEl.textContent = monthly.length;
    if (mkEl) mkEl.textContent = monthly.reduce((s, i) => s + (Number(i.weight) || 0), 0);

    const impactCarbon     = document.getElementById('impactCarbon');
    const impactTrees      = document.getElementById('impactTrees');
    const impactProtein    = document.getElementById('impactProtein');
    const impactFertilizer = document.getElementById('impactFertilizer');
    if (impactCarbon)     impactCarbon.textContent     = Math.round(totalKg * 0.5) + ' kg';    // ← ganti total → totalKg
    if (impactTrees)      impactTrees.textContent      = Math.round(totalKg * 0.25);           // ← ganti total → totalKg
    if (impactProtein)    impactProtein.textContent    = Math.round(totalKg * 0.3) + ' kg';    // ← ganti total → totalKg
    if (impactFertilizer) impactFertilizer.textContent = Math.round(totalKg * 0.7) + ' kg';    // ← ganti total → totalKg
}

        // ============================================================
        // UPDATE HISTORY
        // ============================================================
        function updateHistory() {
            const history   = getPickupHistory();
            const container = document.getElementById('historyContainer');
            if (!container) return;
            if (history.length === 0) {
                container.innerHTML = '<div class="status-desc" style="text-align:center;padding:20px 0">Belum ada riwayat penjemputan</div>';
                return;
            }
            container.innerHTML = history.map(item => `
                <div class="history-item">
                    <div class="history-header">
                        <div class="history-date">${item.date}</div>
                        <div class="history-weight">${item.weight} kg</div>
                    </div>
                    <div class="history-status">${item.status}</div>
                </div>
            `).join('');
        }

        // ============================================================
        // UPDATE TRACKING STATUS (step tracker di SiTrack)
        // ============================================================
        function updateTrackingStatus() {
            const activePickup = getActivePickup();
            for (let i = 1; i <= 4; i++) {
                const item = document.getElementById('stepItem' + i);
                if (item) item.className = 'step-item';
            }
            document.getElementById('statusDesc1').textContent = 'Belum ada jadwal';
            document.getElementById('statusDesc2').textContent = 'Menunggu penjemputan';
            document.getElementById('statusDesc3').textContent = 'Menunggu diproses';
            document.getElementById('statusDesc4').textContent = 'Belum selesai';
            if (!activePickup) return;

            const status = normalizeStatus(activePickup.status || 'scheduled');
            const berat  = activePickup.weight || '-';
            const tgl    = activePickup.date   || '-';

            if (status === 'scheduled') {
                document.getElementById('stepItem1').className = 'step-item step-active';
                document.getElementById('statusDesc1').textContent = `Tanggal: ${tgl}`;
            } else if (status === 'picked') {
                document.getElementById('stepItem1').className = 'step-item step-done';
                document.getElementById('stepItem2').className = 'step-item step-active';
                document.getElementById('statusDesc1').textContent = `Tanggal: ${tgl}`;
                document.getElementById('statusDesc2').textContent = `Berat: ${berat} kg`;
            } else if (status === 'processed') {
                document.getElementById('stepItem1').className = 'step-item step-done';
                document.getElementById('stepItem2').className = 'step-item step-done';
                document.getElementById('stepItem3').className = 'step-item step-active';
                document.getElementById('statusDesc1').textContent = `Tanggal: ${tgl}`;
                document.getElementById('statusDesc2').textContent = `Berat: ${berat} kg`;
                document.getElementById('statusDesc3').textContent = 'Sedang diproses';
            } else if (status === 'completed') {
                document.getElementById('stepItem1').className = 'step-item step-done';
                document.getElementById('stepItem2').className = 'step-item step-done';
                document.getElementById('stepItem3').className = 'step-item step-done';
                document.getElementById('stepItem4').className = 'step-item step-active'; // aktif di step terakhir = selesai
                document.getElementById('statusDesc1').textContent = `Tanggal: ${tgl}`;
                document.getElementById('statusDesc2').textContent = `Berat: ${berat} kg`;
                document.getElementById('statusDesc3').textContent = 'Proses selesai';
                document.getElementById('statusDesc4').textContent = 'Kontribusi tercatat ✓';
            } else if (status === 'cancelled') {
                document.getElementById('stepItem1').className = 'step-item';
                document.getElementById('statusDesc1').textContent = '❌ Penjemputan dibatalkan';
            }
        }

        // ============================================================
        // UPDATE ACTIVE PICKUP STATUS (di SiPick)
        // ============================================================
        function updateActivePickupStatus() {
            const activePickup  = getActivePickup();
            const container     = document.getElementById('activePickupStatus');
            const cancelSection = document.getElementById('cancelPickupSection');
            if (!activePickup) {
                container.innerHTML = '<div class="status-desc" style="text-align:center;padding:20px 0">Belum ada penjemputan aktif</div>';
                cancelSection.style.display = 'none';
                return;
            }
            const st = normalizeStatus(activePickup.status || 'scheduled');
          // SVG Icons (warna mengikuti info.color agar kontras dengan background)
const svgIcons = {
    scheduled: (color) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="1.5" fill="${color}"/></svg>`,
    picked: (color) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    processed: (color) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    completed: (color) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    cancelled: (color) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};

const statusMap = {
     'scheduled':  { label:'Dijadwalkan',     bg:'#0868e3', color:'#ffffff', iconKey:'scheduled' },
     'picked':     { label:'Sedang Dijemput',  bg:'#ffc900', color:'#373737', iconKey:'picked' },
     'processed':  { label:'Sedang Diproses',  bg:'#b110ff', color:'#ffffff', iconKey:'processed' },
     'completed':  { label:'Selesai',           bg:'#58ec3d', color:'#373737', iconKey:'completed' },
     'cancelled':  { label:'Dibatalkan',        bg:'#ea000b', color:'#ffffff', iconKey:'cancelled' }
 };
            const info = statusMap[st] || statusMap['scheduled'];
            const iconSvg = svgIcons[info.iconKey](info.color);
container.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;padding:14px 0;">
        <div style="width:48px;height:48px;border-radius:14px;background:${info.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iconSvg}</div>
        <div style="flex:1;">
            <div style="font-size:15px;font-weight:700;color:${info.color};margin-bottom:4px;">${info.label}</div>
            <div style="font-size:12px;color:#64748b;">Tanggal: ${activePickup.date} | Berat: ${activePickup.weight || '-'} kg</div>
        </div>
        <span style="display:inline-block;padding:5px 12px;border-radius:20px;background:${info.bg};color:${info.color};font-size:12px;font-weight:600;">${info.label}</span>
    </div>
`;
            cancelSection.style.display = (st === 'scheduled') ? 'block' : 'none';
        }

        // ============================================================
        // CANCEL PICKUP
        // ============================================================
        function cancelPickup() {
            if (!confirm('Apakah Anda yakin ingin membatalkan penjemputan ini?')) return;
            const activePickup = getActivePickup();
            // Kirim cancel ke server jika ada ID
            if (activePickup && activePickup.id) {
                sendToSheet({
                    type: 'update_pickup',
                    pickupId: activePickup.id,
                    id: activePickup.id,
                    status: 'dibatalkan'
                }).catch(e => console.log('Cancel pickup server error:', e));
            }
            removeActivePickup();
            showToast('Penjemputan berhasil dibatalkan', 'info');
            updateTrackingStatus();
            updateActivePickupStatus();
        }

        // ============================================================
        // SCHEDULE PICKUP — dengan loading state yang proper
        // ============================================================
	
	function selectWasteCategory(category, cardEl) {
    // Cek apakah card yang diklik sudah terpilih
    const isAlreadySelected = cardEl.classList.contains('selected');
    
    if (isAlreadySelected) {
        // Jika sudah terpilih, batalkan pilihan (deselect)
        cardEl.classList.remove('selected');
        document.getElementById('pickupCategory').value = '';
    } else {
        // Jika belum terpilih, pilih card ini
        document.querySelectorAll('.waste-category-card').forEach(function(c) {
            c.classList.remove('selected');
        });
        cardEl.classList.add('selected');
        document.getElementById('pickupCategory').value = category;
    }
}
       async function schedulePickup() {
    const activePickup = getActivePickup();
    if (activePickup && activePickup.status !== 'completed') {
        showToast('Penjemputan sebelumnya masih berlangsung', 'error');
        return;
    }

    const date     = document.getElementById('pickupDate').value;
    const weight   = parseInt(document.getElementById('pickupWeight').value);
    const category = document.getElementById('pickupCategory').value;   // ← BARU

    if (!category) {                                                     // ← BARU
        showToast('Mohon pilih kategori sampah terlebih dahulu', 'error');
        return;
    }
    if (!date || !weight || weight < 1) {
        showToast('Mohon lengkapi tanggal dan berat sampah (minimal 1 kg)', 'error');
        return;
    }

            const loginData = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
            const btn       = document.querySelector('#sipickPage .btn-primary');

           // LOADING STATE — animasi logo muncul di tengah sebagai loading
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Mengirim...';
            }
            showScheduleLoading();

            const payload = {
                type: 'pickup',
                nama: loginData.nama,
                namaToko: loginData.toko,
                tanggal: date,
                berat: weight,
		kategori: category,
                status: 'scheduled',
                waktu: new Date().toISOString()
            };

            let sendResult = null;
            try {
                sendResult = await sendToSheet(payload);
                console.log('📤 Schedule result:', sendResult);
            } catch (e) {
                console.error('sendToSheet error', e);
                hideScheduleOverlay();
                if (btn) { btn.disabled = false; btn.textContent = 'Jadwalkan Sekarang'; }
                showToast('Gagal menjadwalkan penjemputan: ' + (e.message || e), 'error');
                return;
            }

            if (sendResult && !sendResult.success && !sendResult.pickupID) {
                hideScheduleOverlay();
                if (btn) { btn.disabled = false; btn.textContent = 'Jadwalkan Sekarang'; }
                showToast('Gagal mengirim data ke server. Coba lagi.', 'error');
                return;
            }

           const pickup = { date, weight, category, status: 'scheduled', createdAt: new Date().toISOString() };  // ← category ditambahkan
    if (sendResult && sendResult.pickupID) pickup.id = sendResult.pickupID;
    setActivePickup(pickup);

    document.getElementById('pickupDate').value   = '';
    document.getElementById('pickupWeight').value = '';
    document.querySelectorAll('.waste-category-card').forEach(function(c){ c.classList.remove('selected'); }); // ← BARU, reset tampilan card
    document.getElementById('pickupCategory').value = '';                                                       // ← BARU, reset hidden input

            // SUCCESS STATE
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Jadwalkan Sekarang';
            }

            showScheduleSuccess('Penjemputan Dijadwalkan!', 'Tim kami akan segera menjemput sampahmu.');
            updateTrackingStatus();
            updateActivePickupStatus();

            // Optimistic UI: step 1 langsung centang, step 2 langsung blink "menunggu"
            const step1El = document.getElementById('stepItem1');
            const step2El = document.getElementById('stepItem2');
            if (step1El) step1El.className = 'step-item step-done';
            if (step2El) step2El.className = 'step-item step-active step-waiting';
            const desc2El = document.getElementById('statusDesc2');
            if (desc2El) desc2El.textContent = 'Menunggu konfirmasi tim...';

            pushNotification('Penjemputan Dijadwalkan', 'Jadwal penjemputan sampahmu berhasil dibuat.');
            setTimeout(() => syncPickupStatusWithServer(), 500);
        }
const wasteDetailData = {
    organik: {
        name: 'Organik',
        items: ['Sisa makanan', 'Nasi & lauk sisa', 'Kulit buah', 'Sayur busuk/sisa potongan', 'Daun & ranting', 'Ampas kopi/teh']
    },
    plastik: {
        name: 'Plastik',
        items: ['Botol plastik (air mineral, minyak)', 'Gelas plastik', 'Kemasan sachet', 'Kantong/kresek plastik', 'Galon bekas', 'Tutup botol']
    }
};

function showWasteDetail(category) {
    const data = wasteDetailData[category];
    if (!data) return;
    document.getElementById('wasteModalTitle').textContent = data.name;
    document.getElementById('wasteModalImg').src = document.querySelector(`[data-category="${category}"] .wc-img`).src;
    document.getElementById('wasteModalList').innerHTML = data.items.map(i => `<div class="waste-modal-list-item">${i}</div>`).join('');
    document.getElementById('wasteModalOverlay').classList.add('active');
}

function closeWasteDetail(e) {
    if (e && e.target !== document.getElementById('wasteModalOverlay')) return;
    document.getElementById('wasteModalOverlay').classList.remove('active');
}

        // ============================================================
        // PAGE SWITCHING
		
        // ============================================================

		const SWIPE_PAGES = ['homePage', 'sipickPage', 'simartPage', 'sitrackPage'];

        function switchPage(pageId, navItem) {
            document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            if (navItem) {
    navItem.classList.add('active');
}
            document.querySelectorAll('.nav-home-circle svg path, .nav-home-circle svg polyline').forEach(el => {
                el.style.stroke = navItem && navItem.classList.contains('nav-home') ? '#fff' : '#1a1a2e';
            });
           // Saat buka SiMart: load pesanan dari server langsung
            if (pageId === 'simartPage') {
                loadSimartProducts();                     // ⬅️ TAMBAHKAN INI
                setTimeout(() => loadMyOrders(null), 200);
		loadBannersToSimart();
            }
           // Saat buka Home: refresh status pesanan terakhir
            if (pageId === 'homePage') {
                setTimeout(() => syncOrderStatusFromServer(), 300);
            }
            // Saat buka SiTrack: refresh status penjemputan & daftar pesanan
            if (pageId === 'sitrackPage') {
                updateTrackingStatus();
                updateActivePickupStatus();
                loadMyOrders(null);
                setTimeout(() => syncPickupStatusWithServer(), 200);
            }
            // Saat buka Profil: update stats
            if (pageId === 'profilePage') {
                setTimeout(() => updateProfileStats(), 100);
            }
           // Saat buka Berita: refresh daftar
            if (pageId === 'newsPage' && typeof renderNewsList === 'function') {
                renderNewsList();
            }
            // Saat buka Aktivitas Terakhir: refresh data
            if (pageId === 'activityPage') {
                syncOrderStatusFromServer();
            }
            // Saat buka Notifikasi: render daftar & tandai terbaca
            if (pageId === 'notifPage') {
                openNotifPanel();
            }
        }
		
		(function initSwipeNav() {
    const container = document.querySelector('#customerView .container');
    if (!container) return;
    let touchStartX = 0, touchStartY = 0;

    container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', function(e) {
        const diffX = e.changedTouches[0].screenX - touchStartX;
        const diffY = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(diffX) < 60 || Math.abs(diffX) < Math.abs(diffY)) return;

        const activePage = document.querySelector('.page-section.active');
        if (!activePage) return;
        const currentIndex = SWIPE_PAGES.indexOf(activePage.id);
        if (currentIndex === -1) return;

        let targetIndex = diffX < 0 ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex < 0 || targetIndex >= SWIPE_PAGES.length) return;

        const targetPageId = SWIPE_PAGES[targetIndex];
        const navBtn = document.querySelector(`.nav-item[onclick*="${targetPageId}"]`);
        switchPage(targetPageId, navBtn);
    }, { passive: true });
})();

        // ============================================================
        // REWARD PAGE
        // ============================================================
        function goToRewardPage() {
            switchPage('rewardPage', null);
            updateRewardPage();
        }
        function backToHome() {
            const homeBtn = document.querySelector('.nav-item.nav-home') || document.querySelector('.nav-item');
            switchPage('homePage', homeBtn);
        }

        // ============================================================
        // TUKAR KOIN & BELANJA DI MART (Reward Action Cards)
        // ============================================================
        function getKoinRedeemHistory() {
            try { return JSON.parse(localStorage.getItem('sisaKoinRedeemHistory_' + getUserSuffix()) || '[]'); }
            catch(e) { return []; }
        }
        function saveKoinRedeemHistory(arr) {
            localStorage.setItem('sisaKoinRedeemHistory_' + getUserSuffix(), JSON.stringify(arr));
        }
        function getSaldoKoinTersedia() {
            const history = getPickupHistory();
            const totalKoin = history.reduce((sum, item) => sum + (item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight)), 0);
            const totalDitukar = getKoinRedeemHistory().reduce((sum, r) => sum + Number(r.jumlah || 0), 0);
            return Math.max(totalKoin - totalDitukar, 0);
        }
        function tukarKoinKeUang() {
            const saldo = getSaldoKoinTersedia();
            if (saldo < 1) {
                showToast('Saldo koin Anda belum cukup untuk ditukar', 'info');
                return;
            }
            const input = prompt('Saldo koin Anda: ' + saldo + ' (≈ ' + formatKoinToRupiah(saldo) + ')\nMasukkan jumlah koin yang ingin ditukar:');
            if (input === null) return;
            const jumlah = Number(input);
            if (!jumlah || jumlah <= 0 || jumlah > saldo) {
                showToast('Jumlah tidak valid', 'error');
                return;
            }
            const history = getKoinRedeemHistory();
            history.push({
                jumlah: jumlah,
                rupiah: jumlah * KOIN_TO_RUPIAH,
                tanggal: new Date().toISOString(),
                status: 'Diproses'
            });
            saveKoinRedeemHistory(history);
            showToast('Permintaan tukar ' + jumlah + ' koin (' + formatKoinToRupiah(jumlah) + ') sedang diproses', 'success');
            updateRewardPage();
        }
        function belanjaDiMart() {
            switchPage('simartPage', null);
        }

        // ============================================================
        // RIWAYAT TRANSAKSI KOIN (gabungan dapat koin + tukar koin)
        // ============================================================
        function updateRewardHistory() {
            const container = document.getElementById('rewardHistoryList');
            if (!container) return;

            const earnList = getPickupHistory().map(item => ({
                tanggal: item.completedAt || item.date,
                jenis: 'masuk',
                jumlah: item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight),
                label: 'Setoran sampah (' + (item.weight || 0) + ' kg)'
            }));

            const redeemList = getKoinRedeemHistory().map(item => ({
                tanggal: item.tanggal,
                jenis: 'keluar',
                jumlah: item.jumlah,
                label: 'Tukar ke Uang' + (item.status ? ' — ' + item.status : '')
            }));

            const all = earnList.concat(redeemList).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

            if (all.length === 0) {
                container.innerHTML = '<div class="status-desc" style="text-align:center;padding:20px 0">Belum ada transaksi koin</div>';
                return;
            }

            container.innerHTML = all.map(t => `
                <div class="history-item">
                    <div class="history-header">
                        <div class="history-date">${formatTanggalIndo(t.tanggal)}</div>
                        <div class="history-weight" style="color:${t.jenis === 'masuk' ? '#10b981' : '#ef4444'}">
                            ${t.jenis === 'masuk' ? '+' : '-'}${t.jumlah} koin
                        </div>
                    </div>
                    <div class="history-status">${t.label}</div>
                </div>
            `).join('');
        }

        function formatTanggalIndo(dateStr) {
            if (!dateStr) return '-';
            const d = new Date(dateStr);
            if (isNaN(d)) return dateStr;
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        function updateRewardPage() {
            updateRewardHistory();
            const history = getPickupHistory();
            const localTotal = history.reduce((sum, item) => sum + (item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight)), 0);
            const serverTotal = Number(localStorage.getItem('sisaCachedTotal_' + getUserSuffix()) || 0);
            const total = Math.max(localTotal, serverTotal);
            const claimedLevels = JSON.parse(localStorage.getItem('sisaClaimedLevels_' + getUserSuffix()) || '[]');

            // Level system diperluas
            const levels = [
                { name:'Perunggu',      min:1,    next:50,   nextName:'Silver',       canClaimMin:1 },
                { name:'Silver',        min:50,   next:150,  nextName:'Emas',         canClaimMin:50 },
                { name:'Emas',          min:150,  next:250,  nextName:'Platinum',     canClaimMin:150 },
                { name:'Platinum',      min:250,  next:400,  nextName:'Diamond',      canClaimMin:250 },
                { name:'Diamond',       min:400,  next:600,  nextName:'Emerald',      canClaimMin:400 },
                { name:'Emerald',       min:600,  next:900,  nextName:'Ruby',         canClaimMin:600 },
                { name:'Ruby',          min:900,  next:1300, nextName:'Sapphire',     canClaimMin:900 },
                { name:'Sapphire',      min:1300, next:1800, nextName:'Master',       canClaimMin:1300 },
                { name:'Master',        min:1800, next:2500, nextName:'Grandmaster',  canClaimMin:1800 },
                { name:'Grandmaster',   min:2500, next:9999, nextName:'Grandmaster',  canClaimMin:2500 }
            ];

            let level = 'Belum Ada Level', canClaim = false, infoText = 'Kumpulkan 1 kg untuk mencapai level Perunggu!';
            let currentLevelObj = null;
            for (let i = levels.length - 1; i >= 0; i--) {
                if (total >= levels[i].min) { currentLevelObj = levels[i]; break; }
            }
            if (currentLevelObj) {
                level = currentLevelObj.name;
                const alreadyClaimed = claimedLevels.includes(level);
                canClaim = !alreadyClaimed;
                if (alreadyClaimed) {
                    // Cek apakah sudah naik level berikutnya yang belum diklaim
                    const nextIdx = levels.findIndex(l => l.name === level) + 1;
                    if (nextIdx < levels.length && total >= levels[nextIdx].min) {
                        const nextLevel = levels[nextIdx];
                        if (!claimedLevels.includes(nextLevel.name)) {
                            level = nextLevel.name;
                            canClaim = true;
                            infoText = 'Level ' + nextLevel.name + ' tercapai! Klaim reward Anda.';
                            currentLevelObj = nextLevel;
                        } else {
                            const remaining = currentLevelObj.next - total;
                            infoText = 'Level ' + level + ' sudah diklaim. ' + (remaining > 0 ? (remaining + ' kg lagi → ' + currentLevelObj.nextName) : 'Terus kumpulkan!');
                        }
                    } else {
                        const remaining = currentLevelObj.next - total;
                        infoText = 'Level ' + level + ' sudah diklaim. ' + (remaining > 0 ? (remaining + ' kg lagi → ' + currentLevelObj.nextName + '!') : 'Terus kumpulkan!');
                    }
                } else {
                    if (total >= currentLevelObj.next && currentLevelObj.nextName !== currentLevelObj.name) {
                        infoText = 'Level ' + level + ' tercapai! Klaim reward Anda. Lanjut ke ' + currentLevelObj.nextName + '!';
                    } else {
                        const remaining = currentLevelObj.next - total;
                        infoText = 'Level ' + level + ' tercapai! Klaim reward Anda. ' + (remaining > 0 ? (remaining + ' kg lagi → ' + currentLevelObj.nextName) : '');
                    }
                }
            } else {
                infoText = 'Kumpulkan 1 kg untuk mencapai level Perunggu!';
            }

           document.getElementById('rewardCurrentLevel').textContent = level;
            document.getElementById('rewardTotalKg').textContent      = total;
            const rewardRupiahEl = document.getElementById('rewardTotalRupiah');
            if (rewardRupiahEl) rewardRupiahEl.textContent = formatKoinToRupiah(total);
            document.getElementById('rewardStatus').textContent       = canClaim ? 'Dapat Diklaim' : (total < 1 ? 'Belum Ada Level' : 'Sudah Diklaim / Kumpulkan Lagi');
            document.getElementById('rewardStatus').style.color       = canClaim ? '#10b981' : '#f59e0b';
            document.getElementById('rewardInfoText').textContent     = infoText;
            const btnClaim = document.getElementById('btnClaimReward');
            btnClaim.disabled = !canClaim;
        }

        // ============================================================
        // KLAIM REWARD — dengan modal proper (perbaikan poin 6)
        // ============================================================
        async function claimReward() {
            // Cek total dari localStorage dulu
            var history = getPickupHistory();
            var localTotal = history.reduce(function(sum, item){ return sum + (item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight)); }, 0);
            
            // Coba juga ambil dari server (kalau ada cached customer data)
            var serverTotal = Number(localStorage.getItem('sisaCachedTotal_' + getUserSuffix()) || 0);
            var total = Math.max(localTotal, serverTotal);
            
            if (total < 1) { 
                showToast('Anda belum memiliki kontribusi limbah untuk diklaim', 'error'); 
                return; 
            }

            // Tampilkan modal klaim
            document.getElementById('claimModal').classList.add('active');
            document.getElementById('claimModalLevel').textContent = computeLevel(total);
            document.getElementById('claimModalKg').textContent    = total + ' Koin';
            // Store total for submitClaim to use
            document.getElementById('claimModal').dataset.total = total;
        }

        async function submitClaim() {
            const namaBank   = document.getElementById('claimBank').value;
            const rekening   = document.getElementById('claimRekening').value.trim();
            if (!namaBank)   { showToast('Pilih bank/e-wallet terlebih dahulu', 'error'); return; }
            if (!rekening || !/^\d{6,20}$/.test(rekening)) { showToast('Nomor rekening/akun harus berupa angka (6-20 digit)', 'error'); return; }

            // PATCH: Validasi login.nama sebelum kirim
            const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
            const namaPengirim = (login.nama || login.name || '').toString().trim();
            if (!namaPengirim) {
                showToast('Sesi login tidak ditemukan. Silakan login ulang.', 'error');
                return;
            }

           const history = getPickupHistory();
            const localTotal = history.reduce((sum, item) => sum + (item.koin != null ? Number(item.koin) : kgToKoin(item.category || 'organik', item.weight)), 0);
            const serverTotal = Number(localStorage.getItem('sisaCachedTotal_' + getUserSuffix()) || 0);
            const total   = Math.max(localTotal, serverTotal, Number(document.getElementById('claimModal').dataset.total || 0));
            const level   = computeLevel(total);

            const btn = document.getElementById('btnSubmitClaim');
            btn.disabled = true;
            btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;justify-content:center;"><span style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span> Mengirim...</span>';

            // Cek apakah level ini sudah pernah diklaim sebelumnya
            const claimedLevels = JSON.parse(localStorage.getItem('sisaClaimedLevels_' + getUserSuffix()) || '[]');
            if (claimedLevels.includes(level)) {
                btn.disabled = false;
                btn.textContent = 'Kirim Klaim';
                showToast('Level ' + level + ' sudah pernah diklaim sebelumnya!', 'error');
                return;
            }

            try {
                // PATCH: field lengkap dengan semua alias agar GAS pasti menangkap
                const claimPayload = {
                    type:          'claim',
                    nama:          namaPengirim,
                    namaToko:      (login.toko || login.namaToko || login.store || '').toString().trim(),
                    level:         level,
                    totalLimbah:   total,
                    nomorRekening: rekening,   // key utama yang diharap GAS
                    namaBank:      namaBank,   // key utama yang diharap GAS
                    rekening:      rekening,   // alias cadangan
                    bank:          namaBank,   // alias cadangan
                    norek:         rekening,   // alias cadangan
                    waktuDiajukan: new Date().toISOString()
                };

                console.log('📤 Claim payload:', claimPayload);
                await sendToSheet(claimPayload);

                document.getElementById('claimModal').classList.remove('active');
                document.getElementById('claimBank').value     = '';
                document.getElementById('claimRekening').value = '';

                // Simpan level yang sudah diklaim agar tidak bisa diklaim lagi
                const claimed = JSON.parse(localStorage.getItem('sisaClaimedLevels_' + getUserSuffix()) || '[]');
                if (!claimed.includes(level)) { claimed.push(level); }
                localStorage.setItem('sisaClaimedLevels_' + getUserSuffix(), JSON.stringify(claimed));
                showSuccessAnimation('Reward Berhasil Diklaim!', 'Permintaan klaim Anda telah dikirim ke admin.');
                updateRewardPage();
            } catch (e) {
                // Jika error jaringan total (misal offline)
                showToast('Koneksi gagal. Pastikan internet aktif, lalu coba lagi.', 'error');
                console.error('submitClaim error:', e);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Kirim Klaim';
            }
        }

        function closeClaimModal() {
            document.getElementById('claimModal').classList.remove('active');
        }

        // ============================================================
        // ORDER PRODUCT
        // ============================================================
        let currentOrder = null;
        let pendingProduct = null;

        function showBuyOptions(nama, harga, gambar) {
            pendingProduct = { nama, harga, gambar };
            const hargaFmt = harga > 0 ? ('Rp' + harga.toLocaleString('id-ID')) : 'Hubungi untuk harga';
            document.getElementById('buyOptionsTitle').textContent = nama;
            document.getElementById('buyOptionsText').textContent = hargaFmt + ' — mau diapain nih?';
            document.getElementById('buyOptionsModal').classList.add('active');
        }

        function closeBuyOptionsModal() {
            document.getElementById('buyOptionsModal').classList.remove('active');
        }

        let checkoutItems = [];

        function buyNowFromModal() {
            if (!pendingProduct) return;
            checkoutItems = [{ nama: pendingProduct.nama, harga: pendingProduct.harga, gambar: pendingProduct.gambar, qty: 1 }];
            closeBuyOptionsModal();
            goToCheckout();
        }

        function checkoutFromCart() {
            const cart = getCart();
            if (!cart.length) { showToast('Keranjang masih kosong', 'error'); return; }
            checkoutItems = cart;
            closeCartPanel();
            goToCheckout();
        }

        function goToCheckout() {
            switchPage('checkoutPage', null);
            renderCheckoutItems();
            const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
            const alamatEl = document.getElementById('checkoutAlamat');
            if (alamatEl) alamatEl.value = login.alamat || '';
        }

        let checkoutKoinDipakai = 0;

        function renderCheckoutItems() {
            const list = document.getElementById('checkoutItemsList');
            let subtotal = 0;
            list.innerHTML = checkoutItems.map(item => {
                subtotal += item.harga * item.qty;
                return '<div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;">' +
                    '<img src="' + item.gambar + '" style="width:48px;height:48px;border-radius:8px;object-fit:cover;">' +
                    '<div style="flex:1;">' +
                        '<div style="font-size:13px;font-weight:600;color:#1e293b;">' + item.nama + '</div>' +
                        '<div style="font-size:12px;color:#64748b;">' + item.qty + ' x Rp' + item.harga.toLocaleString('id-ID') + '</div>' +
                    '</div>' +
                    '<div style="font-size:13px;font-weight:700;color:#1e293b;">Rp' + (item.harga * item.qty).toLocaleString('id-ID') + '</div>' +
                '</div>';
            }).join('');

            const saldoEl = document.getElementById('checkoutSaldoKoinText');
            const saldo = getSaldoKoinTersedia();
            if (saldoEl) saldoEl.textContent = 'Saldo: ' + saldo + ' koin (≈ ' + formatKoinToRupiah(saldo) + ')';

            const toggle = document.getElementById('checkoutPakaiKoin');
            if (toggle) toggle.checked = false;
            checkoutKoinDipakai = 0;

            updateCheckoutTotal(subtotal);
        }

        function updateCheckoutTotal(subtotal) {
            const subtotalText = document.getElementById('checkoutSubtotalText');
            const potonganRow = document.getElementById('checkoutPotonganRow');
            const potonganText = document.getElementById('checkoutPotonganText');
            const totalText = document.getElementById('checkoutTotalText');

            if (subtotalText) subtotalText.textContent = 'Rp' + subtotal.toLocaleString('id-ID');

            const potongan = checkoutKoinDipakai * KOIN_TO_RUPIAH;
            const total = Math.max(subtotal - potongan, 0);

            if (potonganRow) potonganRow.style.display = checkoutKoinDipakai > 0 ? 'flex' : 'none';
            if (potonganText) potonganText.textContent = '-Rp' + potongan.toLocaleString('id-ID');
            if (totalText) totalText.textContent = 'Rp' + total.toLocaleString('id-ID');
        }

        function toggleGunakanKoinCheckout() {
            const toggle = document.getElementById('checkoutPakaiKoin');
            const subtotal = checkoutItems.reduce((s, item) => s + item.harga * item.qty, 0);
            const saldo = getSaldoKoinTersedia();

            if (toggle.checked) {
                checkoutKoinDipakai = Math.min(saldo, subtotal);
                if (checkoutKoinDipakai < 1) {
                    showToast('Saldo koin belum cukup', 'info');
                    toggle.checked = false;
                    checkoutKoinDipakai = 0;
                }
            } else {
                checkoutKoinDipakai = 0;
            }
            updateCheckoutTotal(subtotal);
        }

async function submitCheckout() {
            if (!checkoutItems.length) { showToast('Tidak ada produk untuk di-checkout', 'error'); return; }
            const saved = localStorage.getItem('sisaPlusLogin');
            if (!saved) { showToast('Silakan masuk terlebih dahulu', 'error'); return; }
            const alamat = document.getElementById('checkoutAlamat').value.trim();
            if (!alamat) { showToast('Alamat pengiriman wajib diisi', 'error'); return; }

            showScheduleLoading();
            try {
                for (const item of checkoutItems) {
                    const hargaFmt = 'Rp' + item.harga.toLocaleString('id-ID');
                    const orderPayload = { name: item.nama, price: hargaFmt, quantity: item.qty };
                    const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
                    orders.push({ ...orderPayload, orderedAt: new Date().toISOString() });
                    localStorage.setItem('customerOrders', JSON.stringify(orders));
                    await sendOrder(orderPayload);
                }
                if (checkoutKoinDipakai > 0) {
                    const redeemHistory = getKoinRedeemHistory();
                    redeemHistory.push({
                        jumlah: checkoutKoinDipakai,
                        rupiah: checkoutKoinDipakai * KOIN_TO_RUPIAH,
                        tanggal: new Date().toISOString(),
                        status: 'Dipakai di Checkout'
                    });
                    saveKoinRedeemHistory(redeemHistory);
                    checkoutKoinDipakai = 0;
                }
               saveCart([]);
                checkoutItems = [];
                hideScheduleOverlay(); 
				
                pushNotification('Pesanan Berhasil Dibuat', 'Pesanan Anda sedang diproses oleh admin.');
                showSuccessAnimation('Pesanan Berhasil!', 'Pesanan Anda sedang diproses');
                setTimeout(() => {
                    const homeBtn = document.querySelector('.nav-item.nav-home') || document.querySelector('.nav-item');
                    switchPage('sitrackPage', homeBtn);
                }, 900);
            } catch (e) {
                hideScheduleOverlay();
                pushNotification('Pesanan Berhasil Dibuat', 'Pesanan Anda sedang diproses oleh admin.');
                showSuccessAnimation('Pesanan Berhasil!', 'Pesanan Anda sedang diproses (akan disinkronkan otomatis)');
                saveCart([]);
                checkoutItems = [];
                setTimeout(() => {
                    const homeBtn = document.querySelector('.nav-item.nav-home') || document.querySelector('.nav-item');
                    switchPage('sitrackPage', homeBtn);
                }, 900);
            }
        }

        function orderProduct(name, price) {
            currentOrder = { name, price, quantity: 1 };
            document.getElementById('orderModalText').textContent = `Anda akan memesan ${name} (${price}). Masukkan jumlah lalu konfirmasi.`;
            const qEl = document.getElementById('orderQty');
            if (qEl) qEl.value = 1;
            document.getElementById('orderModal').classList.add('active');
            setTimeout(() => { if (qEl) qEl.focus(); }, 100);
        }
        function closeOrderModal() {
            document.getElementById('orderModal').classList.remove('active');
            currentOrder = null;
        }

        // ============================================================
        // KERANJANG (CART)
        // ============================================================
        function getCartKey() { return 'sisaCart_' + getUserSuffix(); }

        function getCart() {
            return JSON.parse(localStorage.getItem(getCartKey()) || '[]');
        }

        function saveCart(cart) {
            localStorage.setItem(getCartKey(), JSON.stringify(cart));
            updateCartBadge();
        }

        function updateCartBadge() {
            const cart = getCart();
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            const badge = document.getElementById('cartBadge');
            if (!badge) return;
            badge.textContent = totalQty > 99 ? '99+' : totalQty;
            badge.classList.toggle('show', totalQty > 0);
        }

        function addToCartFromModal() {
            if (!pendingProduct) return;
            const cart = getCart();
            const existing = cart.find(item => item.nama === pendingProduct.nama);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ nama: pendingProduct.nama, harga: pendingProduct.harga, gambar: pendingProduct.gambar, qty: 1 });
            }
            saveCart(cart);
            closeBuyOptionsModal();
            showToast('Produk masuk keranjang', 'success');
        }

        function openCartPanel() {
            switchPage('cartPage', null);
            renderCartItems();
        }

        function closeCartPanel() {
            switchPage('simartPage', null);
        }

        function changeCartQty(nama, delta) {
            const cart = getCart();
            const item = cart.find(i => i.nama === nama);
            if (!item) return;
            item.qty += delta;
            const filtered = item.qty <= 0 ? cart.filter(i => i.nama !== nama) : cart;
            saveCart(filtered);
            renderCartItems();
        }

        function renderCartItems() {
            const cart = getCart();
            const list = document.getElementById('cartItemsList');
            const totalText = document.getElementById('cartTotalText');
            if (!cart.length) {
                list.innerHTML = '<div style="text-align:center;padding:24px 0;color:#94a3b8;font-size:14px;">Keranjang masih kosong</div>';
                totalText.textContent = 'Rp0';
                return;
            }
            let total = 0;
            list.innerHTML = cart.map(item => {
                total += item.harga * item.qty;
                return '<div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;">' +
                    '<img src="' + item.gambar + '" style="width:48px;height:48px;border-radius:8px;object-fit:cover;">' +
                    '<div style="flex:1;">' +
                        '<div style="font-size:13px;font-weight:600;color:#1e293b;">' + item.nama + '</div>' +
                        '<div style="font-size:12px;color:#64748b;">Rp' + item.harga.toLocaleString('id-ID') + '</div>' +
                    '</div>' +
                    '<div style="display:flex;align-items:center;gap:8px;">' +
                        '<button onclick="changeCartQty(\'' + item.nama.replace(/'/g, "\\'") + '\',-1)" style="width:24px;height:24px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;">-</button>' +
                        '<span style="font-size:13px;font-weight:600;min-width:16px;text-align:center;">' + item.qty + '</span>' +
                        '<button onclick="changeCartQty(\'' + item.nama.replace(/'/g, "\\'") + '\',1)" style="width:24px;height:24px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;">+</button>' +
                    '</div>' +
                '</div>';
            }).join('');
            totalText.textContent = 'Rp' + total.toLocaleString('id-ID');
        }
        async function confirmOrder() {
            if (!currentOrder || !currentOrder.name) { showToast('Order data tidak valid', 'error'); return; }
            const saved = localStorage.getItem('sisaPlusLogin');
            if (!saved) { showToast('Silakan masuk terlebih dahulu', 'error'); return; }
            const qtyEl = document.getElementById('orderQty');
            const qty   = qtyEl ? Math.max(1, parseInt(qtyEl.value) || 1) : 1;
            currentOrder.quantity = qty;
            const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
            orders.push({ ...currentOrder, orderedAt: new Date().toISOString() });
            localStorage.setItem('customerOrders', JSON.stringify(orders));
            const orderPayload = Object.assign({}, currentOrder);
            closeOrderModal();
            try {
                const result = await sendOrder(orderPayload);
                if (result && result.success) showSuccessAnimation('Pesanan Berhasil!', 'Pesanan Anda sedang diproses');
                else showSuccessAnimation('Pesanan Berhasil!', 'Pesanan Anda sedang diproses (akan disinkronkan otomatis)');
            } catch (e) {
                showSuccessAnimation('Pesanan Berhasil!', 'Pesanan Anda sedang diproses (akan disinkronkan otomatis)');
            }
        }

        // ============================================================
        // SUCCESS ANIMATION
        // ============================================================
        function showSuccessAnimation(title, desc) {
            const overlay = document.getElementById('successOverlay');
            overlay.querySelector('.success-text').textContent = title;
            overlay.querySelector('.success-desc').textContent = desc;
            overlay.classList.add('active');
            setTimeout(() => overlay.classList.remove('active'), 2500);
        }

       function showScheduleLoading() {
            const overlay = document.getElementById('successOverlay');
            overlay.classList.add('mode-logo');
            overlay.querySelector('.success-text').textContent = 'Menjadwalkan...';
            overlay.querySelector('.success-desc').textContent = 'Mohon tunggu sebentar';
            overlay.classList.add('active');
        }

        function showScheduleSuccess(title, desc) {
            const overlay = document.getElementById('successOverlay');
            overlay.classList.remove('mode-logo');
            overlay.querySelector('.success-text').textContent = title;
            overlay.querySelector('.success-desc').textContent = desc;
            setTimeout(() => overlay.classList.remove('active'), 2200);
        }

        function hideScheduleOverlay() {
            const overlay = document.getElementById('successOverlay');
            overlay.classList.remove('active', 'mode-logo');
        }

        // ============================================================
        // LOGOUT
        // ============================================================
        function logout() {
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                localStorage.removeItem('sisaPlusLogin');
                location.reload();
            }
        }
function logoutAdmin() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('sisaPlusLogin');
        localStorage.removeItem('sisaLastAdminSection'); // biar gak balik ke section terakhir
        location.reload();
    }
}
// Simpan/perbarui akun ke daftar "akun tersimpan" tiap kali login sukses
function saveAccountToList(data) {
    let list = JSON.parse(localStorage.getItem('sisaSavedAccounts') || '[]');
    list = list.filter(acc => acc.telepon !== data.telepon); // hindari duplikat
    list.push(data);
    localStorage.setItem('sisaSavedAccounts', JSON.stringify(list));
}

// Tampilkan/sembunyikan dropdown + render daftar akun
function toggleAccountSwitcher() {
    const dropdown = document.getElementById('accountSwitchDropdown');
    const isActive = dropdown.classList.contains('active');
    if (isActive) { dropdown.classList.remove('active'); return; }

    const current = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
    const list = JSON.parse(localStorage.getItem('sisaSavedAccounts') || '[]');

    if (list.length === 0) {
        dropdown.innerHTML = '<div class="account-switch-item">Belum ada akun lain</div>';
    } else {
        dropdown.innerHTML = list.map((acc, i) => {
            const isCurrent = acc.telepon === current.telepon;
            return `<div class="account-switch-item ${isCurrent ? 'current' : ''}" onclick="switchAccount(${i})">
                        ${acc.nama} - ${acc.toko || (acc.isAdmin ? 'Admin' : '')}
                    </div>`;
        }).join('');
    }
    dropdown.classList.add('active');
}

// Ganti ke akun yang dipilih
function switchAccount(index) {
    const list = JSON.parse(localStorage.getItem('sisaSavedAccounts') || '[]');
    const chosen = list[index];
    if (!chosen) return;
    localStorage.setItem('sisaPlusLogin', JSON.stringify(chosen));
    location.reload();
}

        function forceRefreshCustomerUI() {
            updateStats(); updateLevel(); updateHistory();
            updateTrackingStatus(); updateActivePickupStatus();
            syncPickupStatusWithServer();
        }

        // ============================================================
        // LOAD MY ORDERS — step-tracker style, hanya di SiMart & Home
        // ============================================================
        async function loadMyOrders(btn) {
            const container = document.getElementById('myOrdersList');
            if (!container) return;
            const login = JSON.parse(localStorage.getItem('sisaPlusLogin') || '{}');
            if (!login.nama) return;
            if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
            container.innerHTML = '<div style="text-align:center;padding:16px;color:#94a3b8;font-size:13px;">Memuat...</div>';
            try {
                const resp = await fetch(APPS_SCRIPT_URL + '?type=list_orders&t=' + Date.now());
                if (!resp.ok) throw new Error('Network error');
                const data = await resp.json();
                const allOrders = (data && data.orders) ? data.orders : [];
                const lNama = login.nama.toLowerCase().trim();
                const myOrders = allOrders.filter(o => (o.Nama || o.nama || '').toLowerCase().trim() === lNama);
                renderOrderStepTracker(container, myOrders);
                // Also update home activity
                updateHomeActivity(myOrders);
            } catch (e) {
                container.innerHTML = '<div style="text-align:center;padding:16px;color:#ef4444;font-size:13px;">Gagal memuat pesanan. Coba refresh.</div>';
            } finally {
                if (btn) { btn.textContent = '🔄 Refresh'; btn.disabled = false; }
            }
        }

        // Render step-tracker style untuk setiap pesanan
        function renderOrderStepTracker(container, orders) {
            // Filter: sembunyikan pesanan yang sudah selesai/cancelled dari step tracker
            orders = (orders || []).filter(function(o) {
                var st = (o.Status || o.status || '').toString().toLowerCase();
                return st !== 'completed' && st !== 'cancelled' && st !== 'selesai' && st !== 'dibatalkan';
            });
            if (!orders || orders.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:13px;">Belum ada pesanan</div>';
                return;
            }
            // curStep = index step yang AKTIF sekarang
            // si < curStep = done, si === curStep = active, si > curStep = pending
            // pending=0: step 0 aktif
            // processing=1: step 0 done, step 1 aktif  
            // completed=2: step 0 done, step 1 done, step 2 aktif (sudah selesai)
            var statusOrder = { pending:0, processing:1, completed:2, cancelled:2 };
            var stepDefs = [
                { key:'pending',    label:'Menunggu',  desc:'Pesanan diterima, menunggu konfirmasi' },
                { key:'processing', label:'Diproses',  desc:'Pesanan sedang disiapkan' },
                { key:'completed',  label:'Selesai',   desc:'Pesanan telah selesai' }
            ];

            var html = '';
            var reversed = orders.slice().reverse();
            for (var oi = 0; oi < reversed.length; oi++) {
                var o       = reversed[oi];
                var id      = o.OrderID || o.id || '';
                var items   = o.Items   || o.items || '-';
                var qty     = o.Quantity || o.quantity || 1;
                var st      = (o.Status || o.status || 'pending').toString().toLowerCase();
                var isCancelled = (st === 'cancelled');
                var curStep = (statusOrder[st] !== undefined) ? statusOrder[st] : 0;
                var tgl = '-';
                try { var dd = new Date(o.Timestamp || ''); if (!isNaN(dd)) tgl = dd.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}); } catch(e){}

                // Build steps
                var activeSteps = isCancelled ? stepDefs.concat([{key:'cancelled',label:'Dibatalkan',desc:'Pesanan dibatalkan'}]) : stepDefs;
                var stepsHTML = '';
                for (var si = 0; si < activeSteps.length; si++) {
                    var sdef = activeSteps[si];
                    var state = '';
                    if (isCancelled) {
                        if (sdef.key === 'cancelled') state = 'step-active';
                        else if (si < 2) state = 'step-done';
                    } else {
                        if (si < curStep) state = 'step-done';
                        else if (si === curStep) state = 'step-active';
                    }
                    var isLastStep = (si === activeSteps.length - 1);
                    var circleStyle = '';
                    var labelStyle  = '';
                    if (isCancelled && sdef.key === 'cancelled' && state === 'step-active') {
                        circleStyle = ' style="border-color:#ef4444;background:#fee2e2;"';
                        labelStyle  = ' style="color:#ef4444;"';
                    }
                    var showDesc = (state === 'step-active' || state === 'step-done') ? sdef.desc : '';
                    stepsHTML += '<div class="step-item ' + state + '" style="margin-bottom:0;">'
                               + '<div class="step-connector-top"></div>'
                               + '<div class="step-circle"' + circleStyle + '><span class="step-num">' + (si+1) + '</span></div>'
                               + (isLastStep ? '' : '<div class="step-connector-bot"></div>')
                               + '<div class="step-content" style="padding-bottom:12px;">'
                               + '<div class="step-label"' + labelStyle + '>' + sdef.label + '</div>'
                               + '<div class="step-desc">' + showDesc + '</div>'
                               + '</div>'
                               + '</div>';
                }

                var shortId = id.toString().length > 6 ? id.toString().slice(-6) : id.toString();
                html += '<div style="border-bottom:2px solid #f1f5f9;padding-bottom:16px;margin-bottom:16px;">'
                      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'
                      + '<div>'
                      + '<div style="font-size:14px;font-weight:700;color:#1e293b;">' + items + '</div>'
                      + '<div style="font-size:11px;color:#94a3b8;">Qty: ' + qty + ' &middot; ' + tgl + '</div>'
                      + '</div>'
                      + '<div style="font-size:11px;color:#94a3b8;">#' + shortId + '</div>'
                      + '</div>'
                      + '<div class="step-tracker" style="padding:4px 0 0;">' + stepsHTML + '</div>'
                      + '</div>';
            }
            container.innerHTML = html;
        }
        // Update aktivitas terakhir di Home — gabungan pesanan + penjemputan
        function updateHomeActivity(orders) {
            var el = document.getElementById('homeLastActivity');
            if (!el) return;

            // Kumpulkan semua aktivitas: pesanan dari server + pickup dari localStorage
            var activities = [];

            // Pesanan dari server
            (orders || []).forEach(function(o) {
                var st = (o.Status || o.status || 'pending').toString().toLowerCase();
                activities.push({
                    type: 'pesanan',
                    label: o.Items || o.items || 'Pesanan',
                    status: st,
                    timestamp: o.Timestamp || o.timestamp || ''
                });
            });

            // Penjemputan dari localStorage
            var pickupHistory = getPickupHistory ? getPickupHistory() : [];
            pickupHistory.forEach(function(p) {
                activities.push({
                    type: 'penjemputan',
                    label: (p.weight || '?') + ' kg',
                    status: (p.status || 'dijadwalkan').toLowerCase(),
                    timestamp: p.completedAt || p.date || ''
                });
            });

            if (activities.length === 0) {
                el.innerHTML = '<div style="text-align:center;padding:20px 0;color:#64748b;font-size:14px;font-weight:500;">Belum ada aktivitas</div>';
                return;
            }

            // Sort terbaru dulu
            activities.sort(function(a,b){ return new Date(b.timestamp||0) - new Date(a.timestamp||0); });

            // Ambil max 3 aktivitas terakhir
            var recent = activities.slice(0, 3);

            var orderStatusInfo = {
                pending:    { label:'Menunggu',    bg:'#dbeafe', color:'#1e40af' },
                processing: { label:'Diproses',    bg:'#dcfce7', color:'#166534' },
                completed:  { label:'Selesai',     bg:'#d1fae5', color:'#065f46' },
                cancelled:  { label:'Dibatalkan',  bg:'#fee2e2', color:'#991b1b' }
            };
            var pickupStatusInfo = {
                dijadwalkan: { label:'Dijadwalkan', bg:'#0868e3', color:'#fff' },
                dijemput:    { label:'Dijemput',    bg:'#ffc900', color:'#373737' },
                diproses:    { label:'Diproses',    bg:'#dcfce7', color:'#fff' },
                selesai:     { label:'Selesai',     bg:'#d1fae5', color:'#065f46' },
                completed:   { label:'Selesai',     bg:'#d1fae5', color:'#065f46' },
                dibatalkan:  { label:'Dibatalkan',  bg:'#fee2e2', color:'#991b1b' }
            };

            var html = '';
            recent.forEach(function(act, idx) {
                var isPesanan = act.type === 'pesanan';
                var typeIcon  = isPesanan ? '🛒' : '🚛';
                var typeLabel = isPesanan ? 'Pesanan' : 'Penjemputan';
                var typeBg    = isPesanan ? '#eff6ff' : '#f0fdf4';
                var typeColor = isPesanan ? '#1e40af' : '#166534';

                var stInfo = isPesanan
                    ? (orderStatusInfo[act.status] || orderStatusInfo.pending)
                    : (pickupStatusInfo[act.status] || pickupStatusInfo.dijadwalkan);

                var tgl = '-';
                try { var d = new Date(act.timestamp||''); if (!isNaN(d.getTime())) tgl = d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}); } catch(e){}

                var borderTop = idx > 0 ? 'border-top:1px solid #f1f5f9;' : '';
                html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;' + borderTop + '">'
                    /* ikon */
                    + '<div style="width:46px;height:46px;border-radius:14px;background:' + typeBg + ';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">' + typeIcon + '</div>'
                    /* konten tengah */
                    + '<div style="flex:1;min-width:0;">'
                    /* baris 1: label tipe + nama item (sejajar horizontal) */
                    + '<div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">'
                    + '<span style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:' + typeBg + ';color:' + typeColor + ';white-space:nowrap;">' + typeLabel + '</span>'
                    + '<span style="font-size:14px;font-weight:700;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;">' + act.label + '</span>'
                    + '</div>'
                    /* baris 2: tanggal */
                    + '<div style="font-size:11px;color:#94a3b8;margin-top:3px;">' + tgl + '</div>'
                    + '</div>'
                    /* status badge kanan */
                    + '<span style="padding:5px 11px;border-radius:20px;background:' + stInfo.bg + ';color:' + stInfo.color + ';font-size:12px;font-weight:700;white-space:nowrap;flex-shrink:0;">' + stInfo.label + '</span>'
                    + '</div>';
            });
            el.innerHTML = html;
        }
    

// ===== next block =====


        // ============================================================
        // ADMIN STATE VARIABLES
        // ============================================================
        var adminPickupAutoRefreshId   = null;
        var adminPickupState           = new Map();
        var adminPickupMissingCounts   = new Map();
        var ADMIN_PICKUP_MISSING_THRESHOLD = 2;
        var adminPickupCache           = null;
        var adminPickupIsFetching      = false;

        var adminOrdersAutoRefreshId   = null;
        var adminOrdersState           = new Map();
        var adminOrdersMissingCounts   = new Map();
        var ADMIN_ORDERS_MISSING_THRESHOLD = 2;
        var adminOrdersCache           = null;
        var adminOrdersIsFetching      = false;

        var adminCustomersAutoRefreshId  = null;
        var adminCustomersState          = new Map();
        var adminCustomersMissingCounts  = new Map();
        var ADMIN_CUSTOMERS_MISSING_THRESHOLD = 2;
        var adminCustomersCache          = null;
        var adminCustomersIsFetching     = false;

	var adminClaimsCache        = null;
        var adminClaimsIsFetching   = false;

        var adminProductsCache      = null;   // ⬅️ BARU
        var adminProductsIsFetching = false;  // ⬅️ BARU

        // ============================================================
        // NAV ADMIN
        // ============================================================
        // Helper: tampilkan skeleton loading di tbody jika data belum ada
        function showTableSkeleton(tbodySelector, cols) {
            const tBody = document.querySelector(tbodySelector);
            if (!tBody || tBody.children.length > 0) return;
            const rows = 5;
            let html = '';
            for (let r = 0; r < rows; r++) {
                html += '<tr>';
                for (let c = 0; c < cols; c++) {
                    const w = [60, 80, 90, 70, 50, 60, 40][c % 7];
                    html += '<td><div style="height:14px;background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:200% 100%;animation:shimmer 1.2s infinite;border-radius:6px;width:' + w + '%;"></div></td>';
                }
                html += '</tr>';
            }
            tBody.innerHTML = html;
            if (!document.getElementById('shimmer-style')) {
                var s = document.createElement('style');
                s.id = 'shimmer-style';
                s.textContent = '@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}';
                document.head.appendChild(s);
            }
        }

        function navAdmin(id, btn) {
	    localStorage.setItem('sisaLastAdminSection', id);   // <-- BARIS BARU
            document.querySelectorAll('.admin-container > div').forEach(d => d.classList.add('admin-hidden'));
            document.getElementById(id).classList.remove('admin-hidden');
            document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Animasi bounce lembut
            btn.style.transform = 'scale(0.85)';
            requestAnimationFrame(function() { requestAnimationFrame(function() { btn.style.transform = ''; }); });
            // Sync home circle colors
            document.querySelectorAll('.admin-home-circle svg path, .admin-home-circle svg polyline').forEach(function(el) {
                el.style.stroke = btn.classList.contains('admin-home-btn') ? '#6ee7b7' : '#7ec8ff';
            });
            // Render dari cache DULU (instant), lalu fetch hanya jika cache expired
            if (id === 'adminPickup') {
                showTableSkeleton('#pickupsTable tbody', 6);
                renderPickupsFromCache();
                if (!AdminCache.get('pickups')) loadPickupsBackground();
            } else if (id === 'adminOrders') {
                showTableSkeleton('#adminOrders .admin-table tbody', 7);
                renderOrdersFromCache();
                if (!AdminCache.get('orders')) loadOrdersBackground();
            } else if (id === 'adminCustomers') {
                showTableSkeleton('#adminCustomers .admin-table tbody', 5);
                renderCustomersFromCache();
                if (!AdminCache.get('customers')) loadCustomersBackground();
          } else if (id === 'adminClaims') {
                showTableSkeleton('#claimsTable tbody', 6);
                renderClaimsFromCache();
                if (!AdminCache.get('claims')) loadClaimsBackground();
           } else if (id === 'adminProducts') {           // ⬅️ BARU
                renderProductsFromCache();
                if (!AdminCache.get('products')) loadProductsBackground();
            } else if (id === 'adminBanners') {
                loadBannersAdmin();
            } else if (id === 'adminDashboard') {
            } else if (id === 'adminNews') {
                renderNewsAdmin();
            }
        }
	function restoreLastPage(data) {
    if (data.isAdmin) {
        const lastSection = localStorage.getItem('sisaLastAdminSection') || 'adminDashboard';
        const btn = document.querySelector('.admin-nav-btn[onclick*="' + lastSection + '"]');
        if (btn) {
            navAdmin(lastSection, btn);
        } else {
            navAdmin('adminDashboard', document.querySelector('.admin-home-btn'));
        }
    }
}

        // ============================================================
        // ADMIN DASHBOARD — perbaikan poin 3
        // ============================================================
        function updateAdminDashboard() {
function animateCountUp(el, targetValue, suffix, duration) {
    if (!el) return;
    suffix = suffix || '';
    duration = duration || 800;
    const startValue = parseInt(el.textContent) || 0;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out
        const currentValue = Math.round(startValue + (targetValue - startValue) * eased);
        el.textContent = currentValue + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
            // Hitung dari cache yang sudah ada
            const customers = adminCustomersCache || [];
            const pickups   = adminPickupCache    || [];
            const orders    = adminOrdersCache    || [];

            const totalCustomer  = customers.length;
            const pickupAktif    = pickups.filter(p => {
                const s = normalizeStatus(p.Status || p.status || '');
                return s === 'scheduled' || s === 'picked' || s === 'processed';
            }).length;
            const pesananMasuk   = orders.filter(o => {
                const s = (o.Status || o.status || '').toString().toLowerCase();
                return s === 'pending' || s === 'processing';
            }).length;
            const totalLimbah    = customers.reduce((sum, c) => sum + (Number(c.TotalLimbah || c.totalLimbah || 0)), 0);

            // Update kartu
            const el = id => document.getElementById(id);
           if (el('dashTotalCustomer')) animateCountUp(el('dashTotalCustomer'), totalCustomer, '', 800);
if (el('dashPickupAktif'))   animateCountUp(el('dashPickupAktif'), pickupAktif, '', 800);
if (el('dashPesananMasuk'))  animateCountUp(el('dashPesananMasuk'), pesananMasuk, '', 800);
if (el('dashTotalLimbah'))   animateCountUp(el('dashTotalLimbah'), totalLimbah, ' Koin', 800);

            // Grafik mini — distribusi level customer
            const levelCount = { 'Belum Ada Level':0,'Perunggu':0,'Silver':0,'Emas':0,'Platinum':0,'Diamond':0,'Emerald':0,'Ruby':0,'Sapphire':0,'Master':0,'Grandmaster':0 };
            customers.forEach(c => {
                const lvl = c.Level || c.level || 'Belum Ada Level';
                if (levelCount[lvl] !== undefined) levelCount[lvl]++;
                else levelCount['Belum Ada Level']++;
            });
            const statusCount = { dijadwalkan:0, dijemput:0, diproses:0, selesai:0 };
            pickups.forEach(p => {
                const s = (p.Status || p.status || 'dijadwalkan').toString().toLowerCase();
                if (statusCount[s] !== undefined) statusCount[s]++;
            });

           const chartEl = document.getElementById('dashChart');
            if (chartEl) {
                chartEl.innerHTML = `
                    <div style="background:#f0fdf4;border-radius:14px;padding:18px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                            <div style="font-family:Roboto Condensed;font-size:17px;font-weight:700;color:#166534;">Total Kontributor</div>
                            <div id="contribTotal" style="font-size:20px;font-weight:800;color:#166534;">0</div>
                        </div>
                        <div style="position:relative;width:100%;height:220px;">
                            <canvas id="contributorChart"></canvas>
                        </div>
                        <div style="display:flex;gap:6px;margin-top:14px;">
                            <button id="btnHari" class="range-btn" onclick="setContributorRange('hari')">Hari</button>
                            <button id="btnMinggu" class="range-btn" onclick="setContributorRange('minggu')">Minggu</button>
                            <button id="btnBulan" class="range-btn" onclick="setContributorRange('bulan')">Bulan</button>
                            <button id="btnTahun" class="range-btn" onclick="setContributorRange('tahun')">Tahun</button>
                        </div>
                    </div>
                    <div style="background:#eff6ff;border-radius:14px;padding:18px;">
                        <div style="font-family:Roboto Condensed;font-size:17px ;font-weight:700;color:#1e40af;margin-bottom:12px;">Status   
                        Penjemputan</div> ${Object.entries(levelCount).filter(([,v])=>v>0).map(([k,v]) => {
                            const pct = totalCustomer > 0 ? Math.round((v/totalCustomer)*100) : 0;
                            const colors = {'Grandmaster':'#1e1b4b','Master':'#7c3aed','Sapphire':'#2563eb','Ruby':'#dc2626','Emerald':'#059669','Diamond':'#a855f7','Platinum':'#64748b','Emas':'#f59e0b','Silver':'#94a3b8','Perunggu':'#d97706','Belum Ada Level':'#e5e7eb'};
                            return `<div style="margin-bottom:8px;">
                                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">
                                    <span style="color:#334155;font-weight:600;">${k}</span>
                                    <span style="color:#64748b;">${v} (${pct}%)</span>
                                </div>
                                <div style="background:#e5e7eb;border-radius:6px;height:8px;">
                                    <div style="background:${colors[k]||'#3b82f6'};height:8px;border-radius:6px;width:${pct}%;transition:width 0.5s;"></div>
                                </div>
                            </div>`;
                        }).join('') || '<div style="color:#94a3b8;font-size:13px;">Belum ada data</div>'}
                    </div>
                    <div style="background:#eff6ff;border-radius:14px;padding:18px;">
                        <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:12px;">🚚 Status Penjemputan</div>
                        ${Object.entries(statusCount).map(([k,v]) => {
                            const colors = {dijadwalkan:'#3b82f6',dijemput:'#22C55E',diproses:'#22C55E',selesai:'#10b981'};
                            const labels = {dijadwalkan:'Dijadwalkan',dijemput:'Dijemput',diproses:'Diproses',selesai:'Selesai'};
                            const total2 = pickups.length || 1;
                            const pct = Math.round((v/total2)*100);
                            return `<div style="margin-bottom:8px;">
                                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">
                                    <span style="color:#334155;font-weight:600;">${labels[k]}</span>
                                    <span style="color:#64748b;">${v}</span>
                                </div>
                                <div style="background:#e5e7eb;border-radius:6px;height:8px;">
                                    <div style="background:${colors[k]};height:8px;border-radius:6px;width:${pct}%;transition:width 0.5s;"></div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                `;
 setContributorRange(window.currentContributorRange || 'bulan');
            }

            // Aktivitas terbaru (5 pickup terakhir)
            const actEl = document.getElementById('dashActivityList');
            if (actEl) {
                const recent = [...pickups].sort((a,b) => {
                    const ta = new Date(a.Timestamp||a.timestamp||0).getTime();
                    const tb = new Date(b.Timestamp||b.timestamp||0).getTime();
                    return tb - ta;
                }).slice(0, 5);
                if (recent.length === 0) {
                    actEl.innerHTML = '<div style="color:#94a3b8;text-align:center;padding:20px;font-size:14px;">Belum ada aktivitas</div>';
                } else {
                    actEl.innerHTML = recent.map(p => {
                        const st = (p.Status || p.status || 'dijadwalkan').toString().toLowerCase();
                        const statusColors = {dijadwalkan:'#dbeafe|#1e40af',dijemput:'#dcfce7|#166534',diproses:'#dcfce7|#166534',selesai:'#d1fae5|#065f46',dibatalkan:'#fee2e2|#991b1b',cancelled:'#fee2e2|#991b1b'};
                        const [bg, color] = (statusColors[st] || '#f1f5f9|#475569').split('|');
                        return `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f1f5f9;">
                            <div style="flex:1;">
                                <div style="font-size:14px;font-weight:600;color:#1e293b;">${p.Nama||p.nama||'-'}</div>
                                <div style="font-size:12px;color:#64748b;">${p.NamaToko||p.namaToko||''} · ${p.Tanggal||p.tanggal||'-'}</div>
                            </div>
                            <span style="padding:4px 10px;border-radius:20px;background:${bg};color:${color};font-size:12px;font-weight:600;">${st}</span>
                        </div>`;
                    }).join('');
                }
            }
        }
function getCustomerDate(c) {
            var raw = c.Timestamp || c.timestamp || c.WaktuDaftar || c.waktuDaftar || '';
            var d = new Date(raw);
            return isNaN(d.getTime()) ? null : d;
        }

        function setContributorRange(range) {
            window.currentContributorRange = range;
            var customers = adminCustomersCache || [];
            var buckets = [];
            var now = new Date();

            if (range === 'hari') {
                for (var i = 6; i >= 0; i--) {
                    var d = new Date(now); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
                    buckets.push({ start: d, label: d.toLocaleDateString('id-ID', {day:'2-digit', month:'short'}) });
                }
            } else if (range === 'minggu') {
                for (var i = 7; i >= 0; i--) {
                    var d = new Date(now); d.setDate(d.getDate() - (i*7)); d.setHours(0,0,0,0);
                    buckets.push({ start: d, label: 'Mgg ' + d.toLocaleDateString('id-ID', {day:'2-digit', month:'short'}) });
                }
            } else if (range === 'bulan') {
                for (var i = 11; i >= 0; i--) {
                    var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    buckets.push({ start: d, label: d.toLocaleDateString('id-ID', {month:'short', year:'2-digit'}) });
                }
            } else {
                for (var i = 4; i >= 0; i--) {
                    var d = new Date(now.getFullYear() - i, 0, 1);
                    buckets.push({ start: d, label: String(d.getFullYear()) });
                }
            }

            var counts = buckets.map(function(){ return 0; });
            customers.forEach(function(c) {
                var d = getCustomerDate(c);
                if (!d) return;
                for (var i = buckets.length - 1; i >= 0; i--) {
                    if (d >= buckets[i].start) { counts[i]++; break; }
                }
            });

          

            var labels = buckets.map(function(b){ return b.label; });
            var canvas = document.getElementById('contributorChart');
            if (!canvas) return;

            if (window.contributorChartInstance) window.contributorChartInstance.destroy();

            window.contributorChartInstance = new Chart(canvas, {
                data: {
                    labels: labels,
                    datasets: [
                        { type: 'bar', label: 'Kontributor baru', data: counts, backgroundColor: '#22c55e', borderRadius: 4, maxBarThickness: 24, order: 2 },
                        { type: 'line', label: 'Tren Harian', data: counts, borderColor: '#2563eb', backgroundColor: '#2563eb', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#2563eb', tension: 0.3, order: 1 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                   y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#e5e7eb' } },
                                       }
}
            });

            var totalEl = document.getElementById('contribTotal');
            if (totalEl) totalEl.textContent = customers.length;

            ['hari','minggu','bulan','tahun'].forEach(function(r) {
                var btn = document.getElementById('btn' + r.charAt(0).toUpperCase() + r.slice(1));
                if (btn) btn.classList.toggle('active', r === range);
            });
        }

        // normalizeStatus sudah didefinisikan di customer section — tidak perlu duplikat
        function normalizeStatus(s) {
            if (!s && s !== 0) return '';
            s = String(s).toLowerCase().trim();
            const map = {
                'dijadwalkan':'scheduled','scheduled':'scheduled',
                'dijemput':'picked','picked':'picked',
                'diproses':'processed','processed':'processed',
                'selesai':'completed','completed':'completed',
                'dibatalkan':'cancelled','cancelled':'cancelled'
            };
            return map[s] || s;
        }

        // ============================================================
        // PICKUPS — RENDER: status badge clickable dropdown (poin 2)
        // ============================================================
        function renderPickupsFromCache() {
            if (!adminPickupCache || adminPickupCache.length === 0) {
                const tBody = document.querySelector('#pickupsTable tbody');
                const empty = document.getElementById('pickupsEmpty');
                if (tBody) tBody.innerHTML = '';
                if (empty) empty.style.display = 'block';
                return;
            }
            renderPickupsData(adminPickupCache);
        }

        async function loadPickupsBackground() {
            const cachedPickups = AdminCache.get('pickups');
            if (cachedPickups) {
                // Cache masih valid — render langsung ke UI (hilangkan skeleton)
                adminPickupCache = cachedPickups;
                renderPickupsData(cachedPickups);
                if (adminPickupIsFetching) return;
                // Tetap fetch background untuk refresh data (tapi tidak block UI)
                adminPickupIsFetching = true;
                try {
                    const url = APPS_SCRIPT_URL + '?type=list_pickups&t=' + Date.now();
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 20000);
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (!res.ok) return;
                    const json = await res.json();
                    if (json.success) {
                        // BUGFIX: Selalu gunakan data server (termasuk array kosong [])
                        adminPickupCache = json.pickups || [];
                        AdminCache.set('pickups', adminPickupCache);
                        renderPickupsData(adminPickupCache);
                        updateAdminDashboard();
                    }
                } catch (err) { /* silent — UI sudah menampilkan cache */ }
                finally { adminPickupIsFetching = false; }
                return;
            }
            
            if (adminPickupIsFetching) return;
            adminPickupIsFetching = true;
            
            try {
                const url = APPS_SCRIPT_URL + '?type=list_pickups&t=' + Date.now();
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 20000);
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!res.ok) return;
                const json = await res.json();
                
                if (json.success) {
                    // BUGFIX: Terima array kosong [] dan bersihkan cache + tampilan
                    adminPickupCache = json.pickups || [];
                    AdminCache.set('pickups', adminPickupCache);
                    renderPickupsData(adminPickupCache);
                    updateAdminDashboard();
                }
            } catch (err) {
                console.error('Fetch pickups error:', err);
                const fallback = localStorage.getItem(CACHE_CONFIG.pickups.key);
                if (fallback) {
                    try {
                        const { data } = JSON.parse(fallback);
                        adminPickupCache = data;
                        renderPickupsData(data);
                    } catch (e) {}
                }
            } finally {
                adminPickupIsFetching = false;
            }
        }

        async function initAdminPickupPolling() {
            await loadPickupsBackground();
            if (!adminPickupAutoRefreshId)
                adminPickupAutoRefreshId = setInterval(loadPickupsBackground, 30000); // diperpanjang dari 15s
        }

        // BUGFIX: Fungsi untuk membersihkan semua cache admin (berguna setelah hapus data di Sheets)
        function clearAllAdminCache() {
            ['pickups', 'orders', 'customers', 'claims'].forEach(t => AdminCache.clear(t));
            adminPickupCache = []; adminOrdersCache = []; adminCustomersCache = []; adminClaimsCache = [];
            adminPickupState.clear(); adminPickupMissingCounts.clear();
            console.log('✅ Semua cache admin telah dibersihkan. Reload data dari server...');
        }

        // STATUS BADGE DROPDOWN POPUP — poin 2
        function createStatusDropdown(currentStatus, row, id, pid, type) {
            // type: 'pickup' atau 'order'
            const pickupOptions = [
                { val:'scheduled', label:'Dijadwalkan', cls:'status-dijadwalkan' },
                { val:'picked',    label:'Dijemput',    cls:'status-dijemput' },
                { val:'processed', label:'Diproses',    cls:'status-diproses' },
                { val:'completed', label:'Selesai',     cls:'status-selesai' },
                { val:'cancelled', label:'Dibatalkan',  cls:'status-cancelled' }
            ];
            const orderOptions = [
                { val:'pending',    label:'Menunggu',   cls:'status-pending' },
                { val:'processing', label:'Diproses',   cls:'status-processing' },
                { val:'completed',  label:'Selesai',    cls:'status-completed' },
                { val:'cancelled',  label:'Dibatalkan', cls:'status-cancelled' }
            ];
            const opts = type === 'order' ? orderOptions : pickupOptions;
            const current = type === 'order' ? currentStatus : normalizeStatus(currentStatus);
            const currentOpt = opts.find(o => o.val === current) || opts[0];

            const wrap = document.createElement('div');
            wrap.className = 'status-dropdown-wrap';
            wrap.style.cssText = 'position:relative;display:inline-block;';

            const badge = document.createElement('span');
            badge.className = 'status-badge ' + currentOpt.cls + ' status-clickable';
            badge.textContent = currentOpt.label;
            badge.style.cssText = 'cursor:pointer;user-select:none;';
            badge.setAttribute('data-pid', pid);
            badge.setAttribute('data-type', type);

            const dropdown = document.createElement('div');
            dropdown.className = 'status-dropdown-menu';
            dropdown.style.cssText = 'position:absolute;top:110%;left:0;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:500;min-width:160px;display:none;overflow:hidden;';

            opts.forEach(opt => {
                const item = document.createElement('div');
                item.className = 'status-dropdown-item';
                item.style.cssText = 'padding:10px 14px;cursor:pointer;font-size:13px;font-weight:600;transition:background 0.15s;display:flex;align-items:center;gap:8px;';
                item.onmouseenter = () => item.style.background = '#f8fafc';
                item.onmouseleave = () => item.style.background = '';
                const dot = document.createElement('span');
                dot.style.cssText = 'width:8px;height:8px;border-radius:50%;display:inline-block;flex-shrink:0;';
                const dotColors = {'status-dijadwalkan':'#0868e3','status-dijemput':'#22C55E','status-diproses':'#22C55E','status-selesai':'#10b981','status-dibatalkan':'#ef4444','status-pending':'#3b82f6','status-processing':'#22C55E','status-completed':'#10b981','status-cancelled':'#ef4444'};
                dot.style.background = dotColors[opt.cls] || '#94a3b8';
                item.appendChild(dot);
                item.appendChild(document.createTextNode(opt.label));
                if (opt.val === current) { item.style.background = '#f0fdf4'; }

                item.onclick = async function(e) {
                    e.stopPropagation();
                    dropdown.style.display = 'none';
                    badge.textContent = '⏳ Menyimpan...';
                    badge.className   = 'status-badge status-dijadwalkan status-clickable';
                    badge.style.cursor = 'not-allowed';
                    try {
                        if (type === 'pickup') {
                            await updatePickupStatus({ row, id, status: opt.val });
                        } else {
                            // Ambil nama dan items dari td di baris yang sama sebagai fallback
                            const tr = badge.closest('tr');
                            const tds = tr ? tr.querySelectorAll('td') : [];
                            const namaVal  = tds[1] ? tds[1].textContent.trim() : '';
                            const itemsVal = tds[3] ? tds[3].textContent.trim() : '';
                            await updateOrderStatus({ row, id, status: opt.val, nama: namaVal, items: itemsVal });
                        }
                        badge.className   = 'status-badge ' + opt.cls + ' status-clickable';
                        badge.textContent = opt.label;
                        badge.style.cursor = 'pointer';
                        // Refresh data after update
                        setTimeout(() => {
                            if (type === 'pickup') {
                                loadPickupsBackground();
                                // Jika status selesai, refresh customers juga agar total limbah update
                                if (opt.val === 'completed') {
                                    setTimeout(() => loadCustomersBackground(), 2000);
                                }
                            } else {
                                loadOrdersBackground();
                            }
                        }, 800);
                    } catch (err) {
                        badge.textContent = '✗ Gagal';
                        badge.style.background = '#fee2e2';
                        badge.style.color = '#991b1b';
                        setTimeout(() => {
                            badge.className   = 'status-badge ' + currentOpt.cls + ' status-clickable';
                            badge.textContent = currentOpt.label;
                            badge.style.background = '';
                            badge.style.color = '';
                            badge.style.cursor = 'pointer';
                        }, 2000);
                    }
                };
                dropdown.appendChild(item);
            });

            badge.onclick = function(e) {
                e.stopPropagation();
                // Close all other dropdowns
                document.querySelectorAll('.status-dropdown-menu').forEach(d => {
                    if (d !== dropdown) d.style.display = 'none';
                });
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            };

            wrap.appendChild(badge);
            wrap.appendChild(dropdown);
            return wrap;
        }

        // Close dropdowns on outside click
        document.addEventListener('click', function() {
            document.querySelectorAll('.status-dropdown-menu').forEach(d => d.style.display = 'none');
        });

        function renderPickupsData(pickups) {
            const tBody = document.querySelector('#pickupsTable tbody');
            const empty = document.getElementById('pickupsEmpty');
            if (!tBody) return;
            // BUGFIX: Selalu bersihkan tabel terlebih dahulu sebelum render ulang
            tBody.innerHTML = '';
            adminPickupState.clear();
            adminPickupMissingCounts.clear();
            if (!pickups || pickups.length === 0) {
                if (empty) empty.style.display = 'block';
                return;
            }
            if (empty) empty.style.display = 'none';

            const map = new Map();
            pickups.forEach(p => {
                const key = String(p.PickupID || p.pickupID || p.id || p.ID || 'row_' + (p._row || Math.random()));
                const existing = map.get(key);
                if (!existing) { map.set(key, p); }
                else {
                    const ta = new Date(existing.Timestamp || 0).getTime();
                    const tb = new Date(p.Timestamp || 0).getTime();
                    if (tb >= ta) map.set(key, p);
                }
            });
            const deduped = Array.from(map.values()).sort((a, b) =>
                new Date(b.Timestamp || 0).getTime() - new Date(a.Timestamp || 0).getTime()
            );

            deduped.forEach(p => {
                const pid      = String(p.PickupID || p.pickupID || p.id || p.ID || 'row_' + (p._row || ''));
                const id      = p.PickupID || p.pickupID || p.id || p.ID || '';
                const nama    = p.Nama || p.nama || '';
                const toko    = p.NamaToko || p.namaToko || p.toko || '';
                const tanggal = p.Tanggal || p.tanggal || '';
                const berat   = p['Berat (KG)'] || p.Berat || p.berat || '';
                const statusRaw = (p.Status || p.status || 'dijadwalkan').toString();
                const normStatus = normalizeStatus(statusRaw);
                const row = p._row || '';

                // Format tanggal: hanya dd/mm/yyyy
                let tanggalFmt = '-';
                try {
                    if (tanggal) {
                        const d = new Date(tanggal);
                        if (!isNaN(d)) {
                            tanggalFmt = d.toLocaleDateString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric' });
                        } else {
                            tanggalFmt = tanggal.toString().substring(0, 10);
                        }
                    }
                } catch(e) { tanggalFmt = tanggal || '-'; }

                const tr = document.createElement('tr');
                tr.setAttribute('data-pickup-row-id', pid);
                tr.innerHTML = `<td>${tanggalFmt}</td><td>${nama}</td><td>${toko}</td><td>${berat}</td><td class="status-cell-${pid}"></td><td><button class="btn-update" data-pid="${pid}" data-row="${row}" data-id="${id}" onclick="handleSavePickup(this)" style="padding:7px 18px;border-radius:8px;border:none;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">Simpan</button></td>`;
                const statusCell = tr.querySelector('.status-cell-' + pid);
                if (statusCell) {
                    statusCell.innerHTML = '';
                    statusCell.appendChild(createStatusDropdown(normStatus, row, id, pid, 'pickup'));
                }
                tBody.appendChild(tr);
                adminPickupState.set(pid, p);
            });

            if (!tBody.querySelector('tr') && empty) empty.style.display = 'block';
        }

        function openPickupDetail(pid) {
            // Bisa dikembangkan menjadi modal detail — untuk sekarang hanya info
            const p = adminPickupState.get(pid);
            if (p) alert('ID: ' + (p.PickupID||p.id||pid) + '\nNama: ' + (p.Nama||p.nama) + '\nStatus: ' + (p.Status||p.status));
        }

        async function updatePickupStatus({ row, id, status }) {
            const sheetStatus = sheetStatusFromClient(status || '');
            const params = new URLSearchParams();
            params.append('type', 'update_pickup');
            params.append('status', sheetStatus || status);
            if (row) params.append('row', String(Number(row)));
            if (id)  { params.append('id', String(id)); params.append('pickupId', String(id)); params.append('PickupID', String(id)); }
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });
            return { success: true };
        }

        async function handleReloadPickups(btn) {
            btn.classList.add('loading'); btn.disabled = true;
            try { await loadPickupsBackground(); }
            catch (err) { console.error(err); }
            finally { btn.classList.remove('loading'); btn.disabled = false; }
        }
        async function loadPickups() { await loadPickupsBackground(); }

        // ============================================================
        // ORDERS — RENDER dengan badge clickable (poin 2)
        // ============================================================
        function renderOrdersFromCache() {
            if (!adminOrdersCache || adminOrdersCache.length === 0) {
                const tBody = document.querySelector('#adminOrders .admin-table tbody');
                const empty = document.querySelector('#adminOrders .empty-state');
                if (tBody) tBody.innerHTML = '';
                if (empty) empty.style.display = 'block';
                return;
            }
            renderOrdersData(adminOrdersCache);
        }

        async function loadOrdersBackground() {
            const cachedOrders = AdminCache.get('orders');
            if (cachedOrders) {
                adminOrdersCache = cachedOrders;
                renderOrdersData(cachedOrders);
                if (adminOrdersIsFetching) return;
                adminOrdersIsFetching = true;
                try {
                    const url = APPS_SCRIPT_URL + '?type=list_orders&t=' + Date.now();
                    const controller = new AbortController();
                    const tid = setTimeout(() => controller.abort(), 20000);
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(tid);
                    if (!res.ok) return;
                    const json = await res.json();
                    // BUGFIX: Selalu gunakan data server (termasuk array kosong [])
                    if (json && json.success) {
                        adminOrdersCache = json.orders || [];
                        AdminCache.set('orders', adminOrdersCache);
                        renderOrdersData(adminOrdersCache);
                        updateAdminDashboard();
                    }
                } catch (err) { /* silent */ }
                finally { adminOrdersIsFetching = false; }
                return;
            }
            
            if (adminOrdersIsFetching) return;
            adminOrdersIsFetching = true;
            
            try {
                const url = APPS_SCRIPT_URL + '?type=list_orders&t=' + Date.now();
                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), 20000);
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(tid);
                
                if (!res.ok) return;
                const json = await res.json();
                
                // BUGFIX: Terima array kosong [] dan bersihkan cache + tampilan
                if (json && json.success) {
                    adminOrdersCache = json.orders || [];
                    AdminCache.set('orders', adminOrdersCache);
                    renderOrdersData(adminOrdersCache);
                    updateAdminDashboard();
                }
            } catch (err) {
                console.error('Fetch orders error:', err);
                const fallback = localStorage.getItem(CACHE_CONFIG.orders.key);
                if (fallback) {
                    try {
                        const { data } = JSON.parse(fallback);
                        adminOrdersCache = data;
                        renderOrdersData(data);
                    } catch (e) {}
                }
            } finally {
                adminOrdersIsFetching = false;
            }
        }

        function renderOrdersData(orders) {
            const tBody = document.querySelector('#adminOrders .admin-table tbody');
            const empty = document.querySelector('#adminOrders .empty-state');
            if (!tBody) return;
            // BUGFIX: Selalu bersihkan tabel sebelum render ulang agar data yang dihapus di Sheets langsung hilang
            tBody.innerHTML = '';
            if (!orders || orders.length === 0) {
                if (empty) empty.style.display = 'block';
                return;
            }
            if (empty) empty.style.display = 'none';

            const map = new Map();
            orders.forEach(o => {
                const key = String(o.OrderID || o.orderID || o.id || o.ID || 'row_' + (o._row || Math.random()));
                const existing = map.get(key);
                if (!existing) { map.set(key, o); }
                else {
                    const ta = new Date(existing.Timestamp || 0).getTime();
                    const tb = new Date(o.Timestamp || 0).getTime();
                    if (tb >= ta) map.set(key, o);
                }
            });
            const deduped = Array.from(map.values()).sort((a, b) =>
                new Date(b.Timestamp || 0).getTime() - new Date(a.Timestamp || 0).getTime()
            );

            // BUGFIX: tBody sudah di-clear di atas, langsung append semua baris baru
            deduped.forEach(o => {
                const oid      = String(o.OrderID || o.orderID || o.id || o.ID || 'row_' + (o._row || ''));
                const id       = o.OrderID || o.orderID || o.id || '';
                const nama     = o.Nama    || o.nama    || '';
                const toko     = o.NamaToko || o.namaToko || o.toko || '';
                const items    = o.Items   || o.items   || '';
                const quantity = o.Quantity || o.quantity || '';
                const status   = (o.Status || o.status || 'pending').toString().toLowerCase();
                const row      = o._row    || '';

                const tr = document.createElement('tr');
                tr.setAttribute('data-order-row-id', oid);
                tr.innerHTML = `<td>${id}</td><td>${nama}</td><td>${toko}</td><td>${items}</td><td>${quantity}</td><td class="ostatus-cell-${oid}"></td><td><button class="btn-update" data-oid="${oid}" data-row="${row}" data-id="${id}" onclick="handleSaveOrder(this)" style="padding:7px 18px;border-radius:8px;border:none;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">Simpan</button></td>`;
                const statusCell = tr.querySelector('.ostatus-cell-' + oid);
                if (statusCell) {
                    statusCell.innerHTML = '';
                    statusCell.appendChild(createStatusDropdown(status, row, id, oid, 'order'));
                }
                tBody.appendChild(tr);
                adminOrdersState.set(oid, o);
            });

            if (!tBody.querySelector('tr') && empty) empty.style.display = 'block';
        }

        async function updateOrderStatus({ row, id, status, nama, items }) {
            const params = new URLSearchParams();
            params.append('type', 'update_order');
            params.append('status', status);
            if (row)   params.append('row', String(Number(row)));
            if (id)    { params.append('id', String(id)); params.append('orderId', String(id)); params.append('OrderID', String(id)); }
            if (nama)  params.append('nama', String(nama));
            if (items) params.append('items', String(items));
            console.log('📤 updateOrderStatus kirim:', params.toString());
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });
            // mode no-cors: tidak bisa baca response, tapi data terkirim ke GAS
            showAdminToast('✅ Status tersimpan: ' + status, 'success');
            return { success: true };
        }

        // Toast notifikasi untuk admin
        function showAdminToast(msg, type) {
            let t = document.getElementById('admin-toast');
            if (!t) {
                t = document.createElement('div');
                t.id = 'admin-toast';
                t.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;max-width:400px;';
                document.body.appendChild(t);
            }
            const el = document.createElement('div');
            el.textContent = msg;
            el.style.cssText = 'padding:12px 16px;border-radius:10px;color:#fff;font-size:13px;font-weight:600;margin-bottom:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
            el.style.background = type === 'success' ? '#10b981' : '#ef4444';
            t.appendChild(el);
            setTimeout(() => el.remove(), 5000);
        }

        // Handler tombol Simpan untuk pesanan (poin 3)
        async function handleSaveOrder(btn) {
            const oid    = btn.dataset.oid;
            const row    = btn.dataset.row;
            const id     = btn.dataset.id;
            // Ambil status dari badge/dropdown di kolom status cell yang sama
            const td     = btn.closest('tr').querySelector('.ostatus-cell-' + oid);
            const badge  = td ? td.querySelector('.status-clickable') : null;
            // Get selected status from the dropdown wrap data
            const wrap   = td ? td.querySelector('.status-dropdown-wrap') : null;
            // The current selected value is stored on the badge's text - map back to val
            const labelToVal = {'Menunggu':'pending','Diproses':'processing','Selesai':'completed','Dibatalkan':'cancelled'};
            const currentLabel = badge ? badge.textContent.trim() : '';
            const status = labelToVal[currentLabel] || currentLabel;
            if (!status || status === '⏳ Menyimpan...') return;

            btn.textContent = '⏳...';
            btn.disabled = true;
            try {
                const result = await updateOrderStatus({ row, id, status });
                if (result && result.success !== false) {
                    btn.textContent = '✓ OK';
                    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                    setTimeout(() => { btn.textContent = 'Simpan'; btn.style.background = ''; btn.disabled = false; }, 1800);
                    setTimeout(() => loadOrdersBackground(), 1000);
                } else {
                    btn.textContent = '✗ Gagal';
                    btn.style.background = '#ef4444';
                    setTimeout(() => { btn.textContent = 'Simpan'; btn.style.background = ''; btn.disabled = false; }, 2000);
                }
            } catch(e) {
                btn.textContent = '✗ Error';
                btn.style.background = '#ef4444';
                setTimeout(() => { btn.textContent = 'Simpan'; btn.style.background = ''; btn.disabled = false; }, 2000);
            }
        }

        // Handler tombol Simpan untuk penjemputan (poin 3)
        async function handleSavePickup(btn) {
            const pid    = btn.dataset.pid;
            const row    = btn.dataset.row;
            const id     = btn.dataset.id;
            const td     = btn.closest('tr').querySelector('.status-cell-' + pid);
            const badge  = td ? td.querySelector('.status-clickable') : null;
            const labelToVal = {'Dijadwalkan':'scheduled','Dijemput':'picked','Diproses':'processed','Selesai':'completed','Dibatalkan':'cancelled'};
            const currentLabel = badge ? badge.textContent.trim() : '';
            const status = labelToVal[currentLabel] || normalizeStatus(currentLabel);
            if (!status || status === '⏳ Menyimpan...') return;

            btn.textContent = '⏳...';
            btn.disabled = true;
            try {
                const result = await updatePickupStatus({ row, id, status });
                if (result && result.success !== false) {
                    btn.textContent = '✓ OK';
                    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                    setTimeout(() => { btn.textContent = 'Simpan'; btn.style.background = ''; btn.disabled = false; }, 1800);
                    setTimeout(() => {
                        loadPickupsBackground();
                        // Jika selesai, refresh customers juga agar total limbah update
                        if (status === 'completed' || status === 'selesai') {
                            setTimeout(() => loadCustomersBackground(), 2000);
                        }
                    }, 1000);
                } else {
                    btn.textContent = '✗ Gagal';
                    btn.style.background = '#ef4444';
                    setTimeout(() => { btn.textContent = 'Simpan'; btn.style.background = ''; btn.disabled = false; }, 2000);
                }
            } catch(e) {
                btn.textContent = '✗ Error';
                btn.style.background = '#ef4444';
                setTimeout(() => { btn.textContent = 'Simpan'; btn.style.background = ''; btn.disabled = false; }, 2000);
            }
        }

        async function handleReloadOrders(btn) {
            btn.classList.add('loading'); btn.disabled = true;
            try { await loadOrdersBackground(); }
            catch (err) { console.error(err); }
            finally { btn.classList.remove('loading'); btn.disabled = false; }
        }
        async function loadOrders() { await loadOrdersBackground(); }

        // ============================================================
        // CUSTOMERS — render dengan level dari Sheets (poin 5)
        // ============================================================
        function renderCustomersFromCache() {
            if (!adminCustomersCache || adminCustomersCache.length === 0) {
                const tBody = document.querySelector('#adminCustomers .admin-table tbody');
                const empty = document.querySelector('#adminCustomers .empty-state');
                if (tBody) tBody.innerHTML = '';
                if (empty) empty.style.display = 'block';
                return;
            }
            renderCustomersData(adminCustomersCache);
        }

        async function loadCustomersBackground() {
            const cachedCustomers = AdminCache.get('customers');
            if (cachedCustomers) {
                adminCustomersCache = cachedCustomers;
                renderCustomersData(cachedCustomers);
                if (adminCustomersIsFetching) return;
                adminCustomersIsFetching = true;
                try {
                    const url = APPS_SCRIPT_URL + '?type=list_customers&t=' + Date.now();
                    const controller = new AbortController();
                    const tid = setTimeout(() => controller.abort(), 20000);
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(tid);
                    if (!res.ok) return;
                    const json = await res.json();
                    // BUGFIX: Selalu gunakan data server termasuk array kosong
                    if (json && json.success) {
                        adminCustomersCache = json.customers || [];
                        AdminCache.set('customers', adminCustomersCache);
                        renderCustomersData(adminCustomersCache);
                        updateAdminDashboard();
                    }
                } catch (err) { /* silent */ }
                finally { adminCustomersIsFetching = false; }
                return;
            }
            
            if (adminCustomersIsFetching) return;
            adminCustomersIsFetching = true;
            
            try {
                const url = APPS_SCRIPT_URL + '?type=list_customers&t=' + Date.now();
                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), 20000);
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(tid);
                
                if (!res.ok) return;
                const json = await res.json();
                
                // BUGFIX: Terima array kosong [] dan bersihkan cache + tampilan
                if (json && json.success) {
                    adminCustomersCache = json.customers || [];
                    AdminCache.set('customers', adminCustomersCache);
                    renderCustomersData(adminCustomersCache);
                    updateAdminDashboard();
                }
            } catch (err) {
                console.error('Fetch customers error:', err);
                const fallback = localStorage.getItem(CACHE_CONFIG.customers.key);
                if (fallback) {
                    try {
                        const { data } = JSON.parse(fallback);
                        adminCustomersCache = data;
                        renderCustomersData(data);
                    } catch (e) {}
                }
            } finally {
                adminCustomersIsFetching = false;
            }
        }

        function renderCustomersData(customers) {
            const tBody = document.querySelector('#adminCustomers .admin-table tbody');
            const empty = document.querySelector('#adminCustomers .empty-state');
            if (!tBody) return;
            // BUGFIX: Bersihkan tabel sebelum render ulang
            tBody.innerHTML = '';
            if (!customers || customers.length === 0) {
                if (empty) empty.style.display = 'block';
                return;
            }
            if (empty) empty.style.display = 'none';

            const map = new Map();
            customers.forEach(c => {
                const key = String(c.Nama || c.nama || 'row_' + (c._row || Math.random()));
                const existing = map.get(key);
                if (!existing) { map.set(key, c); }
                else {
                    if ((c._row || 0) >= (existing._row || 0)) map.set(key, c);
                }
            });
            const deduped = Array.from(map.values()).sort((a, b) => (b._row || 0) - (a._row || 0));

            deduped.forEach(function(c) {
                var key = String(c.Nama || c.nama || c._row || Math.random());
                var nama    = c.Nama || c.nama || '';
                var toko    = c.NamaToko || c.namaToko || c.toko || '';
                var telepon = c.Telepon || c.telepon || '';
                var total   = Number(c.TotalLimbah || c.totalLimbah || 0) || 0;
                var level   = c.Level || c.level || 'Belum Ada Level';
                var tr = document.createElement('tr');
                tr.setAttribute('data-cust-key', key);
                tr.innerHTML = '<td style="font-weight:600;">' + nama + '</td><td>' + toko + '</td><td>' + telepon + '</td><td style="font-weight:700;color:#10b981;">' + total + ' Koin</td><td>' + getLevelBadgeHTML(level) + '</td>';
                tBody.appendChild(tr);
            });
        }

        async function handleReloadCustomers(btn) {
            btn.classList.add('loading'); btn.disabled = true;
            try { await loadCustomersBackground(); }
            catch (err) { console.error(err); }
            finally { btn.classList.remove('loading'); btn.disabled = false; }
        }
        async function loadCustomers() { await loadCustomersBackground(); }

        // ============================================================
        // CLAIMS — poin 6
        // ============================================================
        function renderClaimsFromCache() {
            if (!adminClaimsCache || adminClaimsCache.length === 0) {
                const tBody = document.querySelector('#claimsTable tbody');
                const empty = document.getElementById('claimsEmpty');
                if (tBody) tBody.innerHTML = '';
                if (empty) empty.style.display = 'block';
                return;
            }
            renderClaimsData(adminClaimsCache);
        }

        async function loadClaimsBackground() {
            const cachedClaims = AdminCache.get('claims');
            if (cachedClaims) {
                adminClaimsCache = cachedClaims;
                renderClaimsData(cachedClaims);
                if (adminClaimsIsFetching) return;
                adminClaimsIsFetching = true;
                try {
                    const url = APPS_SCRIPT_URL + '?type=list_claims&t=' + Date.now();
                    const controller = new AbortController();
                    const tid = setTimeout(() => controller.abort(), 20000);
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(tid);
                    if (!res.ok) return;
                    const json = await res.json();
                    // BUGFIX: Selalu gunakan data server termasuk array kosong
                    if (json && json.success) {
                        adminClaimsCache = json.claims || [];
                        AdminCache.set('claims', adminClaimsCache);
                        renderClaimsData(adminClaimsCache);
                    }
                } catch (err) { /* silent */ }
                finally { adminClaimsIsFetching = false; }
                return;
            }
            
            if (adminClaimsIsFetching) return;
            adminClaimsIsFetching = true;
            
            try {
                const url = APPS_SCRIPT_URL + '?type=list_claims&t=' + Date.now();
                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), 20000);
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(tid);
                
                if (!res.ok) return;
                const json = await res.json();
                
                // BUGFIX: Terima array kosong [] dan bersihkan cache + tampilan
                if (json && json.success) {
                    adminClaimsCache = json.claims || [];
                    AdminCache.set('claims', adminClaimsCache);
                    renderClaimsData(adminClaimsCache);
                }
            } catch (err) {
                console.error('Fetch claims error:', err);
                const fallback = localStorage.getItem(CACHE_CONFIG.claims.key);
                if (fallback) {
                    try {
                        const { data } = JSON.parse(fallback);
                        adminClaimsCache = data;
                        renderClaimsData(data);
                    } catch (e) {}
                }
            } finally {
                adminClaimsIsFetching = false;
            }
        }

        function renderClaimsData(claims) {
            const tBody = document.querySelector('#claimsTable tbody');
            const empty = document.getElementById('claimsEmpty');
            if (!tBody) return;
            // BUGFIX: Bersihkan tabel sebelum render ulang
            tBody.innerHTML = '';
            if (!claims || claims.length === 0) {
                if (empty) empty.style.display = 'block';
                return;
            }
            if (empty) empty.style.display = 'none';

            [...claims].reverse().forEach(function(c) {
                var nama     = c.Nama || c.nama || '';
                var bank     = c.NamaBank || c.namaBank || c.bank || '';
                var rekening = c.NomorRekening || c.nomorRekening || c.rekening || '';
                var total    = c.TotalLimbah || c.totalLimbah || '';
                var level    = c.Level || c.level || '';
                var waktu    = c.WaktuDiajukan || c.waktuDiajukan || c.Timestamp || '';
                var waktuFmt = '-';
                try { waktuFmt = waktu ? new Date(waktu).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'; } catch(e){}

                // Key unik: nama + rekening
                var key = (nama + '|' + rekening + '|' + (c.WaktuDiajukan || c.Timestamp || '')).replace(/[^a-zA-Z0-9|_-]/g, '_');

                var newHTML = '<td style="font-weight:600;">' + nama + '</td>'
                    + '<td><span style="background:#eff6ff;color:#1e40af;padding:3px 8px;border-radius:6px;font-size:12px;font-weight:600;">' + bank + '</span></td>'
                    + '<td style="font-family:monospace;">' + rekening + '</td>'
                    + '<td style="font-weight:700;color:#10b981;">' + total + ' Koin</td>'
                    + '<td>' + getLevelBadgeHTML(level) + '</td>'
                    + '<td style="font-size:12px;color:#64748b;">' + waktuFmt + '</td>';

                var existingTr = tBody.querySelector('tr[data-claim-key="' + key + '"]');
                if (!existingTr) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-claim-key', key);
                    tr.innerHTML = newHTML;
                    tBody.appendChild(tr);
                } else if (existingTr.innerHTML !== newHTML) {
                    existingTr.innerHTML = newHTML;
                }
            });

            // tBody sudah di-clear di awal, tidak perlu cleanup tambahan
        }

        async function handleReloadClaims(btn) {
            btn.classList.add('loading'); btn.disabled = true;
            try { await loadClaimsBackground(); }
            catch (err) { console.error(err); }
            finally { btn.classList.remove('loading'); btn.disabled = false; }
        }

        function getLevelBadgeHTML(level) {
            const map = {
                'Grandmaster':   'background:linear-gradient(135deg,#1e1b4b,#312e81);color:#fff;',
                'Master':        'background:linear-gradient(135deg,#7c3aed,#4c1d95);color:#fff;',
                'Sapphire':      'background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;',
                'Ruby':          'background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;',
                'Emerald':       'background:linear-gradient(135deg,#059669,#065f46);color:#fff;',
                'Diamond':       'background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;',
                'Platinum':      'background:linear-gradient(135deg,#94a3b8,#64748b);color:#fff;',
                'Emas':          'background:linear-gradient(135deg,#ffd700,#f59e0b);color:#fff;',
                'Silver':        'background:linear-gradient(135deg,#c0c0c0,#94a3b8);color:#fff;',
                'Perunggu':      'background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;',
                'Belum Ada Level':'background:#f1f5f9;color:#94a3b8;'
            };
            const style = map[level] || map['Belum Ada Level'];
            return `<span style="${style}padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;">${level || 'Belum Ada Level'}</span>`;
        }

        // ============================================================
        // STYLING for clickable status badge
        // ============================================================
        const statusStyle = document.createElement('style');
        statusStyle.textContent = `
            .status-clickable { transition: all 0.2s; }
            .status-clickable:hover { opacity: 0.85; transform: scale(1.03); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .status-dropdown-item:hover { background: #f8fafc !important; }
        `;
        document.head.appendChild(statusStyle);

    

// ===== next block =====


// ============ AUTH BARU: MASUK / DAFTAR 2 LANGKAH ============
let tempRegisterData = {};

function switchAuthMode(mode) {
    document.getElementById('formMasuk').classList.remove('active');
    document.getElementById('formDaftar1').classList.remove('active');
    document.getElementById('formDaftar2').classList.remove('active');
    document.getElementById('formLupa').classList.remove('active');
    document.getElementById('formResetPassword').classList.remove('active');
    document.getElementById('colorDaftarText').style.display = 'none';

    if (mode === 'masuk') {
        document.getElementById('formMasuk').classList.add('active');
        document.getElementById('authColorSide').style.display = 'none';
    } else if (mode === 'lupa') {
        document.getElementById('formLupa').classList.add('active');
        document.getElementById('authColorSide').style.display = 'none';
    } else if (mode === 'resetPassword') {
        document.getElementById('formResetPassword').classList.add('active');
        document.getElementById('authColorSide').style.display = 'none';
    } else {
        document.getElementById('formDaftar1').classList.add('active');
        document.getElementById('authColorSide').style.display = 'flex';
        document.getElementById('colorDaftarText').style.display = 'block';
    }
}
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const openEye = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const closedEye = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    if (input.type === 'password') {
        input.type = 'text';
        btn.classList.add('active');
        btn.innerHTML = openEye;
    } else {
        input.type = 'password';
        btn.classList.remove('active');
        btn.innerHTML = closedEye;
    }
}

// STEP 1 DAFTAR: nama + kata sandi
function handleDaftarStep1() {
    const nama = document.getElementById('daftarNama').value.trim();
    const password = document.getElementById('daftarPassword').value.trim();

    if (!nama || !password) {
        alert('Mohon isi nama dan kata sandi');
        return;
    }

    const existing = JSON.parse(localStorage.getItem('sisaPlusCustomers') || '[]');
    const sudahAda = existing.find(c => c.nama.toLowerCase() === nama.toLowerCase());
    if (sudahAda) {
        alert('Nama ini sudah terdaftar di perangkat ini. Silakan Masuk.');
        return;
    }

    tempRegisterData = { nama, password };
    document.getElementById('formDaftar1').classList.remove('active');
    document.getElementById('formDaftar2').classList.add('active');
}

// STEP 2 DAFTAR: toko (opsional) + hp + alamat -> submit
function handleDaftarStep2() {
    const toko = document.getElementById('daftarToko').value.trim();
    const telepon = document.getElementById('daftarTelepon').value.trim();
    const alamat = document.getElementById('daftarAlamat').value.trim();

    if (!telepon || !alamat) {
        alert('Mohon isi nomor HP dan alamat');
        return;
    }

    const isAdmin = toko.toLowerCase() === 'admin';
    const loginData = {
        nama: tempRegisterData.nama,
        password: tempRegisterData.password,
        toko: toko || 'Rumah Tangga',
        telepon,
        alamat,
        isAdmin
    };

    const existingCustomers = JSON.parse(localStorage.getItem('sisaPlusCustomers') || '[]');
    existingCustomers.push(loginData);
    localStorage.setItem('sisaPlusCustomers', JSON.stringify(existingCustomers));
    localStorage.setItem('sisaPlusLogin', JSON.stringify(loginData));

    if (!isAdmin) {
        try {
            sendToSheet({
                type: 'customer',
                nama: loginData.nama,
                namaToko: loginData.toko,
                telepon: loginData.telepon,
                alamat: loginData.alamat,
                totalLimbah: 0,
                level: 'Belum Ada Level'
            });
        } catch (e) {
            console.error('Failed to send customer data on registration', e);
        }
    }

    executeLogin(loginData);
}

// MASUK: nama + kata sandi, dicocokkan dengan data tersimpan di perangkat ini
// Daftar akun admin khusus — nama & password tidak case-sensitive
const ADMIN_ACCOUNTS = [
    { nama: 'ridho', password: 'admin' },
    { nama: 'boy',   password: 'admin' }
];
function handleMasuk() {
    const nama = document.getElementById('masukNama').value.trim();
    const password = document.getElementById('masukPassword').value.trim();

    if (!nama || !password) {
        alert('Mohon isi nama dan kata sandi');
        return;
    }

    // Cek dulu apakah ini akun admin (nama & password bebas huruf besar/kecil)
    const adminMatch = ADMIN_ACCOUNTS.find(a =>
        a.nama.toLowerCase() === nama.toLowerCase() &&
        a.password.toLowerCase() === password.toLowerCase()
    );

    if (adminMatch) {
        const adminData = {
            nama: nama,
            toko: 'Admin',
            telepon: '',
            alamat: '',
            isAdmin: true
        };
        localStorage.setItem('sisaPlusLogin', JSON.stringify(adminData));
        executeLogin(adminData);
        return;
    }

    // Kalau bukan admin, cek akun customer biasa
    const existing = JSON.parse(localStorage.getItem('sisaPlusCustomers') || '[]');
    const found = existing.find(c =>
        c.nama.toLowerCase() === nama.toLowerCase() && c.password === password
    );

    if (!found) {
        alert('Nama atau kata sandi salah, atau Anda belum pernah daftar di perangkat ini.');
        return;
    }

    localStorage.setItem('sisaPlusLogin', JSON.stringify(found));
    executeLogin(found);
}
// Simpan sementara akun yang lolos verifikasi lupa password
let tempResetAccount = null;

function handleCekLupaPassword() {
    const nama = document.getElementById('lupaNama').value.trim();
    const telepon = document.getElementById('lupaTelepon').value.trim();

    if (!nama || !telepon) {
        alert('Mohon isi nama dan nomor HP');
        return;
    }

    const existing = JSON.parse(localStorage.getItem('sisaPlusCustomers') || '[]');
    const found = existing.find(c =>
        c.nama.toLowerCase() === nama.toLowerCase() && c.telepon === telepon
    );

    if (!found) {
        alert('Nama dan nomor HP tidak cocok dengan data yang terdaftar di perangkat ini.');
        return;
    }

    tempResetAccount = found;
    switchAuthMode('resetPassword');
}

function handleSimpanPasswordBaru() {
    const passwordBaru = document.getElementById('resetPasswordBaru').value;

    if (!passwordBaru) {
        alert('Mohon isi kata sandi baru');
        return;
    }
    if (!tempResetAccount) {
        alert('Sesi reset tidak valid, silakan ulangi dari awal.');
        switchAuthMode('masuk');
        return;
    }

    const existing = JSON.parse(localStorage.getItem('sisaPlusCustomers') || '[]');
    const idx = existing.findIndex(c =>
        c.nama.toLowerCase() === tempResetAccount.nama.toLowerCase() &&
        c.telepon === tempResetAccount.telepon
    );

    if (idx === -1) {
        alert('Akun tidak ditemukan, silakan ulangi dari awal.');
        switchAuthMode('masuk');
        return;
    }

    existing[idx].password = passwordBaru;
    localStorage.setItem('sisaPlusCustomers', JSON.stringify(existing));

    tempResetAccount = null;
    alert('Kata sandi berhasil diubah! Silakan masuk dengan kata sandi baru.');
    switchAuthMode('masuk');
}

// Fungsi untuk mengeksekusi tampilan masuk
function executeLogin(data) {
    saveAccountToList(data);   // <-- BARIS BARU
    document.getElementById('landing-wrapper').style.display = 'none';
    document.getElementById('app-wrapper').style.display = 'block';
    document.body.classList.add('app-mode');
    document.body.classList.remove('landing-mode');
    document.getElementById('login-layer').style.display = 'none';
    // Pastikan overlay tidak muncul dari sesi sebelumnya
    var overlay = document.getElementById('successOverlay');
    if (overlay) overlay.classList.remove('active');
    var orderModal = document.getElementById('orderModal');
    if (orderModal) orderModal.classList.remove('active');

    if (data.isAdmin) {
        document.getElementById('adminView').classList.add('active');
        document.getElementById('customerView').classList.remove('active');
        var adminNav = document.querySelector('.admin-nav');
        var custNav  = document.querySelector('.bottom-nav-wrapper');
        if (adminNav) adminNav.classList.add('visible');
        if (custNav)  custNav.style.display  = 'none';

        // 🚀 Start polling untuk real-time updates
        initAdminPickupPolling();
        
        // 🚀 OPTIMIZED: Load semua data PARALLEL (bukan sequential!) = 75% lebih cepat
        Promise.all([
            loadOrdersBackground().catch(e => console.error(e)),
            loadCustomersBackground().catch(e => console.error(e)),
            loadClaimsBackground().catch(e => console.error(e))
        ]).then(() => {
            console.log('✅ All admin data loaded in PARALLEL!');
            updateAdminDashboard();
        });
        
        // Setup auto-refresh intervals
        if (!adminOrdersAutoRefreshId) 
            adminOrdersAutoRefreshId = setInterval(loadOrdersBackground, 20000);
        if (!adminCustomersAutoRefreshId) 
            adminCustomersAutoRefreshId = setInterval(loadCustomersBackground, 30000);
        if (!window.adminClaimsAutoRefreshId) 
            window.adminClaimsAutoRefreshId = setInterval(loadClaimsBackground, 60000);
    } else {
        document.getElementById('customerView').classList.add('active');
        document.getElementById('adminView').classList.remove('active');
        var adminNav2 = document.querySelector('.admin-nav');
        var custNav2  = document.querySelector('.bottom-nav-wrapper');
        if (custNav2)  custNav2.classList.add('visible');
        if (adminNav2) adminNav2.classList.remove('visible');
        document.getElementById('userName').textContent = data.nama;
        // Isi header subtitle
        var hToko = document.getElementById('headerToko');
        if (hToko) hToko.textContent = data.toko || '-';
        // Isi halaman profil — semua field baru
        var pName = document.getElementById('profileName');
        if (pName) pName.textContent = data.nama || 'User';
        var pToko = document.getElementById('profileToko');
        if (pToko) pToko.textContent = 'Toko: ' + (data.toko || '-');
        var pInfoNama = document.getElementById('profileInfoNama');
        if (pInfoNama) pInfoNama.textContent = data.nama || '-';
        var pInfoToko = document.getElementById('profileInfoToko');
        if (pInfoToko) pInfoToko.textContent = data.toko || '-';
        var pInfoTel = document.getElementById('profileInfoTelepon');
        if (pInfoTel) pInfoTel.textContent = data.telepon || '-';
        var pInfoAlamat = document.getElementById('profileInfoAlamat');
        if (pInfoAlamat) pInfoAlamat.textContent = data.alamat || '-';
	var pickAlamatInput = document.getElementById('pickupAlamat');
	if (pickAlamatInput && !pickAlamatInput.value) pickAlamatInput.value = data.alamat || '';
        initCustomer();
    }
}

// Cek otomatis saat halaman pertama kali dibuka
window.addEventListener('DOMContentLoaded', () => {
    const savedLogin = localStorage.getItem('sisaPlusLogin');
    if (savedLogin) {
        const data = JSON.parse(savedLogin);
        // Langsung masuk ke app tanpa klik tombol Masuk lagi
        document.getElementById('landing-wrapper').style.display = 'none';
        document.getElementById('app-wrapper').style.display = 'block';
        document.body.classList.add('app-mode');
        document.body.classList.remove('landing-mode');
        executeLogin(data);
        restoreLastPage(data); // <-- fungsi baru, dibuat di Langkah 3
    }
});
// Validasi Nomor HP: Hanya boleh angka (0-9) dengan maksimal 13 digit
const daftarTelepon = document.getElementById('daftarTelepon');
if (daftarTelepon) {
    daftarTelepon.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 13);
    });
}

// Navigasi keyboard: Enter = submit sesuai form aktif
(function() {
    const masukFields = ['masukNama', 'masukPassword'];
    masukFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); handleMasuk(); }
        });
    });

    const daftar1Fields = ['daftarNama', 'daftarPassword'];
    daftar1Fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); handleDaftarStep1(); }
        });
    });

    const daftar2Fields = ['daftarToko', 'daftarTelepon', 'daftarAlamat'];
    daftar2Fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); handleDaftarStep2(); }
        });
    });
})();
    

// ===== next block =====


        // Firebase Configuration - CDN tidak aktif untuk sekarang
        // Fokus ke Apps Script untuk pengiriman data penjemputan
    

// ===== next block =====


// ============================================================
// GLUE: Penghubung Landing Page ↔ Web Utama
// ============================================================
function showApp(action) {
    document.getElementById('landing-wrapper').style.display = 'none';
    document.getElementById('app-wrapper').style.display = 'block';
    document.body.classList.add('app-mode');
    document.body.classList.remove('landing-mode');
    // Jika ada action, simpan untuk dipakai setelah login
    if (action) {
        sessionStorage.setItem('pendingAction', action);
    }
}

function backToLanding() {
    document.getElementById('app-wrapper').style.display = 'none';
    document.getElementById('landing-wrapper').style.display = 'block';
    document.body.classList.remove('app-mode');
    document.body.classList.add('landing-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setelah login berhasil, cek apakah ada pending action (misal: langsung buka sipick)
var _origExecuteLogin = typeof executeLogin === 'function' ? executeLogin : null;
document.addEventListener('DOMContentLoaded', function() {
    // Override executeLogin agar setelah masuk, pending action dijalankan
    if (typeof executeLogin === 'function') {
        var origExec = executeLogin;
        window.executeLogin = function(data) {
            origExec(data);
            var pendingAction = sessionStorage.getItem('pendingAction');
            if (pendingAction) {
                sessionStorage.removeItem('pendingAction');
                if (pendingAction === 'sipick') {
                    // Tunggu sebentar agar DOM terender dulu
                    setTimeout(function() {
                        var sipickBtn = document.querySelector('.nav-item[onclick*="sipickPage"]');
                        switchPage('sipickPage', sipickBtn);
                    }, 150);
                }
            }
        };
    }
});
// ============================================================
// FITUR BERITA (News) — placeholder pakai localStorage
// Nantinya bisa disambungkan ke Google Sheets seperti data lain
// ============================================================
const NEWS_STORAGE_KEY = 'sisaNewsList';

function getNewsList() {
    try {
        return JSON.parse(localStorage.getItem(NEWS_STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function saveNewsList(list) {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(list));
}

function formatNewsDate(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
        return '';
    }
}

// ---- Render daftar berita di sisi Customer ----

function escapeNewsHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

// ---- Admin: tambah & render berita ----
// ============================================================
// BERITA — kini tersambung ke Google Sheets
// ============================================================
var adminNewsCache = null;

function saveNewsCache(list) {
    try { localStorage.setItem('sisaNewsCache', JSON.stringify(list)); } catch(e) {}
}
function getNewsCache() {
    try { return JSON.parse(localStorage.getItem('sisaNewsCache') || 'null'); } catch(e) { return null; }
}

async function loadNewsFromServer() {
    // Kalau belum ada di memori, coba ambil dari localStorage dulu
    if (adminNewsCache === null) {
        const cached = getNewsCache();
        if (cached) adminNewsCache = cached;
    }
    try {
        const url = APPS_SCRIPT_URL + '?type=list_news&t=' + Date.now();
        const res = await fetch(url);
        const json = await res.json();
        if (json && json.success) {
            adminNewsCache = json.news || [];
            saveNewsCache(adminNewsCache);
        }
    } catch (err) {
        console.error('Gagal memuat berita:', err);
    }
    return adminNewsCache || [];
}

async function submitNewsAdmin() {
    const titleEl = document.getElementById('newsFormTitle');
    const contentEl = document.getElementById('newsFormContent');
    const gambarEl = document.getElementById('newsFormGambar');
    const kategoriEl = document.getElementById('newsFormKategori');
    const isTopEl = document.getElementById('newsFormIsTop');

    const title = (titleEl.value || '').trim();
    const content = (contentEl.value || '').trim();
    const gambar = (gambarEl ? gambarEl.value : '').trim();
    const kategori = kategoriEl ? kategoriEl.value : 'Lingkungan';
    const isTop = isTopEl ? isTopEl.checked : false;

    if (!title || !content) {
        alert('Judul dan isi berita wajib diisi');
        return;
    }

    try {
        // FIX: sebelumnya fungsi ini pakai fetch() polos tanpa fallback CORS
        // dan tanpa membaca respons sukses/gagal dari server, jadi kalau ada
        // masalah pengiriman field kategori/isTop, tidak ada cara untuk tahu.
        // Sekarang pakai sendToSheetNow() yang sama dengan fitur lain (pickup/
        // order/claim) - sudah punya fallback no-cors dan pembacaan respons JSON.
        const result = await sendToSheetNow({
            type: 'news',
            judul: title,
            isi: content,
            gambarUrl: gambar,
            kategori: kategori,
            isTop: isTop ? 'ya' : 'tidak'
        });

        console.log('Hasil submit berita:', result);

        titleEl.value = '';
        contentEl.value = '';
        if (gambarEl) gambarEl.value = '';
        if (isTopEl) isTopEl.checked = false;
        if (kategoriEl) kategoriEl.value = 'Lingkungan';
        await renderNewsAdmin();
        if (typeof showToast === 'function') showToast('Berita berhasil ditambahkan', 'success');
    } catch (err) {
        alert('Gagal menambahkan berita: ' + err);
    }
}

async function deleteNewsAdmin(id) {
    if (!confirm('Hapus berita ini?')) return;
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ type: 'delete_news', newsId: id }).toString()
        });
        await renderNewsAdmin();
    } catch (err) {
        alert('Gagal menghapus berita: ' + err);
    }
}

async function renderNewsAdmin() {
    const tbody = document.querySelector('#newsTable tbody');
    const emptyState = document.getElementById('newsEmpty');
    if (!tbody) return;

    const list = await loadNewsFromServer();

    if (list.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = list.map(news => {
        const id = news.NewsID || news.id || '';
        const title = news.Judul || '';
        const image = news.GambarURL || '';
        const date = news.Timestamp || '';
        return `<tr>
            <td><img src="${image}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;" onerror="this.style.opacity=0.2"></td>
            <td>${escapeNewsHtml(title)}</td>
            <td>${formatNewsDate(date)}</td>
            <td><button class="btn-update" style="background:linear-gradient(135deg,#ef4444,#dc2626);" onclick="deleteNewsAdmin('${id}')">Hapus</button></td>
        </tr>`;
    }).join('');
}

let currentNewsCategory = 'Semua';

function filterNewsCategory(cat, btn) {
    currentNewsCategory = cat;
    document.querySelectorAll('.news-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderNewsList();
}

async function renderNewsList() {
    const topContainer = document.getElementById('newsTopContainer');
    const container = document.getElementById('newsListContainer');
    if (!container) return;

    // Coba ambil dari localStorage dulu kalau memori masih kosong
    if (adminNewsCache === null) {
        const cached = getNewsCache();
        if (cached) adminNewsCache = cached;
    }
    // Baru tampilkan "Memuat..." kalau BENAR-BENAR belum ada data sama sekali
    if (adminNewsCache === null) {
        container.innerHTML = '<div style="text-align:center;padding:30px 0;color:#94a3b8;font-size:14px;">Memuat berita...</div>';
    }

    let list = await loadNewsFromServer();
    // ... (baris-baris setelah ini TIDAK perlu diubah, biarkan seperti semula)

    if (currentNewsCategory !== 'Semua') {
        list = list.filter(n => (n.Kategori || '') === currentNewsCategory);
    }

    const topNews = list
    .filter(n => (n.IsTop || '').toString().toLowerCase() === 'ya')
    .sort((a, b) => new Date(b.Timestamp || 0) - new Date(a.Timestamp || 0))
    .slice(0, 5);
    const regularNews = list.filter(n => (n.IsTop || '').toString().toLowerCase() !== 'ya');

    const topLabel = document.getElementById('newsTopLabel');
    if (topLabel) topLabel.style.display = topNews.length > 0 ? 'block' : 'none';

   if (topContainer) {
    topContainer.innerHTML = `<div class="news-top-scroll">${topNews.map((news, index) => {
    const id = news.NewsID || news.id || '';
    const title = news.Judul || '';
    const image = news.GambarURL || '';
    const date = news.Timestamp || '';
    return `<div class="news-top-card" onclick="openNewsDetail('${id}')">
        <img src="${image}" onerror="this.style.display='none'">
        <div class="news-top-overlay">
            <div class="news-top-badge">#${index + 1} Top Berita</div>
            <div style="font-size:20px;font-weight:800;">${escapeNewsHtml(title)}</div>
            <div style="font-size:12px;margin-top:8px;opacity:0.85;">${formatNewsDate(date)}</div>
        </div>
    </div>`;
}).join('')}</div>
    ${topNews.length > 1 ? '<div class="news-top-dots">' + topNews.map(() => '<div class="news-top-dot"></div>').join('') + '</div>' : ''}`;
}
	
const scrollEl = topContainer ? topContainer.querySelector('.news-top-scroll') : null;
const dotsEl = topContainer ? topContainer.querySelector('.news-top-dots') : null;
if (scrollEl && dotsEl) {
    const dots = dotsEl.querySelectorAll('.news-top-dot');
    if (dots[0]) dots[0].classList.add('active');
    scrollEl.addEventListener('scroll', () => {
        const index = Math.round(scrollEl.scrollLeft / scrollEl.clientWidth);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    });
}
    

    if (regularNews.length === 0 && topNews.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding:40px 10px;">
                <div class="empty-state-icon">📰</div>
                <h3>Belum Ada Berita</h3>
                <p>Berita dan info terbaru dari SISA+ akan muncul di sini</p>
            </div>`;
        return;
    }

  container.innerHTML = regularNews.map(news => {
    const id = news.NewsID || news.id || '';
    const title = news.Judul || '';
    const image = news.GambarURL || '';
    const date = news.Timestamp || '';
    const kategori = news.Kategori || '';
    const views = news.Dibaca || news.Views || '0';
    return `<div class="news-card" onclick="openNewsDetail('${id}')">
        <div class="news-card-img">${image ? '<img src="' + image + '" onerror="this.style.display=\'none\'">' : '📷'}</div>
        <div class="news-card-body">
            ${kategori ? '<span class="news-category-label">' + escapeNewsHtml(kategori) + '</span>' : ''}
            <div class="news-card-title">${escapeNewsHtml(title)}</div>
            <div class="news-card-meta">
                <div class="news-card-meta-left">
                    <span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${formatNewsDate(date)}
                    </span>
                    <span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        ${views}
                    </span>
                </div>
                <button class="news-card-bookmark" onclick="event.stopPropagation()">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>`;
}).join('');
}

async function openNewsDetail(id) {
    const list = await loadNewsFromServer();
    const news = list.find(n => (n.NewsID || n.id) === id);
    if (!news) {
        alert('Berita tidak ditemukan');
        return;
    }

    const detailEl = document.getElementById('newsDetailContent');
    if (detailEl) {
        detailEl.innerHTML = `
            ${news.GambarURL ? '<img src="' + news.GambarURL + '" style="width:100%;border-radius:12px;margin-bottom:16px;" onerror="this.style.display=\'none\'">' : ''}
            <h2 style="font-size:20px;font-weight:800;color:#1e293b;margin-bottom:8px;">${escapeNewsHtml(news.Judul || '')}</h2>
            <div style="font-size:13px;color:#94a3b8;margin-bottom:16px;">${formatNewsDate(news.Timestamp)}</div>
            <div style="font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${escapeNewsHtml(news.Isi || '')}</div>
        `;
    }
    switchPage('newsDetailPage', null);
}
// ============================================================
// ADMIN — MANAJEMEN PRODUK
// ============================================================
function renderProductsFromCache() {
    if (!adminProductsCache || adminProductsCache.length === 0) {
        const tBody = document.querySelector('#productsTable tbody');
        const empty = document.getElementById('productsEmpty');
        if (tBody) tBody.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    renderProductsData(adminProductsCache);
}

async function loadProductsBackground() {
    const cached = AdminCache.get('products');
    if (cached) {
        adminProductsCache = cached;
        renderProductsData(cached);
    }
    if (adminProductsIsFetching) return;
    adminProductsIsFetching = true;
    try {
        const url = APPS_SCRIPT_URL + '?type=list_products&t=' + Date.now();
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 20000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(tid);
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.success) {
            adminProductsCache = json.products || [];
            AdminCache.set('products', adminProductsCache);
            renderProductsData(adminProductsCache);
        }
    } catch (err) {
        console.error('Fetch products error:', err);
    } finally {
        adminProductsIsFetching = false;
    }
}

function renderProductsData(products) {
    const tBody = document.querySelector('#productsTable tbody');
    const empty = document.getElementById('productsEmpty');
    if (!tBody) return;
    tBody.innerHTML = '';
    if (!products || products.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    [...products].reverse().forEach(function(p) {
        var id       = p.ProductID || p.id || '';
        var nama     = p.NamaProduk || '';
        var harga    = p.Harga || 0;
        var gambar   = p.GambarURL || '';
        var kategori = p.Kategori || 'lainnya';
        var status   = p.Status || 'aktif';

        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td><img src="' + gambar + '" style="width:44px;height:44px;object-fit:cover;border-radius:8px;" onerror="this.style.opacity=0.2"></td>' +
            '<td style="font-weight:600;">' + nama + '</td>' +
            '<td>Rp' + Number(harga).toLocaleString('id-ID') + '</td>' +
            '<td><span style="background:#eff6ff;color:#1e40af;padding:3px 8px;border-radius:6px;font-size:12px;">' + kategori + '</span></td>' +
            '<td><span style="background:' + (status === 'aktif' ? '#dcfce7;color:#166534' : '#fee2e2;color:#991b1b') + ';padding:3px 8px;border-radius:6px;font-size:12px;">' + status + '</span></td>' +
            '<td>' +
                '<button onclick="editProductAdmin(\'' + id + '\')" style="padding:5px 10px;background:#eff6ff;color:#2563eb;border:none;border-radius:6px;font-size:12px;cursor:pointer;margin-right:6px;">Edit</button>' +
                '<button onclick="deleteProductAdmin(\'' + id + '\')" style="padding:5px 10px;background:#fee2e2;color:#991b1b;border:none;border-radius:6px;font-size:12px;cursor:pointer;">Hapus</button>' +
            '</td>';
        tBody.appendChild(tr);
    });
}

async function handleReloadProducts(btn) {
    btn.classList.add('loading'); btn.disabled = true;
    try { await loadProductsBackground(); }
    catch (err) { console.error(err); }
    finally { btn.classList.remove('loading'); btn.disabled = false; }
}
// ============================================================
// BANNER — tampil di customer SiMart (maks 4) + CRUD admin
// ============================================================
var adminBannersCache = null;

async function loadBannersToSimart() {
    var track = document.getElementById('simartBannerTrack');
    var dotsWrap = document.getElementById('simartBannerDots');
    if (!track) return;

    try {
        var resp = await fetch(APPS_SCRIPT_URL + '?type=list_banners&t=' + Date.now());
        var json = await resp.json();
        var banners = (json.banners || []).slice(0, 4);

      if (!banners.length) {
            track.innerHTML = '<div class="simart-banner-card">' +
                '<div class="simart-banner-overlay">' +
                    '<button class="simart-banner-btn" onclick="showApp(\'sipick\')">Belanja Sekarang</button>' +
                '</div>' +
            '</div>';
            dotsWrap.innerHTML = '';
            return;
        }

        track.innerHTML = banners.map(function (b) {
            return '<div class="simart-banner-card" style="background-image:url(\'' + (b.GambarURL || '') + '\');">' +
                '<div class="simart-banner-overlay">' +
                    '<h3 class="simart-banner-title">' + (b.Judul || '') + '</h3>' +
                    '<p class="simart-banner-desc">' + (b.Subjudul || '') + '</p>' +
                    '<button class="simart-banner-btn" onclick="showApp(\'sipick\')">Belanja Sekarang</button>' +
                '</div>' +
            '</div>';
        }).join('');

        dotsWrap.innerHTML = banners.map(function (_, i) {
            return '<div class="simart-banner-dot' + (i === 0 ? ' active' : '') + '"></div>';
        }).join('');

        track.onscroll = function () {
            var idx = Math.round(track.scrollLeft / track.clientWidth);
            dotsWrap.querySelectorAll('.simart-banner-dot').forEach(function (d, i) {
                d.classList.toggle('active', i === idx);
            });
        };
    } catch (err) {
        console.error('Gagal load banner', err);
        track.innerHTML = '<div class="simart-banner-card">' +
            '<div class="simart-banner-overlay">' +
                '<button class="simart-banner-btn" onclick="showApp(\'sipick\')">Belanja Sekarang</button>' +
            '</div>' +
        '</div>';
        dotsWrap.innerHTML = '';
    }
}

async function loadBannersAdmin() {
    try {
        var resp = await fetch(APPS_SCRIPT_URL + '?type=list_banners&t=' + Date.now());
        var json = await resp.json();
        adminBannersCache = json.banners || [];
        renderBannersAdminTable(adminBannersCache);
    } catch (err) { console.error(err); }
}

function renderBannersAdminTable(banners) {
    var tBody = document.querySelector('#bannersTable tbody');
    var empty = document.getElementById('bannersEmpty');
    if (!banners.length) { tBody.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    tBody.innerHTML = banners.map(function (b) {
        return '<tr>' +
            '<td><img src="' + (b.GambarURL || '') + '" style="width:60px;height:36px;object-fit:cover;border-radius:6px;"></td>' +
            '<td>' + (b.Judul || '') + '</td>' +
            '<td>' + (b.Subjudul || '') + '</td>' +
            '<td>' +
                '<button onclick="editBannerAdmin(\'' + b.BannerID + '\')" style="margin-right:6px;">✏️</button>' +
                '<button onclick="deleteBannerAdmin(\'' + b.BannerID + '\')">🗑️</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

async function submitBannerAdmin() {
    var id = document.getElementById('bannerFormId').value;
    var judul = document.getElementById('bannerFormJudul').value.trim();
    var subjudul = document.getElementById('bannerFormSubjudul').value.trim();
    var gambar = document.getElementById('bannerFormGambar').value.trim();

    if (!judul || !gambar) { alert('Judul dan gambar wajib diisi'); return; }
    if (!id && adminBannersCache && adminBannersCache.length >= 4) {
        alert('Maksimal 4 banner aktif. Hapus salah satu dulu untuk menambah yang baru.');
        return;
    }

    var btn = document.getElementById('bannerSubmitBtn');
    btn.disabled = true; btn.textContent = 'Menyimpan...';

    var payload = {
        type: id ? 'update_banner' : 'banner',
        judul: judul,
        subjudul: subjudul,
        gambarUrl: gambar
    };
    if (id) payload.bannerId = id;

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(payload).toString()
        });
        resetBannerForm();
        await loadBannersAdmin();
    } catch (err) {
        alert('Gagal menyimpan banner: ' + err);
    } finally {
        btn.disabled = false;
        btn.textContent = id ? 'Simpan Perubahan' : '+ Tambah Banner';
    }
}

function editBannerAdmin(id) {
    var b = (adminBannersCache || []).find(function (x) { return x.BannerID === id; });
    if (!b) return;
    document.getElementById('bannerFormId').value = id;
    document.getElementById('bannerFormJudul').value = b.Judul || '';
    document.getElementById('bannerFormSubjudul').value = b.Subjudul || '';
    document.getElementById('bannerFormGambar').value = b.GambarURL || '';
    document.getElementById('bannerSubmitBtn').textContent = 'Simpan Perubahan';
}

function resetBannerForm() {
    document.getElementById('bannerFormId').value = '';
    document.getElementById('bannerFormJudul').value = '';
    document.getElementById('bannerFormSubjudul').value = '';
    document.getElementById('bannerFormGambar').value = '';
    document.getElementById('bannerSubmitBtn').textContent = '+ Tambah Banner';
}

async function deleteBannerAdmin(id) {
    if (!confirm('Hapus banner ini?')) return;
    await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ type: 'delete_banner', bannerId: id }).toString()
    });
    await loadBannersAdmin();
}

async function handleReloadBanners(btn) {
    btn.classList.add('loading'); btn.disabled = true;
    try { await loadBannersAdmin(); }
    finally { btn.classList.remove('loading'); btn.disabled = false; }
}

async function submitProductAdmin() {
    var id       = document.getElementById('productFormId').value;
    var nama     = document.getElementById('productFormNama').value.trim();
    var harga    = document.getElementById('productFormHarga').value;
    var gambar   = document.getElementById('productFormGambar').value.trim();
    var kategori = document.getElementById('productFormKategori').value;

    if (!nama || !harga) { alert('Nama dan harga wajib diisi'); return; }

    var btn = document.getElementById('productSubmitBtn');
    btn.disabled = true; btn.textContent = 'Menyimpan...';

    var payload = {
        type: id ? 'update_product' : 'product',
        namaProduk: nama,
        harga: harga,
        gambarUrl: gambar,
        kategori: kategori
    };
    if (id) payload.productId = id;

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(payload).toString()
        });
        resetProductForm();
        AdminCache.clear('products');
        await loadProductsBackground();
        if (typeof showAdminToast === 'function') showAdminToast('✅ Produk tersimpan', 'success');
    } catch (err) {
        alert('Gagal menyimpan produk: ' + err);
    } finally {
        btn.disabled = false;
        btn.textContent = id ? 'Simpan Perubahan' : '+ Tambah Produk';
    }
}

function editProductAdmin(id) {
    var p = (adminProductsCache || []).find(x => (x.ProductID || x.id) === id);
    if (!p) return;
    document.getElementById('productFormId').value = id;
    document.getElementById('productFormNama').value = p.NamaProduk || '';
    document.getElementById('productFormHarga').value = p.Harga || '';
    document.getElementById('productFormGambar').value = p.GambarURL || '';
    document.getElementById('productFormKategori').value = p.Kategori || 'lainnya';
    document.getElementById('productSubmitBtn').textContent = 'Simpan Perubahan';
    document.getElementById('adminProducts').scrollIntoView({ behavior: 'smooth' });
}

function resetProductForm() {
    document.getElementById('productFormId').value = '';
    document.getElementById('productFormNama').value = '';
    document.getElementById('productFormHarga').value = '';
    document.getElementById('productFormGambar').value = '';
    document.getElementById('productFormKategori').value = 'maggot';
    document.getElementById('productSubmitBtn').textContent = '+ Tambah Produk';
}

async function deleteProductAdmin(id) {
    if (!confirm('Yakin hapus produk ini?')) return;
    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ type: 'delete_product', productId: id }).toString()
        });
        AdminCache.clear('products');
        await loadProductsBackground();
    } catch (err) {
        alert('Gagal menghapus produk: ' + err);
    }
}
// ============================================================
// CUSTOMER — LOAD PRODUK DARI SHEET (SiMart)
// ============================================================
var simartProductCache = null; // cache di memori (untuk sesi berjalan)

function saveSimartCache(products) {
    try { localStorage.setItem('sisaSimartProductsCache', JSON.stringify(products)); } catch(e) {}
}
function getSimartCache() {
    try { return JSON.parse(localStorage.getItem('sisaSimartProductsCache') || 'null'); } catch(e) { return null; }
}

async function loadSimartProducts() {
    const grid = document.getElementById('simartProductsGrid');
    if (!grid) return;

    // 1. Kalau belum ada cache di memori, coba ambil dari localStorage (data terakhir)
    if (!simartProductCache) {
        simartProductCache = getSimartCache();
    }
    // 2. Kalau ada (dari memori ATAU localStorage), langsung tampilkan — tanpa "Memuat..."
    if (simartProductCache) {
        renderSimartProducts(simartProductCache.filter(p => (p.Status || 'aktif') === 'aktif'));
    }

    // 3. Tetap fetch data terbaru dari server di belakang layar
    try {
        const url = APPS_SCRIPT_URL + '?type=list_products&t=' + Date.now();
        const res = await fetch(url);
        const json = await res.json();
        if (json && json.success) {
            simartProductCache = json.products || [];
            saveSimartCache(simartProductCache);
            renderSimartProducts(simartProductCache.filter(p => (p.Status || 'aktif') === 'aktif'));
        }
    } catch (err) {
        console.error('Gagal memuat produk SiMart:', err);
        // hanya kasih pesan gagal kalau memang belum ada data sama sekali (termasuk di localStorage)
        if (!simartProductCache) {
            grid.innerHTML = '<div style="text-align:center;padding:20px 0;color:#ef4444;font-size:14px;grid-column:1/-1;">Gagal memuat produk</div>';
        }
    }
}

function renderSimartProducts(products) {
    const grid = document.getElementById('simartProductsGrid');
    if (!grid) return;

    if (!products || products.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:20px 0;color:#94a3b8;font-size:14px;grid-column:1/-1;">Belum ada produk tersedia</div>';
        return;
    }

   grid.innerHTML = products.map(function(p) {
        var nama     = p.NamaProduk || '';
        var harga    = Number(p.Harga || 0);
        var gambar   = p.GambarURL || 'https://via.placeholder.com/300';
        var kategori = p.Kategori || 'lainnya';
        var hargaFmt = harga > 0 ? ('Rp' + harga.toLocaleString('id-ID')) : 'Hubungi untuk harga';

       return '<div class="product-card" data-category="' + kategori + '">' +
    '<div class="product-image">' +
        '<img src="' + gambar + '" alt="' + nama + '" style="width:100%;height:100%;object-fit:cover;display:block;">' +
    '</div>' +
    '<div class="product-info">' +
        '<div class="product-name-row">' +
            '<div class="product-name">' + nama + '</div>' +
            '<button class="product-fav-btn" type="button" onclick="event.stopPropagation();this.classList.toggle(\'active\')">' +
                '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-4.5-9.5-9C0.7 8 2 4.5 5.5 4a5 5 0 0 1 6.5 2 5 5 0 0 1 6.5-2C22 4.5 23.3 8 21.5 12 19 16.5 12 21 12 21z"/></svg>' +
            '</button>' +
        '</div>' +
        '<div class="product-price">' + hargaFmt + '</div>' +
        '<button class="btn-order" onclick="showBuyOptions(\'' + nama.replace(/'/g, "\\'") + '\',' + harga + ',\'' + gambar.replace(/'/g, "\\'") + '\')">Beli</button>' +
    '</div>' +
'</div>';
    }).join('');
}
// ============================================================
// FILTER KATEGORI SIMART
// ============================================================
function filterSimartCategory(cat, btn) {
    document.querySelectorAll('.simart-cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('#simartProductsGrid .product-card').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================================
        // NOTIFIKASI
        // ============================================================
        function getNotifKey() { return 'sisaNotif_' + getUserSuffix(); }

        function getNotifications() {
            return JSON.parse(localStorage.getItem(getNotifKey()) || '[]');
        }

        function saveNotifications(list) {
            localStorage.setItem(getNotifKey(), JSON.stringify(list));
            updateNotifBadge();
        }

        function pushNotification(title, desc) {
            const list = getNotifications();
            list.unshift({ title, desc, waktu: new Date().toISOString(), read: false });
            saveNotifications(list.slice(0, 30)); // simpan max 30 terbaru
        }

        function updateNotifBadge() {
            const unread = getNotifications().filter(n => !n.read).length;
            ['notifBadgeHome', 'notifBadgeSimart'].forEach(id => {
                const badge = document.getElementById(id);
                if (!badge) return;
                badge.textContent = unread > 9 ? '9+' : unread;
                badge.classList.toggle('show', unread > 0);
            });
        }

        function timeAgo(iso) {
            const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
            if (diffMin < 1) return 'Baru saja';
            if (diffMin < 60) return diffMin + ' menit lalu';
            const diffJam = Math.floor(diffMin / 60);
            if (diffJam < 24) return diffJam + ' jam lalu';
            return Math.floor(diffJam / 24) + ' hari lalu';
        }

        function openNotifPanel() {
            const list = getNotifications();
            const container = document.getElementById('notifItemsList');
            if (!container) return;
            if (!list.length) {
                container.innerHTML = '<div style="text-align:center;padding:24px 0;color:#94a3b8;font-size:14px;">Belum ada notifikasi</div>';
            } else {
                container.innerHTML = list.map(n =>
                    '<div style="padding:12px 0;border-bottom:1px solid #f1f5f9;' + (n.read ? '' : 'background:#f8fafc;') + '">' +
                        '<div style="font-size:13px;font-weight:600;color:#1e293b;">' + n.title + '</div>' +
                        '<div style="font-size:12px;color:#64748b;margin-top:2px;">' + n.desc + '</div>' +
                        '<div style="font-size:11px;color:#94a3b8;margin-top:4px;">' + timeAgo(n.waktu) + '</div>' +
                    '</div>'
                ).join('');
            }
            list.forEach(n => n.read = true);
            saveNotifications(list);
        }

function openPickField(id) {
    const el = document.getElementById(id);
    if (id === 'pickupDate' && el.showPicker) {
        el.showPicker();
    } else {
        el.focus();
    }
}

function updatePickLabel(inputId, labelId, defaultText, suffix) {
    const val = document.getElementById(inputId).value;
    document.getElementById(labelId).textContent = val ? (val + (suffix || '')) : defaultText;
}


// ===== MODAL INPUT BERAT — SiPick =====
function openWeightModal() {
    const overlay = document.getElementById('weightModalOverlay');
    const input = document.getElementById('weightModalInput');
    const currentWeight = document.getElementById('pickupWeight').value;
    
    // Isi input modal dengan nilai yang sudah ada (jika ada)
    input.value = currentWeight || '';
    
    overlay.classList.add('active');
    
    // Fokus ke input setelah animasi
    setTimeout(() => input.focus(), 100);
}

function closeWeightModal(e) {
    // Jika ada event dan target bukan overlay, jangan tutup
    if (e && e.target !== document.getElementById('weightModalOverlay')) return;
    document.getElementById('weightModalOverlay').classList.remove('active');
}

function setWeight(kg) {
    document.getElementById('weightModalInput').value = kg;
}

function submitWeight() {
    const input = document.getElementById('weightModalInput');
    const weight = parseInt(input.value);
    
    if (!weight || weight < 1) {
        showToast('Mohon masukkan berat minimal 1 kg', 'error');
        return;
    }
    
    // Update input tersembunyi
    document.getElementById('pickupWeight').value = weight;
    
    // Update label di card
    document.getElementById('weightLabel').textContent = weight + ' kg';
    
    // Tutup modal
    closeWeightModal();
    
    showToast('Berat ' + weight + ' kg tersimpan', 'success');
}

// ===== CUSTOM DATE PICKER LOGIC =====
let pickerCurrentDate = new Date();
let pickerSelectedDate = null;

function openDatePicker() {
    const overlay = document.getElementById('datePickerOverlay');
    pickerCurrentDate = new Date();
    pickerSelectedDate = null;
    renderCalendar();
    overlay.classList.add('active');
}

function closeDatePicker(e) {
    if (e && e.target !== document.getElementById('datePickerOverlay')) return;
    document.getElementById('datePickerOverlay').classList.remove('active');
}

function changeMonth(delta) {
    pickerCurrentDate.setMonth(pickerCurrentDate.getMonth() + delta);
    renderCalendar();
}

function renderCalendar() {
    const year = pickerCurrentDate.getFullYear();
    const month = pickerCurrentDate.getMonth();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    document.getElementById('pickerMonthYear').textContent = monthNames[month] + ' ' + year;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    const daysContainer = document.getElementById('pickerDays');
    daysContainer.innerHTML = '';
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'date-picker-day empty';
        daysContainer.appendChild(empty);
    }
    
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'date-picker-day';
        dayEl.textContent = day;
        
        const currentDate = new Date(year, month, day);
        
        // Check if today
        if (currentDate.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }
        
        // Check if selected
        if (pickerSelectedDate && currentDate.toDateString() === pickerSelectedDate.toDateString()) {
            dayEl.classList.add('selected');
        }
        
        // Check if past date (disable)
        if (currentDate < new Date(today.setHours(0, 0, 0, 0))) {
            dayEl.style.opacity = '0.3';
            dayEl.style.cursor = 'not-allowed';
        } else {
            dayEl.onclick = () => selectDate(day);
        }
        
        daysContainer.appendChild(dayEl);
    }
}

function selectDate(day) {
    const year = pickerCurrentDate.getFullYear();
    const month = pickerCurrentDate.getMonth();
    pickerSelectedDate = new Date(year, month, day);
    
    // Format: YYYY-MM-DD for input
    const formatted = pickerSelectedDate.toISOString().split('T')[0];
    document.getElementById('pickupDate').value = formatted;
    
    // Update label
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateLabel').textContent = pickerSelectedDate.toLocaleDateString('id-ID', options);
    
    renderCalendar();
    
    // Auto close after selection
    setTimeout(() => closeDatePicker(), 300);
}

function selectToday() {
    const today = new Date();
    pickerCurrentDate = new Date(today);
    pickerSelectedDate = new Date(today);
    
    const formatted = today.toISOString().split('T')[0];
    document.getElementById('pickupDate').value = formatted;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateLabel').textContent = today.toLocaleDateString('id-ID', options);
    
    renderCalendar();
    closeDatePicker();
}

// Modify existing openPickField function
function openPickField(id) {
    if (id === 'pickupDate') {
        openDatePicker();
    } else {
        const el = document.getElementById(id);
        if (el) el.focus();
    }
}

// Register Service Worker untuk PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}