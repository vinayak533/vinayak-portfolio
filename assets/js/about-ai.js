/**
 * AI Decryption Animation & 3D Tilt for About Section
 */

document.addEventListener('DOMContentLoaded', () => {
    initAboutAI();
});

function initAboutAI() {
    initDecryptionAnimation();
    initTiltEffect();
}

/**
 * 1. AI Decryption Text Animation
 */
function initDecryptionAnimation() {
    const textContainer = document.getElementById('about-text');
    if (!textContainer) return;

    // Store original HTML to restore if needed, or just work with it.
    // robust splitting: wrap every character in a span, preserving existing spans like .highlight-neon
    splitTextNodes(textContainer);

    const chars = textContainer.querySelectorAll('.decrypt-char');

    // Initial State: Hidden
    chars.forEach(char => {
        char.style.opacity = '0';
        char.dataset.original = char.textContent;
        char.textContent = randomChar();
    });

    // ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: '#about',
            start: 'top 70%',
            onEnter: () => playDecryption(chars),
            once: true
        });
    } else {
        // Fallback
        chars.forEach(c => {
            c.textContent = c.dataset.original;
            c.style.opacity = '1';
        });
    }
}

function splitTextNodes(element) {
    if (element.childNodes.length > 0) {
        Array.from(element.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                if (text.trim() === '') return; // Skip empty whitespace

                const fragment = document.createDocumentFragment();
                text.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.className = 'decrypt-char';
                    span.textContent = char;
                    fragment.appendChild(span);
                });
                element.replaceChild(fragment, child);
            } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('typing-cursor')) {
                splitTextNodes(child);
            }
        });
    }
}

function randomChar() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    return chars[Math.floor(Math.random() * chars.length)];
}

function playDecryption(chars) {
    // Reveal and de-scramble one by one
    let index = 0;

    function revealNext() {
        if (index >= chars.length) {
            // Animation Complete - Hide Cursor?
            const cursor = document.querySelector('.typing-cursor');
            if (cursor) cursor.style.animation = 'none'; // Stop blinking or fade out
            if (cursor) cursor.style.opacity = '0';
            return;
        }

        // Process a batch of characters for speed
        const batchSize = 1;

        for (let i = 0; i < batchSize; i++) {
            if (index + i >= chars.length) break;

            const charSpan = chars[index + i];
            const originalChar = charSpan.dataset.original;

            // Make visible
            charSpan.style.opacity = '1';

            // Scramble Effect for this char
            let scrambleCount = 0;
            const maxScrambles = 5;

            const scrambleInterval = setInterval(() => {
                charSpan.textContent = randomChar();
                scrambleCount++;
                if (scrambleCount >= maxScrambles) {
                    clearInterval(scrambleInterval);
                    charSpan.textContent = originalChar;
                    // Restore color if parent was neon (CSS handles this inherited color, but textContent override is safe)
                }
            }, 30);
        }

        index += batchSize;

        // Dynamic delay based on punctuation
        let delay = 20;
        const char = chars[index]?.dataset.original;
        if (char === '.' || char === ',') delay = 100;

        setTimeout(revealNext, delay);
    }

    revealNext();
}


/**
 * 2. 3D Tilt Effect
 */
function initTiltEffect() {
    const card = document.querySelector('.about-container');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    });
}
