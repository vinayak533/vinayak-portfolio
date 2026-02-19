/**
 * HOLOGRAPHIC PROJECT CARDS - 3D Tilt Logic
 * -----------------------------------------
 * Adds a subtle 3D parallax effect to the project cards
 * on mouse movement to sell the "hologram" vibe.
 */

class ProjectFlipCard {
    constructor(element) {
        this.card = element;
        this.tiltWrapper = element.querySelector('.tilt-wrapper');
        this.bounds = this.card.getBoundingClientRect();

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.init();
    }

    init() {
        this.card.addEventListener('mousemove', this.onMouseMove);
        this.card.addEventListener('mouseleave', this.onMouseLeave);

        // Mobile Tap to Flip
        this.card.addEventListener('click', () => {
            this.card.classList.toggle('flipped');
        });
    }

    onMouseMove(e) {
        this.bounds = this.card.getBoundingClientRect();
        const mouseX = e.clientX - this.bounds.left;
        const mouseY = e.clientY - this.bounds.top;

        const centerX = this.bounds.width / 2;
        const centerY = this.bounds.height / 2;

        // Calculate tilt angles (max 10 degrees for subtlety)
        const tiltX = (centerY - mouseY) / centerY * 10;
        const tiltY = (mouseX - centerX) / centerX * 10;

        // Apply tilt to the tilt-wrapper
        if (this.tiltWrapper) {
            this.tiltWrapper.style.transform = `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
        }
    }

    onMouseLeave() {
        // Reset transform on tiltWrapper
        if (this.tiltWrapper) {
            this.tiltWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
        }
    }
}

// Initialize for all cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => new ProjectFlipCard(card));
});
