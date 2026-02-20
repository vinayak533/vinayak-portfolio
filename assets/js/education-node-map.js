/**
 * EDUCATION NODE MAP - AI Neural Network Visualization
 * ---------------------------------------------------
 * Each educational milestone is a glowing node.
 * Hovering reveals digital HUD data.
 */

class EducationNodeMap {
    constructor() {
        this.canvas = document.getElementById('education-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('edu-canvas-container');
        this.hud = document.getElementById('edu-hud');

        // Setup data
        this.milestones = [
            {
                id: "NODE_01",
                degree: "Secondary School (X)",
                institution: "St. Antony's High School",
                year: "2020",
                score: "88%",
                xPercent: 0.15,
                yPercent: 0.7,
                importance: 1.2
            },
            {
                id: "NODE_02",
                degree: "Higher Secondary (XII)",
                institution: "St. Joseph's Higher Secondary School",
                year: "2022",
                score: "82%",
                xPercent: 0.5,
                yPercent: 0.5,
                importance: 1.5
            },
            {
                id: "NODE_03",
                degree: "Bachelor of Computer Applications (BCA)",
                institution: "MG University",
                year: "2025",
                score: "ACTIVE",
                xPercent: 0.85,
                yPercent: 0.3,
                importance: 2.2
            }
        ];

        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.hoveredNode = null;
        this.time = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.container.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });

        this.animate();
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;

        this.checkHover();
    }

    handleMouseLeave() {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
        this.hoveredNode = null;
        this.hud.classList.remove('visible');
    }

    handleTouch(e) {
        if (e.touches.length > 0) {
            e.preventDefault(); // Prevent scrolling while interacting with map
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;

            this.checkHover();
        }
    }

    checkHover() {
        let found = null;
        const threshold = window.innerWidth < 768 ? 50 : 35;

        this.milestones.forEach(node => {
            const nx = node.xPercent * this.width;
            const ny = node.yPercent * this.height;
            const dist = Math.sqrt((this.mouse.x - nx) ** 2 + (this.mouse.y - ny) ** 2);
            if (dist < threshold * node.importance) {
                found = node;
            }
        });

        if (found !== this.hoveredNode) {
            this.hoveredNode = found;
            if (found) {
                this.updateHud(found);
                this.hud.classList.add('visible');
            } else {
                this.hud.classList.remove('visible');
            }
        }

        if (this.hoveredNode) {
            this.positionHud();
        }
    }

    updateHud(node) {
        document.getElementById('hud-id').textContent = `#${node.id.split('_')[1]}`;
        document.getElementById('hud-degree').textContent = node.degree;
        document.getElementById('hud-institution').textContent = node.institution;
        document.getElementById('hud-year').textContent = node.year;
        document.getElementById('hud-score').textContent = node.score;
    }

    positionHud() {
        const hudWidth = this.hud.offsetWidth;
        const hudHeight = this.hud.offsetHeight;
        let left = this.mouse.x + 20;
        let top = this.mouse.y + 20;

        // Keep inside bounds
        if (left + hudWidth > this.width) left = this.mouse.x - hudWidth - 20;
        if (top + hudHeight > this.height) top = this.mouse.y - hudHeight - 20;

        // Ensure not off-screen on extreme left
        if (left < 10) left = 10;
        if (top < 10) top = 10;

        this.hud.style.left = `${left}px`;
        this.hud.style.top = `${top}px`;
    }

    drawConnections() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 242, 234, 0.2)';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([5, 10]);
        this.ctx.lineDashOffset = -this.time * 20;

        for (let i = 0; i < this.milestones.length - 1; i++) {
            const start = this.milestones[i];
            const end = this.milestones[i + 1];
            this.ctx.moveTo(start.xPercent * this.width, start.yPercent * this.height);
            this.ctx.lineTo(end.xPercent * this.width, end.yPercent * this.height);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawNodes() {
        this.milestones.forEach(node => {
            const x = node.xPercent * this.width;
            const y = node.yPercent * this.height;
            const isHovered = this.hoveredNode === node;
            const pulse = 1 + Math.sin(this.time * 3) * 0.1;
            const radius = 10 * node.importance * (isHovered ? 1.2 : 1) * pulse;

            // Outer glow
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
            gradient.addColorStop(0, isHovered ? 'rgba(0, 242, 234, 0.4)' : 'rgba(0, 242, 234, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 242, 234, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Node core
            this.ctx.fillStyle = isHovered ? '#fff' : '#00f2ea';
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Ring
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = 'bold 12px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.year, x, y + radius + 25);
        });
    }

    animate() {
        this.time += 0.01;
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawConnections();
        this.drawNodes();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new EducationNodeMap();
});
