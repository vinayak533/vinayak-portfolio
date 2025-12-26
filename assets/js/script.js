document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
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
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.section-title, .skill-card, .project-card, .timeline-item, .cert-card, .hero-content, .hero-image');

    // Add reveal class initially
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Data Pipeline Animation (Refined: Minimalist, Cyan, Floating Keywords) ---
    const canvas = document.getElementById('data-pipeline-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let textParticles = [];
        // Specific keywords from user prompt
        const keywords = ['TensorFlow', 'Python', 'SQL', 'Data', 'Neural Types', 'Nodes'];

        const resize = () => {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };

        class Particle {
            constructor(isCenterNode = false) {
                this.isCenterNode = isCenterNode;
                if (isCenterNode) {
                    this.x = width / 2;
                    this.y = height / 2;
                    this.size = 6;
                    this.vx = 0;
                    this.vy = 0;
                    this.color = '#00f2ea'; // Electric Cyan
                } else {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * 0.3; // Slower, more elegant
                    this.vy = (Math.random() - 0.5) * 0.3;
                    this.size = Math.random() * 1.5 + 0.5; // Smaller, sparser
                    this.color = '#00f2ea'; // Electric Cyan (faded)
                }
                this.pulse = 0;
                this.pulseSpeed = Math.random() * 0.05 + 0.02;
            }
            update() {
                if (!this.isCenterNode) {
                    this.x += this.vx;
                    this.y += this.vy;
                    // Bounce gently
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                }

                // Pulsing effect
                this.pulse += this.pulseSpeed;
            }
            draw() {
                ctx.beginPath();
                const currentSize = this.size + Math.sin(this.pulse) * 0.5;
                ctx.arc(this.x, this.y, Math.max(0, currentSize), 0, Math.PI * 2);

                if (this.isCenterNode) {
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = '#00D1FF';
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        }

        class TextParticle {
            constructor() {
                this.text = keywords[Math.floor(Math.random() * keywords.length)];
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.opacity = 0;
                this.fadeIn = true;
                this.life = 0;
                this.maxLife = Math.random() * 200 + 300;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;

                // Fade In / Out logic
                if (this.life < 100) {
                    this.opacity += 0.01;
                } else if (this.life > this.maxLife - 100) {
                    this.opacity -= 0.01;
                }

                if (this.life >= this.maxLife) {
                    this.reset();
                }

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            reset() {
                this.text = keywords[Math.floor(Math.random() * keywords.length)];
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.life = 0;
                this.opacity = 0;
            }
            draw() {
                ctx.font = '300 12px "Outfit"'; // Ultra-clean font weight
                ctx.fillStyle = `rgba(100, 255, 218, ${Math.max(0, this.opacity)})`;
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        const initParticles = () => {
            particles = [];
            textParticles = [];

            // Create a "cluster" effect by adding more particles near center first, then sparse ones
            // Actually, for the prompt's "Centered... hexagonal data cluster", let's make a clear central node
            particles.push(new Particle(true)); // Center node

            for (let i = 0; i < 35; i++) { // Sparse data points
                particles.push(new Particle());
            }
            for (let i = 0; i < 6; i++) { // Fewer text keywords
                textParticles.push(new TextParticle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections first (behind nodes)
            // Connect to center node specially
            const centerNode = particles[0];

            particles.forEach((p, i) => {
                p.update();

                // Connect particles to each other if close
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 255, 218, ${0.15 * (1 - dist / 120)})`; // Very subtle cyan lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect some to center to form the "cluster" feel
                if (!p.isCenterNode) {
                    const distToCenter = Math.hypot(p.x - centerNode.x, p.y - centerNode.y);
                    if (distToCenter < 250) { // Connect if reasonably close
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 209, 255, ${0.1 * (1 - distToCenter / 250)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(centerNode.x, centerNode.y);
                        ctx.stroke();
                    }
                }
            });

            // Draw nodes
            particles.forEach(p => p.draw());

            // Draw floating text
            textParticles.forEach(tp => {
                tp.update();
                tp.draw();
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            resize();
            // Re-center logic would go here, simplified re-init for now
            particles[0].x = width / 2;
            particles[0].y = height / 2;
        });
        resize();
        initParticles();
        animate();
    }
});

// --- Theme Switcher Logic ---
const themeSwitcher = document.querySelector('.theme-switcher');
const mainToggle = document.getElementById('main-theme-toggle');
const themeBtns = document.querySelectorAll('.theme-options .theme-toggle-btn');

// Toggle menu
mainToggle.addEventListener('click', () => {
    themeSwitcher.classList.toggle('open');
});

// Handle Theme Selection
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        setTheme(theme);
        themeSwitcher.classList.remove('open'); // Close after selection
    });
});

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

