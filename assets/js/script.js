
document.addEventListener('DOMContentLoaded', () => {

    // ================================================================
    // 1. LOADING SCREEN
    // ================================================================
    const loader = document.getElementById('ai-loader');
    const LOADER_DURATION = 2200; // ms
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger hero stagger after loader fades
            setTimeout(() => {
                triggerHeroStagger();
                startTypewriter();
            }, 400);
        }, LOADER_DURATION);
    } else {
        triggerHeroStagger();
        startTypewriter();
    }

    // ================================================================
    // 2. CURSOR GLOW + DOT (RAF-driven, zero lag)
    // ================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorDot = document.getElementById('cursor-dot');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;
    let dotX = mouseX, dotY = mouseY;

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function animateCursor() {
        // Large glow: slow lerp
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        // Small dot: fast lerp
        dotX += (mouseX - dotX) * 0.22;
        dotY += (mouseY - dotY) * 0.22;

        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        if (cursorDot) {
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ================================================================
    // 3. TYPEWRITER for hero role
    // ================================================================
    const ROLES = [
        'Data Scientist',
        'ML Engineer',
        'AI Developer',
        'Data Analyst'
    ];
    let roleIdx = 0, charIdx = 0, isDeleting = false;
    const twEl = document.getElementById('typewriter-el');

    function startTypewriter() {
        if (!twEl) return;
        typeTick();
    }

    function typeTick() {
        if (!twEl) return;
        const current = ROLES[roleIdx];
        if (isDeleting) {
            twEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
        } else {
            twEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = isDeleting ? 55 : 90;

        if (!isDeleting && charIdx === current.length) {
            delay = 1800; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % ROLES.length;
            delay = 400;
        }
        setTimeout(typeTick, delay);
    }

    // ================================================================
    // 4. HERO STAGGER FADE-IN
    // ================================================================
    function triggerHeroStagger() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('animated');
        const heroImg = document.querySelector('.hero-image');
        if (heroImg) {
            heroImg.style.opacity = '0';
            heroImg.style.transform = 'translateX(30px)';
            heroImg.style.transition = 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s';
            setTimeout(() => {
                heroImg.style.opacity = '1';
                heroImg.style.transform = 'translateX(0)';
            }, 50);
        }
    }

    // ================================================================
    // 5. SCROLL REVEAL — Enhanced with stagger delay
    // ================================================================
    // Basic elements (no stagger)
    const revealElements = document.querySelectorAll('.section-title, .project-card, .skill-card-minimal, .timeline-item, .cert-card, .compact-card, .edu-node-map-wrapper, .about-text-glow-box, .about-highlights');
    revealElements.forEach(el => el.classList.add('reveal-stagger'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    revealElements.forEach(el => revealObserver.observe(el));


    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            document.body.classList.toggle('body-no-scroll', isActive);

            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.classList.remove('body-no-scroll');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });


    // ============================================================
    // AI IDENTITY CORE — Futuristic Profile Animation
    // ============================================================
    const coreCanvas = document.getElementById('core-canvas');
    const aiCore = document.getElementById('aiCore');
    const hexFrame = document.getElementById('hexFrame');
    const hexRef = document.querySelector('.hex-reflection');

    if (coreCanvas && aiCore) {
        const cc = coreCanvas.getContext('2d');
        let CW, CH, ccx, ccy;
        let cmouse = { x: -9999, y: -9999 };
        let cmouseSmooth = { x: -9999, y: -9999 };

        const coreResize = () => {
            CW = coreCanvas.width = aiCore.offsetWidth;
            CH = coreCanvas.height = aiCore.offsetHeight;
            ccx = CW / 2;
            ccy = CH / 2;
        };

        // ── Colors ────────────────────────────────────────────────
        const C = ['#00D4FF', '#7B5FFF', '#00FFB3', '#A78BFA', '#38BDF8', '#F472B6'];

        // ── Orbiting particles ────────────────────────────────────
        class CoreParticle {
            constructor() { this.init(); }
            init() {
                this.orbit = 100 + Math.random() * 80;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = (0.003 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1);
                this.size = 1.5 + Math.random() * 2;
                this.color = C[Math.floor(Math.random() * C.length)];
                this.phase = Math.random() * Math.PI * 2;
                this.phaseSpd = 0.02 + Math.random() * 0.02;
                // For magnetic distortion
                this.baseOrbit = this.orbit;
            }
            update() {
                this.angle += this.speed;
                this.phase += this.phaseSpd;
                // Magnetic distortion when mouse is near
                const mx = cmouseSmooth.x, my = cmouseSmooth.y;
                const tgtX = ccx + Math.cos(this.angle) * this.baseOrbit;
                const tgtY = ccy + Math.sin(this.angle) * this.baseOrbit;
                const dMouse = Math.hypot(tgtX - mx, tgtY - my);
                const magnet = Math.max(0, 1 - dMouse / 100);
                // Push particles away from cursor slightly
                if (magnet > 0 && dMouse > 1) {
                    const pushX = ((tgtX - mx) / dMouse) * magnet * 18;
                    const pushY = ((tgtY - my) / dMouse) * magnet * 18;
                    this.x = tgtX + pushX;
                    this.y = tgtY + pushY;
                } else {
                    this.x = tgtX;
                    this.y = tgtY;
                }
            }
            draw(prox) {
                const pulse = 1 + Math.sin(this.phase) * 0.35;
                const s = this.size * pulse * (prox > 0.2 ? 1 + prox : 1);
                const gAlpha = prox > 0.2 ? 0.8 : 0.35;
                // Glow halo
                const grd = cc.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 5);
                grd.addColorStop(0, this.color);
                grd.addColorStop(1, 'transparent');
                cc.beginPath();
                cc.arc(this.x, this.y, s * 5, 0, Math.PI * 2);
                cc.fillStyle = grd;
                cc.globalAlpha = gAlpha * 0.35;
                cc.fill();
                cc.globalAlpha = 1;
                // Core
                cc.beginPath();
                cc.arc(this.x, this.y, s, 0, Math.PI * 2);
                cc.fillStyle = this.color;
                cc.shadowBlur = prox > 0.2 ? 20 + prox * 18 : 8;
                cc.shadowColor = this.color;
                cc.fill();
                cc.shadowBlur = 0;
            }
        }

        // ── Edge sparks ───────────────────────────────────────────
        class Spark {
            constructor() { this.init(); }
            init() {
                const a = Math.random() * Math.PI * 2;
                const r = 105 + Math.random() * 20;
                this.x = ccx + Math.cos(a) * r;
                this.y = ccy + Math.sin(a) * r;
                this.vx = (Math.random() - 0.5) * 2.5;
                this.vy = (Math.random() - 0.5) * 2.5;
                this.life = 1;
                this.decay = 0.012 + Math.random() * 0.015;
                this.color = C[Math.floor(Math.random() * C.length)];
                this.size = 1 + Math.random() * 1.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;
            }
            draw() {
                if (this.life <= 0) return;
                cc.beginPath();
                cc.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
                cc.fillStyle = this.color;
                cc.globalAlpha = this.life * 0.7;
                cc.shadowBlur = 10;
                cc.shadowColor = this.color;
                cc.fill();
                cc.shadowBlur = 0;
                cc.globalAlpha = 1;
            }
        }

        // ── Energy arcs ───────────────────────────────────────────
        class EnergyArc {
            constructor() { this.init(); }
            init() {
                this.startAngle = Math.random() * Math.PI * 2;
                this.arcLen = 0.4 + Math.random() * 0.8;
                this.radius = 108 + Math.random() * 15;
                this.speed = 0.008 + Math.random() * 0.006;
                this.phase = 0;
                this.color = C[Math.floor(Math.random() * 3)];
                this.width = 0.8 + Math.random() * 1;
                this.life = 1;
                this.decay = 0.003 + Math.random() * 0.002;
            }
            update() {
                this.startAngle += this.speed;
                this.life -= this.decay;
            }
            draw(prox) {
                if (this.life <= 0) return;
                const alpha = this.life * (prox > 0.1 ? 0.6 + prox * 0.4 : 0.3);
                cc.beginPath();
                cc.arc(ccx, ccy, this.radius, this.startAngle, this.startAngle + this.arcLen);
                cc.strokeStyle = this.color;
                cc.lineWidth = this.width * (prox > 0.2 ? 1 + prox : 1);
                cc.globalAlpha = alpha;
                cc.shadowBlur = prox > 0.2 ? 14 + prox * 12 : 6;
                cc.shadowColor = this.color;
                cc.stroke();
                cc.shadowBlur = 0;
                cc.globalAlpha = 1;
            }
        }

        // ── Initialize ────────────────────────────────────────────
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 12 : 22;
        const coreParticles = Array.from({ length: particleCount }, () => new CoreParticle());
        let sparks = [];
        let arcs = Array.from({ length: 5 }, () => new EnergyArc());
        let sparkTimer = 0;

        // ── Hexagon outline (drawn on canvas for extra brightness) ─
        function drawHexOutline(prox) {
            const hw = 110, hh = 125;
            const pts = [
                [ccx, ccy - hh],
                [ccx + hw, ccy - hh * 0.5],
                [ccx + hw, ccy + hh * 0.5],
                [ccx, ccy + hh],
                [ccx - hw, ccy + hh * 0.5],
                [ccx - hw, ccy - hh * 0.5],
            ];
            const alpha = 0.12 + prox * 0.55;
            const lw = 1 + prox * 2.5;
            cc.beginPath();
            cc.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) cc.lineTo(pts[i][0], pts[i][1]);
            cc.closePath();
            cc.strokeStyle = `rgba(0,212,255,${alpha})`;
            cc.lineWidth = lw;
            cc.shadowBlur = 6 + prox * 30;
            cc.shadowColor = '#00D4FF';
            cc.stroke();
            cc.shadowBlur = 0;

            // Second outline purple offset
            cc.beginPath();
            cc.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) cc.lineTo(pts[i][0], pts[i][1]);
            cc.closePath();
            cc.strokeStyle = `rgba(123,95,255,${alpha * 0.5})`;
            cc.lineWidth = lw * 0.6;
            cc.shadowBlur = 4 + prox * 18;
            cc.shadowColor = '#7B5FFF';
            cc.stroke();
            cc.shadowBlur = 0;
        }

        // ── Neural connection lines ───────────────────────────────
        function drawNeuralLines(prox) {
            const count = 8;
            for (let i = 0; i < count; i++) {
                const a1 = (i / count) * Math.PI * 2;
                const a2 = ((i + 1) / count) * Math.PI * 2;
                const r1 = 90, r2 = 90;
                const x1 = ccx + Math.cos(a1) * r1;
                const y1 = ccy + Math.sin(a1) * r1;
                const x2 = ccx + Math.cos(a2) * r2;
                const y2 = ccy + Math.sin(a2) * r2;
                const alpha = 0.06 + prox * 0.5;
                cc.beginPath();
                cc.moveTo(x1, y1);
                cc.lineTo(x2, y2);
                cc.strokeStyle = `rgba(0,212,255,${alpha})`;
                cc.lineWidth = 0.5 + prox * 1.5;
                if (prox > 0.15) {
                    cc.shadowBlur = 6 + prox * 20;
                    cc.shadowColor = '#00D4FF';
                }
                cc.stroke();
                cc.shadowBlur = 0;
            }
            // Cross connections
            for (let i = 0; i < count; i += 2) {
                const a1 = (i / count) * Math.PI * 2;
                const a2 = ((i + 3) % count / count) * Math.PI * 2;
                const x1 = ccx + Math.cos(a1) * 90;
                const y1 = ccy + Math.sin(a1) * 90;
                const x2 = ccx + Math.cos(a2) * 90;
                const y2 = ccy + Math.sin(a2) * 90;
                const alpha = 0.03 + prox * 0.3;
                cc.beginPath();
                cc.moveTo(x1, y1);
                cc.lineTo(x2, y2);
                cc.strokeStyle = `rgba(123,95,255,${alpha})`;
                cc.lineWidth = 0.4 + prox * 0.8;
                if (prox > 0.1) {
                    cc.shadowBlur = prox * 14;
                    cc.shadowColor = '#7B5FFF';
                }
                cc.stroke();
                cc.shadowBlur = 0;
            }
        }

        // ── Main animation loop ───────────────────────────────────
        function coreAnimate() {
            cc.clearRect(0, 0, CW, CH);

            // Smooth mouse following
            cmouseSmooth.x += (cmouse.x - cmouseSmooth.x) * 0.08;
            cmouseSmooth.y += (cmouse.y - cmouseSmooth.y) * 0.08;

            // Proximity to center
            const d2c = Math.hypot(cmouseSmooth.x - ccx, cmouseSmooth.y - ccy);
            const prox = Math.max(0, 1 - d2c / 200);

            // Neural lines
            drawNeuralLines(prox);

            // Hex outline
            drawHexOutline(prox);

            // Energy arcs
            arcs.forEach(a => { a.update(); a.draw(prox); });
            arcs = arcs.filter(a => a.life > 0);
            if (arcs.length < 5 && Math.random() < 0.03) arcs.push(new EnergyArc());

            // Particles
            coreParticles.forEach(p => { p.update(); p.draw(prox); });

            // Sparks (launch near edges)
            sparkTimer++;
            if (sparkTimer > 6 && sparks.length < 15) {
                sparks.push(new Spark());
                sparkTimer = 0;
            }
            sparks.forEach(s => { s.update(); s.draw(); });
            sparks = sparks.filter(s => s.life > 0);

            requestAnimationFrame(coreAnimate);
        }

        // ── Mouse tracking ────────────────────────────────────────
        aiCore.addEventListener('mousemove', e => {
            const rect = aiCore.getBoundingClientRect();
            cmouse.x = e.clientX - rect.left;
            cmouse.y = e.clientY - rect.top;
        });
        aiCore.addEventListener('mouseleave', () => {
            cmouse.x = -9999; cmouse.y = -9999;
        });

        // ── Parallax layers ───────────────────────────────────────
        const layers = aiCore.querySelectorAll('.core-layer');
        aiCore.addEventListener('mousemove', e => {
            const rect = aiCore.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / rect.width - 0.5;
            const my = (e.clientY - rect.top) / rect.height - 0.5;
            layers.forEach(l => {
                const d = parseFloat(l.dataset.depth) || 0;
                l.style.transform = `translate(${mx * d * 80}px, ${my * d * 80}px)`;
            });
        });
        aiCore.addEventListener('mouseleave', () => {
            layers.forEach(l => { l.style.transform = ''; });
        });

        // ── 3D tilt on hex frame ──────────────────────────────────
        aiCore.addEventListener('mousemove', e => {
            if (!hexFrame) return;
            const rect = hexFrame.getBoundingClientRect();
            const fx = e.clientX - rect.left - rect.width / 2;
            const fy = e.clientY - rect.top - rect.height / 2;
            const rotX = (fy / (rect.height / 2)) * -14;
            const rotY = (fx / (rect.width / 2)) * 14;
            hexFrame.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        aiCore.addEventListener('mouseleave', () => {
            if (hexFrame) hexFrame.style.transform = '';
        });

        // ── Light reflection follows mouse ────────────────────────
        aiCore.addEventListener('mousemove', e => {
            if (!hexRef) return;
            const rect = hexFrame.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * 100;
            const py = ((e.clientY - rect.top) / rect.height) * 100;
            hexRef.style.background = `radial-gradient(circle 120px at ${px}% ${py}%, rgba(255,255,255,0.16) 0%, transparent 80%)`;
        });

        // ── GSAP entrance animation ───────────────────────────────
        if (typeof gsap !== 'undefined') {
            gsap.from('.hex-frame', { scale: 0.8, opacity: 0, duration: 1, delay: 1, ease: 'back.out(1.2)' });
            gsap.from('.ds-tag', {
                scale: 0,
                opacity: 0,
                stagger: 0.08,
                duration: 0.5,
                delay: 1.4,
                ease: 'back.out(1.5)'
            });
            gsap.from('.hex-glow', { scale: 0.3, opacity: 0, duration: 1.2, delay: 1, ease: 'power2.out' });
        }

        // ── Start ─────────────────────────────────────────────────
        coreResize();
        window.addEventListener('resize', coreResize);
        coreAnimate();
    }

    // ============================================================
    // ABOUT SECTION — SEAMLESS AI ENVIRONMENT & DECODING
    // ============================================================
    function initAboutDecoding() {
        const aboutSection = document.getElementById('about');
        const decodeParagraph = document.querySelector('.decode-paragraph');
        const decodeCursor = document.querySelector('.decode-cursor');

        if (!decodeParagraph || !aboutSection) return;

        const fullText = decodeParagraph.getAttribute('data-text');
        if (!fullText) return;

        // Clear initial text
        decodeParagraph.textContent = '';

        // Wrap each letter in a span
        const letters = fullText.split('').map(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'decode-letter';
            decodeParagraph.appendChild(span);
            return span;
        });

        // GSAP Decoding Animation
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#about",
                    start: "top 75%",
                    toggleActions: "play none none none",
                    onComplete: () => {
                        // Hide cursor after animation
                        if (decodeCursor) gsap.to(decodeCursor, { opacity: 0, duration: 0.5, delay: 0.5 });
                    }
                }
            });

            tl.from(".about-subtitle", { y: -20, opacity: 0, duration: 0.8, ease: "power2.out" })
                .to(letters, {
                    opacity: 1,
                    y: 0,
                    className: "decode-letter visible",
                    stagger: 0.015, // Natural professional speed
                    duration: 0.1,
                    ease: "none"
                })
                .from(".highlight-box", {
                    scale: 0.8,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, "-=0.2");
        } else {
            // Fallback: Make everything visible immediately
            letters.forEach(span => span.classList.add('visible'));
            if (decodeCursor) decodeCursor.style.display = 'none';
        }
    }

    initAboutDecoding();

    // ============================================================
    const canvas = document.getElementById('data-pipeline-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        let W, H;
        let animFrameId;

        // ── Mouse & interaction state ────────────────────────────
        const mouse = { x: -9999, y: -9999, idle: true };
        let mouseTarget = { x: W / 2 || 500, y: H / 2 || 300 };
        let smoothMouse = { x: mouseTarget.x, y: mouseTarget.y };
        let idleTimer = null;
        let clickRipples = [];  // { x, y, r, alpha }
        let lastMouse = { x: 0, y: 0 };
        let parallaxOff = { x: 0, y: 0 };

        // ── Color palette ────────────────────────────────────────
        const C = {
            nodes: ['#00D4FF', '#7B5FFF', '#00FFB3', '#A78BFA', '#38BDF8'],
            particles: ['#00FFB3', '#7B5FFF', '#38BDF8', '#00D4FF'],
            concepts: ['ML', 'AI', 'Data', 'Neural', 'Vision', 'NLP', 'LLM', 'RAG', 'CNN', 'API'],
            edge: 'rgba(80,160,255,',
            edgeHot: 'rgba(140,100,255,',
            cursorEdge: 'rgba(0,212,255,',
            grid: 'rgba(0,180,255,0.025)',
            pulse: ['rgba(0,212,255,', 'rgba(123,95,255,', 'rgba(0,255,179,'],
        };

        // ── Network data ─────────────────────────────────────────
        let nodes = [], edges = [], particles = [], labels = [];
        let energyPulses = [];   // { edge, t, color, speed }
        let cursorLinks = [];   // { node, alpha }

        // ── Node class ───────────────────────────────────────────
        class Node {
            constructor(x, y, layer, depth) {
                this.bx = x; this.by = y;
                this.x = x; this.y = y;
                this.layer = layer;
                this.depth = depth;           // 0.3–1.0 for parallax
                this.r = 2.5 + Math.random() * 3.5;
                this.color = C.nodes[Math.floor(Math.random() * C.nodes.length)];
                this.phase = Math.random() * Math.PI * 2;
                this.phaseSpd = 0.012 + Math.random() * 0.01;
                this.driftAmp = 10 + Math.random() * 14;
                this.driftPhase = Math.random() * Math.PI * 2;
                this.driftSpd = 0.003 + Math.random() * 0.003;
                // interaction
                this.glowScale = 1;
                this.brightness = 0;          // 0–1 extra brightness from cursor
                this.rippleBoost = 0;          // from click ripple
            }
            update(mx, my) {
                this.phase += this.phaseSpd;
                this.driftPhase += this.driftSpd;

                // Parallax: deeper = slower
                const px = this.bx + parallaxOff.x * this.depth;
                const py = this.by + parallaxOff.y * this.depth;

                // Drift
                this.x = px + Math.sin(this.driftPhase) * this.driftAmp;
                this.y = py + Math.cos(this.driftPhase * 0.7) * this.driftAmp;

                // Cursor proximity
                const d = Math.hypot(this.x - mx, this.y - my);
                const near = Math.max(0, 1 - d / 160);
                this.brightness = near;
                this.glowScale = 1 + near * 0.7;

                // Ripple decay
                if (this.rippleBoost > 0) this.rippleBoost -= 0.03;
            }
            draw() {
                const pulse = 1 + Math.sin(this.phase) * 0.18;
                const r = this.r * pulse * this.glowScale;
                const extra = this.brightness + (this.rippleBoost > 0 ? this.rippleBoost : 0);
                const gAlpha = 0.25 + extra * 0.55;

                // Outer glow
                const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 4);
                grd.addColorStop(0, this.color + 'cc');
                grd.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(this.x, this.y, r * 4, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.globalAlpha = gAlpha;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Core
                ctx.beginPath();
                ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10 + extra * 20;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // ── Particle class ────────────────────────────────────────
        class Particle {
            constructor(edge) {
                this.edge = edge;
                this.t = Math.random();
                this.speed = 0.0025 + Math.random() * 0.003;
                this.color = C.particles[Math.floor(Math.random() * C.particles.length)];
                this.r = 1.5 + Math.random() * 1.5;
                this.dead = false;
            }
            update(mx, my) {
                // Speed boost near cursor
                const a = this.edge.a, b = this.edge.b;
                const cx = a.x + (b.x - a.x) * this.t;
                const cy = a.y + (b.y - a.y) * this.t;
                const d = Math.hypot(cx - mx, cy - my);
                const boost = Math.max(0, 1 - d / 200) * 0.004;
                this.t += this.speed + boost;
                if (this.t >= 1) { this.dead = true; }
            }
            draw() {
                const a = this.edge.a, b = this.edge.b;
                // Trail
                for (let i = 1; i <= 3; i++) {
                    const tt = Math.max(0, this.t - i * 0.02);
                    const tx = a.x + (b.x - a.x) * tt;
                    const ty = a.y + (b.y - a.y) * tt;
                    ctx.beginPath();
                    ctx.arc(tx, ty, this.r * (1 - i / 4), 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = Math.max(0, 0.35 - i * 0.1);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                const x = a.x + (b.x - a.x) * this.t;
                const y = a.y + (b.y - a.y) * this.t;
                ctx.beginPath();
                ctx.arc(x, y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 14;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // ── FloatingLabel class ───────────────────────────────────
        class FloatLabel {
            constructor() {
                this.text = C.concepts[Math.floor(Math.random() * C.concepts.length)];
                this.x = 80 + Math.random() * (W - 160);
                this.y = 60 + Math.random() * (H - 120);
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
                this.life = 0;
                this.maxLife = 260 + Math.floor(Math.random() * 160);
                this.color = C.pulse[Math.floor(Math.random() * C.pulse.length)];
                this.dead = false;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                this.life++;
                if (this.life >= this.maxLife) this.dead = true;
            }
            draw() {
                const fade = this.life / this.maxLife;
                const alpha = fade < 0.15 ? fade / 0.15 :
                    fade > 0.85 ? (1 - fade) / 0.15 : 1;
                ctx.font = '500 10px "Outfit",sans-serif';
                ctx.fillStyle = this.color + (alpha * 0.6) + ')';
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color + '0.4)';
                ctx.fillText(this.text, this.x, this.y);
                ctx.shadowBlur = 0;
            }
        }

        // ── Build network ─────────────────────────────────────────
        function buildNetwork() {
            nodes = []; edges = []; particles = []; labels = [];
            energyPulses = []; cursorLinks = [];
            clickRipples = [];

            const mobile = W < 768;
            const layerCounts = mobile ? [2, 3, 4, 3, 2] : [3, 5, 6, 5, 4];
            const totalLayers = layerCounts.length;
            const colGap = W / (totalLayers + 1);

            // Place nodes
            let layerStart = [];
            layerCounts.forEach((count, li) => {
                layerStart.push(nodes.length);
                const rowGap = H / (count + 1);
                const x = colGap * (li + 1);
                const depth = 0.3 + (li / (totalLayers - 1)) * 0.7; // front layers deeper
                for (let ni = 0; ni < count; ni++) {
                    nodes.push(new Node(x, rowGap * (ni + 1), li, depth));
                }
            });

            // Edges: connect consecutive layers
            for (let li = 0; li < layerCounts.length - 1; li++) {
                const fs = layerStart[li], fc = layerCounts[li];
                const ts = layerStart[li + 1], tc = layerCounts[li + 1];
                for (let f = 0; f < fc; f++) {
                    for (let t = 0; t < tc; t++) {
                        if (Math.random() < 0.45) continue; // 55% connection rate
                        edges.push({ a: nodes[fs + f], b: nodes[ts + t] });
                    }
                }
            }

            // Seed particles
            const initP = mobile ? 5 : 10;
            for (let i = 0; i < initP; i++) {
                if (edges.length) particles.push(new Particle(edges[Math.floor(Math.random() * edges.length)]));
            }

            // Seed labels
            for (let i = 0; i < 3; i++) labels.push(new FloatLabel());

            // Compute smoothMouse base
            smoothMouse.x = W / 2;
            smoothMouse.y = H / 2;
        }

        // ── Draw grid ─────────────────────────────────────────────
        function drawGrid() {
            const step = 60;
            ctx.strokeStyle = C.grid;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let x = 0; x < W; x += step) {
                ctx.moveTo(x, 0); ctx.lineTo(x, H);
            }
            for (let y = 0; y < H; y += step) {
                ctx.moveTo(0, y); ctx.lineTo(W, y);
            }
            ctx.stroke();
        }

        // ── Draw cursor glow on canvas ────────────────────────────
        function drawCursorHalo(mx, my) {
            if (mx < 0 || my < 0) return;
            const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 140);
            grd.addColorStop(0, 'rgba(123,95,255,0.09)');
            grd.addColorStop(0.5, 'rgba(0,212,255,0.04)');
            grd.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(mx, my, 140, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
        }

        // ── Draw cursor-to-node temporary connections ─────────────
        function drawCursorLinks(mx, my) {
            if (mx < 0) return;
            nodes.forEach(n => {
                const d = Math.hypot(n.x - mx, n.y - my);
                if (d < 130) {
                    const alpha = (1 - d / 130) * 0.5;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
                    ctx.lineWidth = alpha * 1.8;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#00D4FF';
                    ctx.moveTo(mx, my);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            });
        }

        // ── Draw edges ────────────────────────────────────────────
        function drawEdges(mx, my) {
            edges.forEach(e => {
                const cx = (e.a.x + e.b.x) / 2;
                const cy = (e.a.y + e.b.y) / 2;
                const d = Math.hypot(cx - mx, cy - my);
                const hot = d < 150;
                const alpha = hot ? 0.25 + (1 - d / 150) * 0.4 : 0.08;
                const lw = hot ? 0.7 + (1 - d / 150) * 1.2 : 0.35;

                ctx.beginPath();
                ctx.strokeStyle = hot ? `${C.edgeHot}${alpha})` : `${C.edge}${alpha})`;
                ctx.lineWidth = lw;
                if (hot) { ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(140,100,255,0.5)'; }
                ctx.moveTo(e.a.x, e.a.y);
                ctx.lineTo(e.b.x, e.b.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            });
        }

        // ── Draw click ripples ────────────────────────────────────
        function drawRipples() {
            clickRipples = clickRipples.filter(r => r.alpha > 0);
            clickRipples.forEach(r => {
                r.r += 4;
                r.alpha -= 0.018;
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0,212,255,${Math.max(0, r.alpha)})`;
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#00D4FF';
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Second outer ring
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.r * 1.6, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(123,95,255,${Math.max(0, r.alpha * 0.5)})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });
        }

        // ── Energy pulses along edges ─────────────────────────────
        function updateEnergyPulses() {
            energyPulses = energyPulses.filter(p => p.t < 1);
            energyPulses.forEach(p => {
                p.t += p.speed;
                const e = p.edge;
                const x = e.a.x + (e.b.x - e.a.x) * p.t;
                const y = e.a.y + (e.b.y - e.a.y) * p.t;
                const alpha = Math.sin(p.t * Math.PI); // fade in/out
                ctx.beginPath();
                ctx.arc(x, y, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color + alpha * 0.9 + ')';
                ctx.shadowBlur = 18;
                ctx.shadowColor = p.color + '0.7)';
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            // Spawn occasional energy pulse
            if (edges.length && Math.random() < 0.006) {
                const e = edges[Math.floor(Math.random() * edges.length)];
                energyPulses.push({
                    edge: e,
                    t: 0,
                    speed: 0.006 + Math.random() * 0.006,
                    color: C.pulse[Math.floor(Math.random() * C.pulse.length)],
                });
            }
        }

        // ── Main loop ─────────────────────────────────────────────
        function animate() {
            ctx.clearRect(0, 0, W, H);

            const mx = smoothMouse.x, my = smoothMouse.y;

            // Parallax offset from center
            const cx = W / 2, cy = H / 2;
            parallaxOff.x = (mx - cx) / cx * 18;
            parallaxOff.y = (my - cy) / cy * 12;

            drawGrid();
            drawCursorHalo(mx, my);
            drawEdges(mx, my);
            drawCursorLinks(mx, my);

            // Update & draw nodes
            nodes.forEach(n => { n.update(mx, my); n.draw(); });

            // Particles
            particles.forEach(p => { p.update(mx, my); p.draw(); });
            particles = particles.filter(p => !p.dead);
            const maxP = W < 768 ? 6 : 12;
            if (particles.length < maxP && edges.length && Math.random() < 0.04) {
                particles.push(new Particle(edges[Math.floor(Math.random() * edges.length)]));
            }

            // Energy pulses
            updateEnergyPulses();

            // Floating labels
            labels.forEach(l => { l.update(); l.draw(); });
            labels = labels.filter(l => !l.dead);
            if (labels.length < 5 && Math.random() < 0.01) labels.push(new FloatLabel());

            // Click ripples
            drawRipples();

            // Idle breathing: gentle radial pulse from center when no mouse
            if (mouse.idle) {
                const t = Date.now() * 0.0008;
                const pr = 40 + Math.sin(t) * 20;
                const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr + 80);
                grd.addColorStop(0, 'rgba(123,95,255,0.04)');
                grd.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(cx, cy, pr + 80, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();
            }

            animFrameId = requestAnimationFrame(animate);
        }

        // ── Mouse tracking ────────────────────────────────────────
        // ── Mouse tracking ────────────────────────────────────────
        const trackMouse = e => {
            mouseTarget.x = e.clientX;
            mouseTarget.y = e.clientY;
            mouse.idle = false;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { mouse.idle = true; }, 2500);
        };

        // Smooth lerp on mouse position
        function lerpMouse() {
            smoothMouse.x += (mouseTarget.x - smoothMouse.x) * 0.1;
            smoothMouse.y += (mouseTarget.y - smoothMouse.y) * 0.1;
            requestAnimationFrame(lerpMouse);
        }
        mouseTarget.x = W / 2 || 600;
        mouseTarget.y = H / 2 || 300;
        lerpMouse();

        // Listen on the entire window for mouse tracking
        window.addEventListener('mousemove', trackMouse);

        // Remove old wrapper-specific restriction — canvas is now full page
        // (The window mousemove above handles everything)

        // Click ripple + node burst
        window.addEventListener('click', e => {
            const cx = e.clientX;
            const cy = e.clientY;
            clickRipples.push({ x: cx, y: cy, r: 5, alpha: 0.8 });
            clickRipples.push({ x: cx, y: cy, r: 0, alpha: 0.4 });
            nodes.forEach(n => {
                const d = Math.hypot(n.x - cx, n.y - cy);
                if (d < 200) n.rippleBoost = (1 - d / 200) * 1.2;
            });
            if (edges.length) {
                for (let i = 0; i < 3; i++) {
                    const e2 = edges[Math.floor(Math.random() * edges.length)];
                    energyPulses.push({ edge: e2, t: 0, speed: 0.009, color: C.pulse[i % 3] });
                }
            }
        });

        // Resize
        window.addEventListener('resize', () => {
            if (animFrameId) cancelAnimationFrame(animFrameId);
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            mouseTarget.x = W / 2;
            mouseTarget.y = H / 2;
            buildNetwork();
            animate();
        });

        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildNetwork();
        animate();
    }

    // ================================================================
    // EXPERIENCE — DATA PIPELINE TIMELINE ANIMATIONS (GSAP)
    // ================================================================
    const initPipelineTimeline = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const trackFill = document.querySelector('.pipeline-track-fill');
        const entries = document.querySelectorAll('.pipeline-entry');
        if (!trackFill || !entries.length) return;

        // 1. Draw the glowing fiber-optic line as user scrolls
        gsap.to(trackFill, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.pipeline-wrapper',
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: 0.6,
            }
        });

        // 2. Animate each entry (node + card slide-in)
        entries.forEach((entry, i) => {
            const card = entry.querySelector('.pipeline-card');
            const node = entry.querySelector('.pipeline-node');

            // Node scales in
            gsap.to(node, {
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: entry,
                    start: 'top 78%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        node.classList.add('active');
                        entry.classList.add('revealed');
                    }
                }
            });

            // Card slides in from the right
            gsap.to(card, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: entry,
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                }
            });
        });
    };

    // Run after a tiny delay so GSAP + ScrollTrigger are ready
    setTimeout(() => {
        initPipelineTimeline();
    }, 100);

    // Initialize about animation immediately
    initAboutNeuralAnimation();

});

// ================================================================
// ABOUT SECTION: NEURAL EXPLOSION ANIMATION
// ================================================================
function initAboutNeuralAnimation() {
    const canvas = document.getElementById('about-neural-canvas');
    const container = document.getElementById('about-visual-canvas-container'); // Corrected ID
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let state = 'fill'; // fill | explode | refill
    let timer = 0;

    const PARTICLE_COUNT = 150;
    const BOX_SIZE = 300;
    const NEON_CYAN = '#00f2ea';

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // Start inside the box
            this.x = (Math.random() - 0.5) * (BOX_SIZE - 20);
            this.y = (Math.random() - 0.5) * (BOX_SIZE - 20);
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.5;
        }

        update() {
            if (state === 'fill') {
                // Gentle movement within box bounds
                this.x += this.vx;
                this.y += this.vy;
                if (Math.abs(this.x) > BOX_SIZE / 2 - 10) this.vx *= -1;
                if (Math.abs(this.y) > BOX_SIZE / 2 - 10) this.vy *= -1;
            }
            else if (state === 'explode') {
                // Fly outwards drastically
                this.x += this.vx * 18;
                this.y += this.vy * 18;
                this.alpha -= 0.015;
            }
            else if (state === 'refill') {
                // Magnetic pull back to center
                this.x -= this.x * 0.12;
                this.y -= this.y * 0.12;
                this.alpha = Math.min(1, this.alpha + 0.08);
                if (Math.abs(this.x) < 5 && Math.abs(this.y) < 5) {
                    this.reset();
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(width / 2 + this.x, height / 2 + this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 234, ${this.alpha})`;
            ctx.fill();

            // Add glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = NEON_CYAN;
        }
    }

    function resize() {
        width = container.offsetWidth * 2;
        height = container.offsetHeight * 2;
        canvas.width = width;
        canvas.height = height;
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        timer++;

        // Rapid Cycle states: Fill (30 frames) -> Explode (50 frames) -> Refill (40 frames)
        if (timer < 30) state = 'fill';
        else if (timer < 80) state = 'explode';
        else if (timer < 120) state = 'refill';
        else {
            timer = 0;
            state = 'fill';
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    init();
    loop();
}

function setTheme(theme) {
    // Remove existing theme attributes first
    document.body.removeAttribute('data-theme');

    if (theme !== 'default') {
        document.body.setAttribute('data-theme', theme);
    }

    // Save to local storage
    localStorage.setItem('portfolio-theme', theme);

    // Update active state on buttons
    themeBtns.forEach(btn => {
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Trigger particles re-init to match new colors if needed
    // (Optional: reload particles to pick up new CSS variable colors if implemented dynamically)
    // For now, simpler to just reload page or re-run init if complex
    // But canvas is drawing colors from JS, so we might need to update that.
    // Let's reload page for simplicity if user accepts, OR just update JS vars.
    // Updating JS vars dynamically:
    updateCanvasColors(theme);
}

function updateCanvasColors(theme) {
    // Map themes to JS colors for canvas
    const canvas = document.getElementById('data-pipeline-canvas');
    if (!canvas) return;

    // Default Navy
    let nodeColor = '#00D1FF'; // Cyan
    let particleColor = '#64ffda';

    if (theme === 'light') {
        nodeColor = '#0077B6'; // Cobalt
        particleColor = '#34495e'; // Navy
    } else if (theme === 'monochrome') {
        nodeColor = '#FF6B6B'; // Coral
        particleColor = '#95a5a6'; // Gray
    }

    // We'd need to expose this to the canvas class instance or re-init.
    // For a quick fix, let's just reload the valid colors into global scope or re-run init.
    // Actually, let's just refresh the window for cleanest switch since canvas state is complex.
    // But that's jarring. Let's just update styles.
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// --- Active Navigation on Scroll ---
const sections = document.querySelectorAll('section, footer');
const navLinksItems = document.querySelectorAll('.nav-links a:not(.btn)');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 100; // Offset for fixed header

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current) && current !== '') {
            link.classList.add('active');
        }
    });
});
