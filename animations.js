// IFFCO UI Animations and Effects
class UIAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupFormAnimations();
        this.setupBackgroundAnimations();
        this.setupParticleEffects();
        this.setupLoadingAnimations();
    }

    setupScrollAnimations() {
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Parallax effect for background shapes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    setupFormAnimations() {
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            // Focus animations
            input.addEventListener('focus', (e) => {
                this.animateInputFocus(e.target, true);
            });
            
            input.addEventListener('blur', (e) => {
                this.animateInputFocus(e.target, false);
            });
            
            // Typing animation
            input.addEventListener('input', (e) => {
                this.animateTyping(e.target);
            });
        });

        // Form submission animation
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                this.animateFormSubmission();
            });
        }
    }

    animateInputFocus(input, focused) {
        const inputGroup = input.closest('.input-group');
        const icon = inputGroup.querySelector('.input-icon');
        
        if (focused) {
            inputGroup.style.transform = 'scale(1.02)';
            inputGroup.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            if (icon) {
                icon.style.color = '#2c5530';
                icon.style.transform = 'translateY(-50%) scale(1.1)';
            }
        } else {
            inputGroup.style.transform = 'scale(1)';
            if (icon && !input.value) {
                icon.style.color = '#666';
                icon.style.transform = 'translateY(-50%) scale(1)';
            }
        }
    }

    animateTyping(input) {
        const inputGroup = input.closest('.input-group');
        
        // Add ripple effect
        this.createRipple(inputGroup);
        
        // Character count animation
        if (input.value.length > 0) {
            input.style.fontWeight = '500';
        } else {
            input.style.fontWeight = 'normal';
        }
    }

    createRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'input-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle, rgba(44, 85, 48, 0.1) 0%, transparent 70%);
            border-radius: inherit;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    animateFormSubmission() {
        const loginPanel = document.querySelector('.login-panel');
        
        // Shake animation for invalid inputs
        const shake = () => {
            loginPanel.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginPanel.style.animation = '';
            }, 500);
        };
        
        // Add shake keyframes if not already present
        if (!document.querySelector('#shake-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shake-keyframes';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupBackgroundAnimations() {
        // Floating shapes animation
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            // Random movement
            this.animateFloatingShape(shape, index);
            
            // Mouse interaction
            shape.addEventListener('mouseenter', () => {
                shape.style.transform += ' scale(1.2)';
                shape.style.opacity = '0.8';
            });
            
            shape.addEventListener('mouseleave', () => {
                shape.style.transform = shape.style.transform.replace(' scale(1.2)', '');
                shape.style.opacity = '0.7';
            });
        });
    }

    animateFloatingShape(shape, index) {
        const duration = 6000 + (index * 1000); // Different duration for each shape
        const amplitude = 20 + (index * 10); // Different movement amplitude
        
        const animate = () => {
            const startTime = Date.now();
            const initialTransform = shape.style.transform;
            
            const updatePosition = () => {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed % duration) / duration;
                
                const x = Math.sin(progress * Math.PI * 2) * amplitude;
                const y = Math.cos(progress * Math.PI * 2) * (amplitude / 2);
                const rotation = progress * 360;
                
                shape.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                
                requestAnimationFrame(updatePosition);
            };
            
            updatePosition();
        };
        
        // Start with a delay to stagger animations
        setTimeout(animate, index * 500);
    }

    setupParticleEffects() {
        // Create particle system for background
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-system';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Generate particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer, i);
        }
    }

    createParticle(container, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${startX}px;
            top: ${startY}px;
            animation: particleFloat ${10 + Math.random() * 10}s infinite linear;
            animation-delay: ${index * 0.5}s;
        `;
        
        container.appendChild(particle);
        
        // Add particle animation keyframes
        if (!document.querySelector('#particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent = `
                @keyframes particleFloat {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupLoadingAnimations() {
        // Custom loading spinner
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            this.enhanceLoadingSpinner(loadingSpinner);
        }
        
        // Page load animation
        window.addEventListener('load', () => {
            this.animatePageLoad();
        });
    }

    enhanceLoadingSpinner(spinner) {
        // Add multiple rotating elements for a more complex loading animation
        const circles = [];
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.style.cssText = `
                position: absolute;
                border: 2px solid transparent;
                border-top-color: currentColor;
                border-radius: 50%;
                animation: spin ${1 + i * 0.2}s linear infinite;
            `;
            
            const size = 20 - (i * 4);
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.top = `${(20 - size) / 2}px`;
            circle.style.left = `${(20 - size) / 2}px`;
            
            circles.push(circle);
        }
        
        // Clear existing content and add circles
        spinner.innerHTML = '';
        spinner.style.position = 'relative';
        circles.forEach(circle => spinner.appendChild(circle));
        
        // Add spin keyframes
        if (!document.querySelector('#spin-keyframes')) {
            const style = document.createElement('style');
            style.id = 'spin-keyframes';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    animatePageLoad() {
        const elements = [
            '.navbar',
            '.info-panel',
            '.login-container',
            '.floating-shapes'
        ];
        
        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    // Utility methods for custom animations
    animateElement(element, properties, duration = 300, easing = 'ease') {
        return new Promise(resolve => {
            element.style.transition = `all ${duration}ms ${easing}`;
            
            Object.keys(properties).forEach(prop => {
                element.style[prop] = properties[prop];
            });
            
            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }

    pulseElement(element, intensity = 1.05, duration = 200) {
        const originalTransform = element.style.transform || '';
        
        this.animateElement(element, {
            transform: `${originalTransform} scale(${intensity})`
        }, duration)
        .then(() => {
            return this.animateElement(element, {
                transform: originalTransform
            }, duration);
        });
    }

    // Success animation
    showSuccessAnimation(element) {
        element.style.position = 'relative';
        
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 2rem;
            color: #4caf50;
            font-weight: bold;
            animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        element.appendChild(checkmark);
        
        // Add success animation keyframes
        if (!document.querySelector('#success-keyframes')) {
            const style = document.createElement('style');
            style.id = 'success-keyframes';
            style.textContent = `
                @keyframes successPop {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(-180deg);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (checkmark.parentNode) {
                checkmark.parentNode.removeChild(checkmark);
            }
        }, 2000);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiAnimations = new UIAnimations();
    console.log('UI Animations initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIAnimations;
}