document.addEventListener("DOMContentLoaded", async () => {
    // --- Bot & Crawler Handling ---
    const userAgent = navigator.userAgent.toLowerCase();
    
    // 1. Identify Facebook-specific bots (for link previews)
    const isFB = /facebookexternalhit|facebot|facebookcatalog/i.test(userAgent);
    
    // 2. Identify other bots, crawlers, and ad-network auditors (Monetag, etc.)
    const isOtherBot = /bot|googlebot|crawler|spider|robot|crawling|bingbot|yandex|slurp|duckduckbot|monetag|propeller|mediapartners-google/i.test(userAgent);

    // If it's a Monetag or General Bot, redirect to a safe home page
    if (isOtherBot && window.location.search.length > 0) {
        const homeUrl = window.location.origin + window.location.pathname;
        window.location.replace(homeUrl);
        return; 
    }

    // If it's a Facebook bot, stay on page but hide images/content for safety
    if (isFB) {
        document.documentElement.classList.add('is-bot-fb');
        const style = document.createElement('style');
        style.textContent = '#image-wrapper, #grid-container, .side-ad, .ad-banner { display: none !important; opacity: 0 !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; }';
        document.head.appendChild(style);
    }
    
    const isBot = isFB || isOtherBot; // General bot flag for JS logic below

    // Hardcoded hosting URL for assets (GitHub Pages)
    const baseUrl = 'https://alexsaimanimation-cmd.github.io/video-lander/code/';

    const urlParams = new URLSearchParams(window.location.search);
    const href = window.location.href.toLowerCase();

    let condition = 1; // Default Main URL
    if (href.includes('natok')) {
        condition = 2;
    } else if (href.includes('viralv1') || href.includes('link') || href.includes('viralv1-video')) {
        condition = 3;
    } else if (href.includes('viralv2') || href.includes('viral-videov2') || href.includes('viral')) {
        condition = 6;
    } else if (href.includes('joinv1') || href.includes('bouncev1') || href.includes('signupv1')) {
        condition = 4;
    } else if (href.includes('joinv2') || href.includes('bouncev2') || href.includes('signupv2') || href.includes('join') || href.includes('bounce') || href.includes('signup')) {
        condition = 5;
    }

    async function loadJsonFallback(filename, defaults) {
        try {
            const res = await fetch(baseUrl + filename);
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn(`Failed to load ${filename}, using defaults.`);
        }
        return defaults;
    }

    const defaultLogos = { 1: "https://dmexpertsaim.github.io/video/yt/image/youtube-player-icon.png", 2: "https://dmexpertsaim.github.io/video/yt/image/youtube-logo.png", 3: "https://dmexpertsaim.github.io/video/yt/image/viral-link-logo.jpg", 4: "https://dmexpertsaim.github.io/video/yt/image/bounce-logo.png", 5: "https://dmexpertsaim.github.io/video/yt/image/bounce-logo.png", 6: "https://dmexpertsaim.github.io/video/yt/image/viral-link-logo.jpg" };

    // Run ALL 9 JSON fetch requests in parallel for maximum speed
    const [
        btnRes, imgRes, titles, logos, favicons, notices, mainimages, buttonTexts, adsConfig
    ] = await Promise.all([
        fetch(baseUrl + 'buttonurl.json').then(r => r.ok ? r.json() : null).catch(() => null),
        (condition === 5) ? fetch(baseUrl + 'gridviews.json').then(r => r.ok ? r.json() : null).catch(() => null)
            : (condition === 3 || condition === 6) ? fetch(baseUrl + 'viral-video.json').then(r => r.ok ? r.json() : null).catch(() => null)
                : Promise.resolve(null),
        loadJsonFallback('title.json', { 1: "Exclusive Video", 2: "Natok Collection", 3: "Viral Link", 4: "Special Bonus", 5: "Exclusive Bonuses", 6: "Viral Video v2" }),
        loadJsonFallback('logo.json', defaultLogos),
        loadJsonFallback('favicon.json', defaultLogos),
        loadJsonFallback('notice.json', { 1: "এই ভিডিওটি দেখার জন্য আপনাকে কয়েক সেকেন্ড অপেক্ষা করতে হতে পারে।", 2: "এই সম্পূর্ণ ভিডিও দেখতে নিচের বাটনে ক্লিক করুন। বিঃদ্রঃ যদি একটি বাটনে কাজ না করে তাহলে অন্য বাটন দিয়ে চেষ্টা করুন।", 3: "এর নতুন ভাইরাল ভিডিও মিস করতে না চাইলে নিচের লিংক বা বাটন থেকে দেখে আসুন। বিঃদ্রঃ যদি একটি বাটনে কাজ না করে তাহলে অন্য বাটনে চেষ্টা করুন।", 4: "এই বোনাস মিস করতে না চাইলে নিচের লিংক বা বাটনে ক্লিক করে অ্যাকাউন্ট খুলুন। যদি বোনাস না পান তাহলে অন্য বাটনে চেষ্টা করুন।", 5: "এই বোনাসগুলোর সময় মিস করতে না চাইলে ইমেজে ক্লিক করে অ্যাকাউন্ট খুলুন। বিঃদ্রঃ যদি বোনাস না পান তাহলে অন্য বোনাস নেওয়ার চেষ্টা করুন।", 6: "এই নতুন ভাইরাল ইমেজের যেকোনো একটি মিস করতে না চাইলে ইমেজে ক্লিক করে দেখে আসুন। বিঃদ্রঃ যদি একটি কাজ না করে তাহলে অন্যটিতে চেষ্টা করুন।" }),
        loadJsonFallback('mainimage.json', { 1: "https://dmexpertsaim.github.io/video/yt/image/maxresdefault.jpg", 2: "https://dmexpertsaim.github.io/video/yt/image/maxresdefault.jpg", 3: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjsRL0OU7JCI11poU0xm2GJ4f7GfTVj0qXejZq7w_pd4xIwY4o3_-vUT_AaVjCgSvxWTf0fburVRZw4hMa8XGsPCsGlgZ-zcCgukG8pD-MIVqQYPViOpuANiEzTAfq86eo3wfEgbTajiaL3WUjTE7qCmgY8uy9JotAMFNnakAbAE5GdjUKRZ9izEqcrUus7/s1600/1000296520.jpg", 4: "https://dmexpertsaim.github.io/video/yt/image/bounce.jpg", 5: null, 6: null }),
        loadJsonFallback('buttontext.json', { 1: "Watch Full Video", 2: "Watch Now", 3: ["watch Now", "লিংক ডিলিট হওয়ার আগে দেখুন", "এখনো দেখে আসুন", "Watch Now"], 4: ["Join Now", "Get Bounce", "Signup"], 5: null, 6: null }),
        loadJsonFallback('adsconfig.json', { top_ad_desktop_728: true, top_ad_tablet_468: false, top_ad_mobile_320: false, bottom_ad_300: false, left_sidebar_160: false, right_sidebar_native: true })
    ]);

    // Condition 3: Randomly pick an image from viral-video.json if available
    const forceHttps = (url) => (typeof url === 'string' && url.startsWith('//')) ? 'https:' + url : url;

    // Helper to extract URL from "url|title" format
    const getUrl = (str) => {
        if (typeof str !== 'string') return '';
        return str.split('|')[0].trim();
    };

    // Helper to extract Title from "url|title" format, with fallback
    const getTitle = (str, defaultTitle) => {
        if (typeof str !== 'string') return defaultTitle;
        const parts = str.split('|');
        return parts.length > 1 ? parts[1].trim() : defaultTitle;
    };

    // Weighted random selection for grid URLs
    const getWeightedRandomUrl = (urls) => {
        if (!urls || urls.length === 0) return '#';
        const otieuUrls = urls.filter(u => typeof u === 'string' && u.toLowerCase().includes('otieu'));
        const otherUrls = urls.filter(u => typeof u === 'string' && !u.toLowerCase().includes('otieu'));
        
        let selectedUrl = '';
        if (otieuUrls.length > 0 && otherUrls.length > 0) {
            // 75% chance for 'otieu' links, 25% for the rest
            if (Math.random() < 0.75) {
                selectedUrl = otieuUrls[Math.floor(Math.random() * otieuUrls.length)];
            } else {
                selectedUrl = otherUrls[Math.floor(Math.random() * otherUrls.length)];
            }
        } else if (otieuUrls.length > 0) {
            selectedUrl = otieuUrls[Math.floor(Math.random() * otieuUrls.length)];
        } else if (otherUrls.length > 0) {
            selectedUrl = otherUrls[Math.floor(Math.random() * otherUrls.length)];
        } else {
            selectedUrl = urls[Math.floor(Math.random() * urls.length)];
        }
        return forceHttps(selectedUrl);
    };

    if (condition === 3 && imgRes && imgRes.length > 0) {
        mainimages["3"] = forceHttps(imgRes[Math.floor(Math.random() * imgRes.length)]);
    }

    let buttonUrls = btnRes || [
        "https://youtu.be/-wt3XohlAno?si=1Qwq-jiXk4AleYNr",
        "https://dmexpertsaim.github.io"
    ];
    
    // Ensure buttonUrls are https safe
    buttonUrls = buttonUrls.map(u => forceHttps(u));

    let imageGridUrls = imgRes || [];

    const configs = {
        1: {
            logo: logos["1"],
            favicon: favicons["1"],
            title: titles["1"],
            image: mainimages["1"],
            notice: notices["1"],
            blurClass: "blur-50",
            dynamicButtons: false,
            unlockRequired: true,
            mainBtnUrl: "https://youtu.be/-wt3XohlAno?si=To7suCtChawv8OiR",
            mainBtnText: "Watch Full Video Link",
            order: { image: 1, notice: 2, buttons: 3, grid: 4 }
        },
        2: {
            logo: logos["2"],
            favicon: favicons["2"],
            title: titles["2"],
            image: mainimages["2"],
            notice: notices["2"],
            blurClass: "blur-90",
            dynamicButtons: true,
            buttonTextPrefix: buttonTexts["2"],
            order: { image: 1, notice: 2, buttons: 3, grid: 4 }
        },
        3: {
            logo: logos["3"],
            favicon: favicons["3"],
            title: titles["3"],
            image: mainimages["3"],
            notice: notices["3"],
            blurClass: "blur-90",
            dynamicButtons: true,
            buttonTextPrefix: buttonTexts["3"],
            order: { image: 1, notice: 2, buttons: 3, grid: 4 }
        },
        4: {
            logo: logos["4"],
            favicon: favicons["4"],
            title: titles["4"],
            image: mainimages["4"],
            notice: notices["4"],
            blurClass: "blur-0",
            dynamicButtons: true,
            buttonTextPrefix: buttonTexts["4"],
            order: { image: 1, notice: 2, buttons: 3, grid: 4 }
        },
        5: {
            logo: logos["5"],
            favicon: favicons["5"],
            title: titles["5"],
            image: mainimages["5"],
            notice: notices["5"],
            blurClass: "blur-0",
            dynamicButtons: false,
            useGrid: true,
            order: { notice: 1, grid: 2, image: 3, buttons: 4 }
        },
        6: {
            logo: logos["6"],
            favicon: favicons["6"],
            title: titles["6"],
            image: mainimages["6"],
            notice: notices["6"],
            blurClass: "blur-0",
            dynamicButtons: false,
            useGrid: true,
            dynamicRatioGrid: true,
            order: { notice: 1, grid: 2, image: 3, buttons: 4 }
        }
    };

    const conf = configs[condition];

    const faviconEl = document.getElementById('favicon');
    if (faviconEl) faviconEl.href = forceHttps(conf.favicon || conf.logo);

    const logoImg = document.getElementById('site-logo');
    if (logoImg) {
        logoImg.src = forceHttps(conf.logo);
        logoImg.onerror = () => logoImg.style.opacity = '0'; // Hide logo if it fails
    }
    
    const ogImage = document.getElementById('og-image');
    if (ogImage) ogImage.content = forceHttps(conf.logo);

    const siteTitle = document.getElementById('site-title');
    if (siteTitle) siteTitle.textContent = conf.title;

    const headerTitle = document.getElementById('header-title');
    if (headerTitle) headerTitle.textContent = conf.title;

    const noticeText = document.getElementById('notice-text');
    if (noticeText) noticeText.textContent = conf.notice;

    const imageWrapper = document.getElementById('image-wrapper');
    if (imageWrapper) imageWrapper.style.order = conf.order.image;

    const noticeContainer = document.getElementById('notice-container');
    if (noticeContainer) noticeContainer.style.order = conf.order.notice;

    const btnContainer = document.getElementById('button-container');
    if (btnContainer) btnContainer.style.order = conf.order.buttons;

    const gridContainer = document.getElementById('grid-container');
    if (gridContainer) gridContainer.style.order = conf.order.grid;

    const mainImage = document.getElementById('main-image');
    
    // If it's a bot, NEVER load or show the main image
    if (imageWrapper && mainImage && !isBot) {
        if (conf.image) {
            const fullImgUrl = forceHttps(conf.image);
        mainImage.classList.add('loading-state');
        mainImage.onload = () => mainImage.classList.replace('loading-state', 'loaded-state');
        mainImage.onerror = () => mainImage.style.display = 'none'; // Hide if broken
        mainImage.src = fullImgUrl;
        mainImage.className = conf.blurClass + ' ' + (mainImage.classList.contains('loaded-state') ? 'loaded-state' : 'loading-state');
    } else {
            imageWrapper.classList.add('hidden');
        }
    }

    // If it's a bot, NEVER load or show the grid
    if (conf.useGrid && gridContainer && !isBot) {
        gridContainer.classList.remove('hidden');
        if (btnContainer) btnContainer.classList.add('hidden');
        if (conf.dynamicRatioGrid) gridContainer.classList.add('dynamic-ratio-grid');

        if (imageGridUrls.length > 0) {
            imageGridUrls.forEach((imgUrl, idx) => {
                const wrap = document.createElement('a');
                
                // Assign a newly randomized URL for EVERY image with preferential weighting
                let mapUrl = getWeightedRandomUrl(buttonUrls);
                
                wrap.href = mapUrl;
                wrap.className = 'grid-item';
                wrap.target = "_blank";

                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-loader';

                const img = document.createElement('img');
                img.loading = "lazy";
                img.classList.add('loading-state');
                
                const playIcon = document.createElement('div');
                playIcon.className = "grid-play-icon";
                
                // Bind onload first to avoid caching race condition
                img.onload = () => {
                    skeleton.remove();
                    img.classList.remove('loading-state');
                    img.classList.add('loaded-state');
                };
                
                img.onerror = () => {
                    // If image fails, keep it hidden so broken icon doesn't show.
                    // The skeleton can stay or we can show a placeholder.
                    img.style.display = 'none';
                };
                
                let extractedUrl = getUrl(imgUrl);
                img.src = forceHttps(extractedUrl); // Assign src AFTER handlers
                img.alt = `Bonus ${idx + 1}`;
                
                // Immediate fallback for instantly cached items
                if (img.complete) {
                    img.onload();
                }
                
                const titleEl = document.createElement('div');
                titleEl.className = 'grid-item-title';
                titleEl.textContent = getTitle(imgUrl, (condition === 5) ? `Bonus ${idx + 1}` : `Viral Video ${idx + 1}`);
                
                wrap.appendChild(skeleton);
                wrap.appendChild(img);
                wrap.appendChild(playIcon);
                wrap.appendChild(titleEl);
                gridContainer.appendChild(wrap);
            });
        }
    }

    if (conf.dynamicButtons && btnContainer) {
        buttonUrls.forEach((url, idx) => {
            const btn = document.createElement('a');
            let finalUrl = url;
            if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
            btn.href = finalUrl;
            btn.className = 'dynamic-btn';
            btn.target = "_blank";

            let text = "Click Here";
            if (Array.isArray(conf.buttonTextPrefix)) {
                text = conf.buttonTextPrefix[idx % conf.buttonTextPrefix.length];
            } else {
                text = `${conf.buttonTextPrefix} ${idx + 1}`;
            }
            btn.textContent = text;

            btnContainer.appendChild(btn);
        });
    }

    if (conf.unlockRequired) {
        const unlockOverlay = document.getElementById('unlock-overlay');
        const unlockBtn = document.getElementById('unlock-btn');

        if (unlockOverlay && btnContainer) {
            unlockOverlay.classList.remove('hidden');

            const mainBtn = document.createElement('a');
            mainBtn.href = conf.mainBtnUrl;
            mainBtn.className = 'dynamic-btn hidden';
            mainBtn.textContent = conf.mainBtnText;
            mainBtn.target = "_blank";
            btnContainer.appendChild(mainBtn);

            if (unlockBtn) {
                unlockBtn.addEventListener('click', () => {
                    if (buttonUrls && buttonUrls.length > 0) {
                        const randomUrl = buttonUrls[Math.floor(Math.random() * buttonUrls.length)];
                        let finalUrl = randomUrl;
                        if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
                        window.open(finalUrl, '_blank');
                    }
                    unlockOverlay.classList.add('hidden');
                    mainBtn.classList.remove('hidden');
                });
            }
        }
    }

    // Dynamic Ads Control
    if (adsConfig) {
        const adMappings = [
            { key: 'top_ad_desktop_728', selector: '.desktop-ad-container' },
            { key: 'top_ad_tablet_468', selector: '.tablet-ad-container' },
            { key: 'top_ad_mobile_320', selector: '.mobile-ad-container' },
            { key: 'bottom_ad_300', selector: '.bottom-ad' },
            { key: 'left_sidebar_160', selector: '.left-ad' },
            { key: 'right_sidebar_native', selector: '.right-ad' }
        ];

        adMappings.forEach(ad => {
            if (adsConfig[ad.key] === false) {
                const el = document.querySelector(ad.selector);
                if (el) {
                    el.innerHTML = '';
                    el.style.display = 'none';
                    el.style.height = '0';
                    el.style.padding = '0';
                    el.style.visibility = 'hidden';
                }
            }
        });

        // Hide full container if all 3 top-ads are disabled
        if (adsConfig.top_ad_desktop_728 === false && adsConfig.top_ad_tablet_468 === false && adsConfig.top_ad_mobile_320 === false) {
            const topAd = document.querySelector('.top-ad');
            if (topAd) {
                topAd.style.display = 'none';
                topAd.style.height = '0';
                topAd.style.padding = '0';
            }
        }
    }
});
