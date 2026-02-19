/**
 * Neural Constellation - Interactive Skills Graph
 * 
 * Features:
 * - 5 Main Category Nodes (Orbiting center)
 * - Child Skill Nodes (Orbiting categories)
 * - "Data Flow" pulses along connections
 * - Interactive Mouse Physics (Repel/Expand)
 * - Shared Background aesthetic with Hero (Particles & Gradient)
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let categoryNodes = [];
    let allNodes = []; // For collision/physics
    let bgParticles = []; // Background starfield
    let pulses = []; // Data packets traveling

    // Configuration
    const CFG = {
        bg: '#050a14',
        catRadius: 55,
        skillRadius: 24,
        orbitRadius: 180, // Distance from center for categories
        skillOrbitRadius: 90, // Distance from category
        colors: {
            ml: '#FF2E63',     // Red/Pink
            genai: '#A78BFA',  // Purple
            data: '#00D4FF',   // Cyan
            tools: '#00FFB3',  // Green highlights
            prog: '#FFD369',   // Yellow/Orange
            text: '#ffffff',
            textMuted: 'rgba(255,255,255,0.7)',
            line: 'rgba(100, 116, 139, 0.2)',
            lineActive: 'rgba(0, 212, 255, 0.4)'
        },
        bgParticleCount: 60
    };

    // Data Structure
    const SKILLS_DATA = [
        {
            id: 'prog', label: 'Programming', color: CFG.colors.prog, icon: 'code',
            skills: ['Python', 'SQL', 'PySpark', 'JavaScript']
        },
        {
            id: 'ml', label: 'Machine Learning', color: CFG.colors.ml, icon: 'brain',
            skills: ['Supervised', 'Unsupervised', 'Scikit-learn', 'TensorFlow', 'Model Eval']
        },
        {
            id: 'genai', label: 'Generative AI', color: CFG.colors.genai, icon: 'robot',
            skills: ['LLMs', 'AI Agents', 'RAG', 'Prompt Eng', 'Ollama']
        },
        {
            id: 'data', label: 'Data & Visualization', color: CFG.colors.data, icon: 'chart-bar',
            skills: ['Pandas', 'NumPy', 'Power BI', 'Matplotlib', 'EDA']
        },
        {
            id: 'tools', label: 'Deployment', color: CFG.colors.tools, icon: 'server',
            skills: ['FastAPI', 'Streamlit', 'Docker', 'Git', 'CI/CD']
        }
    ];

    // Mouse State
    const mouse = { x: -9999, y: -9999 };
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Touch Support
    canvas.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    }, { passive: true });

    canvas.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    }, { passive: true });

    // --- Classes ---

    class BgParticle {
        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 2;
            this.color = Math.random() > 0.8 ? '#00D4FF' : '#ffffff';
            this.alpha = 0.1 + Math.random() * 0.4;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around
            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;
            if (this.y < 0) this.y = H;
            if (this.y > H) this.y = 0;

            // Mouse Repel
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 100) {
                const force = (100 - dist) / 100;
                this.x += (dx / dist) * force * 2;
                this.y += (dy / dist) * force * 2;
            }
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    class Node {
        constructor(x, y, r, color, label, type, parent = null) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.baseR = r;
            this.color = color;
            this.label = label;
            this.type = type; // 'category' or 'skill'
            this.parent = parent;

            // Physics
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.angle = Math.random() * Math.PI * 2; // For orbit
            // Reduced speed for easier selection
            this.orbitSpeed = 0.0008 + Math.random() * 0.001;
            if (type === 'skill') this.orbitSpeed *= 1.5;

            // Interaction
            this.hovered = false;
            this.alpha = type === 'skill' ? 0 : 1; // Skills start hidden
            this.targetAlpha = type === 'skill' ? 0 : 1;
        }

        update(dt) {
            // Orbit Logic
            if (this.type === 'category') {
                this.angle += this.orbitSpeed;
                const tx = W / 2 + Math.cos(this.angle) * CFG.orbitRadius;
                const ty = H / 2 + Math.sin(this.angle) * (CFG.orbitRadius * 0.8); // Slight ellipse

                // Ease to target orbit position
                this.x += (tx - this.x) * 0.05;
                this.y += (ty - this.y) * 0.05;
            }
            else if (this.type === 'skill' && this.parent) {
                // Orbit parent
                this.angle += this.orbitSpeed;
                const active = this.parent.hovered || this.hovered;
                // Expand significantly when active - Increased multiplier from 1.5 to 2.2 for more space
                const radius = active ? CFG.skillOrbitRadius * 2.2 : CFG.skillOrbitRadius * 0.3; // Contracted when hidden

                const tx = this.parent.x + Math.cos(this.angle) * radius;
                const ty = this.parent.y + Math.sin(this.angle) * radius;

                this.x += (tx - this.x) * 0.1;
                this.y += (ty - this.y) * 0.1;

                // Visibility
                this.targetAlpha = active ? 1 : 0;
                this.alpha += (this.targetAlpha - this.alpha) * 0.08;
            }

            // Mouse Interaction (Hover)
            const d = Math.hypot(mouse.x - this.x, mouse.y - this.y);
            this.hovered = d < (this.r + 20); // Larger hit area

            // Hover Scaling
            const targetR = this.hovered ? this.baseR * 1.2 : this.baseR;
            this.r += (targetR - this.r) * 0.1;

            // Generate Pulse on Hover (Category)
            if (this.type === 'category' && this.hovered && Math.random() < 0.05) {
                // Send pulse to children if they are visible
                if (this.children) {
                    const target = this.children[Math.floor(Math.random() * this.children.length)];
                    if (target.targetAlpha > 0.5) pulses.push(new Pulse(this, target, this.color));
                }
            }
        }

        draw(ctx) {
            if (this.alpha < 0.01) return;

            ctx.globalAlpha = this.alpha;

            // Draw connections to parent if skill
            if (this.type === 'skill' && this.parent) {
                ctx.beginPath();
                ctx.moveTo(this.parent.x, this.parent.y);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = this.parent.hovered ? this.color : CFG.colors.line;
                ctx.lineWidth = this.parent.hovered ? 1.5 : 0.5;
                ctx.stroke();
            }

            // Glow
            ctx.shadowBlur = this.hovered ? 30 : 10;
            ctx.shadowColor = this.color;

            // Body
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a'; // Dark core
            ctx.fill();

            // Border/Fill
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset

            // Inner fill
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha * 0.3;
            ctx.fill();
            ctx.globalAlpha = this.alpha;

            // Label
            ctx.fillStyle = '#fff';
            ctx.font = this.type === 'category' ? '600 14px "Outfit"' : '400 12px "Outfit"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.label, this.x, this.y);

            ctx.globalAlpha = 1;
        }
    }

    class Pulse {
        constructor(startNode, endNode, color) {
            this.start = startNode;
            this.end = endNode;
            this.color = color;
            this.t = 0;
            this.speed = 0.05;
            this.dead = false;
        }
        update() {
            this.t += this.speed;
            if (this.t >= 1) this.dead = true;
        }
        draw(ctx) {
            if (this.dead) return;
            const x = this.start.x + (this.end.x - this.start.x) * this.t;
            const y = this.start.y + (this.end.y - this.start.y) * this.t;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // --- Init ---

    let tooltipEl = null;

    function init() {
        W = canvas.width = canvas.parentElement.offsetWidth;
        H = canvas.height = canvas.parentElement.offsetHeight;

        // Tooltip Setup
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'skill-tooltip';
            canvas.parentElement.appendChild(tooltipEl);
        }

        categoryNodes = [];
        allNodes = [];
        bgParticles = [];

        // Spawn Background Particles
        for (let i = 0; i < CFG.bgParticleCount; i++) {
            bgParticles.push(new BgParticle());
        }

        // Create Categories
        const minDimension = Math.min(W, H);
        // Responsive Orbit Radius
        if (W < 768) {
            CFG.orbitRadius = Math.max(140, minDimension * 0.4);
            CFG.skillOrbitRadius = 60; // Smaller skill orbit
            CFG.catRadius = 40;
            CFG.bgParticleCount = 30; // Reduce particles
        } else {
            CFG.orbitRadius = Math.max(250, minDimension * 0.42);
            CFG.skillOrbitRadius = 90;
            CFG.catRadius = 55;
            CFG.bgParticleCount = 60;
        }

        SKILLS_DATA.forEach((cat, i) => {
            const angle = (i / SKILLS_DATA.length) * Math.PI * 2;
            const cx = W / 2 + Math.cos(angle) * CFG.orbitRadius;
            const cy = H / 2 + Math.sin(angle) * CFG.orbitRadius;

            const catNode = new Node(cx, cy, CFG.catRadius, cat.color, cat.label, 'category');
            categoryNodes.push(catNode);
            allNodes.push(catNode);

            // Create Skills for this Category
            cat.skills.forEach((skillName, j) => {
                const sAngle = angle + (Math.random() - 0.5); // Start near parent
                const sx = cx + Math.cos(sAngle) * 50;
                const sy = cy + Math.sin(sAngle) * 50;

                const skillNode = new Node(sx, sy, CFG.skillRadius, cat.color, skillName, 'skill', catNode);
                // Spread initial angles for orbit
                skillNode.angle = (j / cat.skills.length) * Math.PI * 2;

                catNode.children = catNode.children || [];
                catNode.children.push(skillNode);
                allNodes.push(skillNode);
            });
        });
    }

    // --- Animation Loop ---

    function animate() {
        ctx.clearRect(0, 0, W, H);

        // Draw Background
        bgParticles.forEach(p => { p.update(); p.draw(ctx); });

        // Draw Connecting Lines between Categories (The mesh)
        ctx.beginPath();
        categoryNodes.forEach((node, i) => {
            const next = categoryNodes[(i + 1) % categoryNodes.length];
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(next.x, next.y);
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        let hoveredNode = null;
        let anyHovered = false;

        // Check if any category is hovered first
        allNodes.filter(n => n.type === 'category').forEach(n => {
            if (n.hovered) anyHovered = true;
        });

        // Update & Draw Nodes
        // Draw Skills first (behind categories)
        allNodes.filter(n => n.type === 'skill').forEach(n => {
            // Dim if another category is focused
            if (anyHovered && n.parent && !n.parent.hovered) {
                n.targetAlpha = 0; // Hide non-selected skills
            } else if (!anyHovered) {
                // Default behavior handled in update
            }

            n.update();
            n.draw(ctx);
            if (n.hovered && n.alpha > 0.5) hoveredNode = n;
        });

        // Draw Categories
        allNodes.filter(n => n.type === 'category').forEach(n => {
            // Focus Mode: Dim others if one is hovered
            if (anyHovered && !n.hovered) {
                ctx.globalAlpha = 0.2;
            } else {
                ctx.globalAlpha = 1;
            }
            n.update();
            n.draw(ctx);
            ctx.globalAlpha = 1; // Reset

            if (n.hovered) hoveredNode = n;
        });

        // Pulses
        if (Math.random() < 0.05) {
            // Spawn expanding pulse from random category to its active skills
            const activeCats = categoryNodes.filter(c => c.hovered);
            if (activeCats.length > 0) {
                const cat = activeCats[Math.floor(Math.random() * activeCats.length)];
                if (cat.children) {
                    const target = cat.children[Math.floor(Math.random() * cat.children.length)];
                    if (target.targetAlpha > 0.5) { // Only if visible
                        pulses.push(new Pulse(cat, target, cat.color));
                    }
                }
            }
        }

        pulses.forEach(p => { p.update(); p.draw(ctx); });
        pulses = pulses.filter(p => !p.dead);

        // Update Tooltip
        if (hoveredNode && tooltipEl) {
            tooltipEl.style.opacity = '1';
            tooltipEl.textContent = hoveredNode.label;
            tooltipEl.style.left = hoveredNode.x + 'px';
            tooltipEl.style.top = hoveredNode.y + 'px';
            tooltipEl.style.borderColor = hoveredNode.color;
        } else if (tooltipEl) {
            tooltipEl.style.opacity = '0';
        }

        requestAnimationFrame(animate);
    }

    // Start
    init();
    window.addEventListener('resize', init);
    animate();
});
