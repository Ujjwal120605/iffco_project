// IFFCO Main Application Logic
class IFFCOApp {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        this.currentTheme = 'default';
        this.features = {
            darkMode: true,
            remembeUser: true,
            biometricAuth: false,
            twoFactorAuth: false
        };
        this.init();
    }

    init() {
        this.waitForDependencies()
            .then(() => {
                this.setupEventListeners();
                this.initializeComponents();
                this.setupKeyboardShortcuts();
                this.checkSystemRequirements();
                this.initialized = true;
                console.log(`IFFCO Application v${this.version} initialized successfully`);
            })
            .catch(error => {
                console.error('Failed to initialize IFFCO App:', error);
            });
    }

    async waitForDependencies() {
        return new Promise(resolve => {
            const checkDependencies = () => {
                if (window.authSystem && window.uiAnimations) {
                    resolve();
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Document events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', this.handleSocialLogin.bind(this));
        });
        
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
        
        // Form elements
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keyup', this.handleInputChange.bind(this));
        });
        
        // Theme toggle (if implemented)
        this.setupThemeToggle();
        
        // Help and support links
        const helpLinks = document.querySelectorAll('.forgot-password');
        const contactLinks = document.querySelectorAll('.help-link');
        
        helpLinks.forEach(link => {
            link.addEventListener('click', this.handleForgotPassword.bind(this));
        });
        
        // Contact IT Support links will open in new tab automatically due to target="_blank"
    }

    initializeComponents() {
        this.initializeTooltips();
        this.initializeProgressIndicators();
        this.setupFormValidation();
        this.initializeAccessibility();
        this.setupPerformanceMonitoring();
    }

    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(event) {
        const element = event.target;
        const tooltipText = element.getAttribute('data-tooltip');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        
        // Animate in
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        element._tooltip = tooltip;
    }

    hideTooltip(event) {
        const element = event.target;
        if (element._tooltip) {
            element._tooltip.style.opacity = '0';
            setTimeout(() => {
                if (element._tooltip && element._tooltip.parentNode) {
                    element._tooltip.parentNode.removeChild(element._tooltip);
                }
                delete element._tooltip;
            }, 300);
        }
    }

    initializeProgressIndicators() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress') || '0';
            this.animateProgressBar(bar, parseInt(progress));
        });
    }

    animateProgressBar(bar, targetProgress) {
        let currentProgress = 0;
        const increment = targetProgress / 50; // 50 frames for smooth animation
        
        const animate = () => {
            if (currentProgress < targetProgress) {
                currentProgress += increment;
                bar.style.width = Math.min(currentProgress, targetProgress) + '%';
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    setupFormValidation() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        // Real-time validation
        const username = document.getElementById('username');
        const password = document.getElementById('password');

        if (username) {
            username.addEventListener('blur', () => {
                this.validateField(username, this.validateUsername.bind(this));
            });
        }

        if (password) {
            password.addEventListener('input', () => {
                this.updatePasswordStrength(password.value);
            });
        }
    }

    validateField(field, validator) {
        const isValid = validator(field.value);
        const inputGroup = field.closest('.input-group');
        
        inputGroup.classList.remove('valid', 'invalid');
        inputGroup.classList.add(isValid ? 'valid' : 'invalid');
        
        return isValid;
    }

    validateUsername(username) {
        // Username validation rules
        if (username.length < 3) return false;
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;
        return true;
    }

    updatePasswordStrength(password) {
        const strength = window.authSystem.checkPasswordStrength(password);
        const strengthIndicator = document.getElementById('passwordStrength');
        
        if (!strengthIndicator) {
            this.createPasswordStrengthIndicator();
        }
        
        // Update visual indicator
        this.displayPasswordStrength(strength);
    }

    createPasswordStrengthIndicator() {
        const passwordGroup = document.getElementById('password').closest('.form-group');
        const indicator = document.createElement('div');
        indicator.id = 'passwordStrength';
        indicator.className = 'password-strength';
        indicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
            <div class="strength-text">Password Strength</div>
        `;
        
        indicator.style.cssText = `
            margin-top: 8px;
            font-size: 12px;
        `;
        
        passwordGroup.appendChild(indicator);
    }

    displayPasswordStrength(strength) {
        const indicator = document.getElementById('passwordStrength');
        if (!indicator) return;
        
        const fill = indicator.querySelector('.strength-fill');
        const text = indicator.querySelector('.strength-text');
        
        const percentage = (strength.score / 5) * 100;
        const colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'];
        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        
        fill.style.width = percentage + '%';
        fill.style.backgroundColor = colors[Math.min(strength.score, 4)];
        text.textContent = labels[Math.min(strength.score, 4)];
        
        // Add transition effect
        fill.style.transition = 'all 0.3s ease';
    }

    initializeAccessibility() {
        // Add ARIA labels and roles where needed
        this.enhanceAccessibility();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add screen reader announcements
        this.setupScreenReaderSupport();
    }

    enhanceAccessibility() {
        // Add role attributes
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.setAttribute('role', 'form');
            loginForm.setAttribute('aria-label', 'IFFCO Employee Login Form');
        }
        
        // Add aria-describedby for form fields
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        if (username) {
            username.setAttribute('aria-describedby', 'username-help');
            username.setAttribute('autocomplete', 'username');
        }
        
        if (password) {
            password.setAttribute('aria-describedby', 'password-help');
            password.setAttribute('autocomplete', 'current-password');
        }
        
        // Add focus indicators
        const focusableElements = document.querySelectorAll('input, button, a, [tabindex]');
        focusableElements.forEach(element => {
            element.addEventListener('focus', this.handleFocusIn.bind(this));
            element.addEventListener('blur', this.handleFocusOut.bind(this));
        });
    }

    setupKeyboardNavigation() {
        // Tab navigation enhancement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupScreenReaderSupport() {
        // Create announcement container for screen readers
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcements';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcements');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if (performance.navigation) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Log performance metrics
                this.logPerformanceMetrics();
            }
        });
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                this.checkMemoryUsage();
            }, 30000); // Check every 30 seconds
        }
    }

    logPerformanceMetrics() {
        const metrics = {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
            resources: performance.getEntriesByType('resource').length
        };
        
        console.log('Performance Metrics:', metrics);
    }

    checkMemoryUsage() {
        if (performance.memory) {
            const memoryInfo = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
            
            console.log(`Memory Usage: ${memoryInfo.used}MB / ${memoryInfo.total}MB (Limit: ${memoryInfo.limit}MB)`);
            
            // Warn if memory usage is high
            if (memoryInfo.used > memoryInfo.limit * 0.8) {
                console.warn('High memory usage detected');
            }
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const form = document.getElementById('loginForm');
                if (form && document.activeElement && form.contains(document.activeElement)) {
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit'));
                }
            }
            
            // Escape to clear form
            if (e.key === 'Escape') {
                this.clearForm();
            }
            
            // Alt+H for help
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.showHelp();
            }
        });
    }

    setupThemeToggle() {
        // Create theme toggle button (if not exists)
        let themeToggle = document.getElementById('themeToggle');
        
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.id = 'themeToggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                color: #333;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            `;
            
            document.body.appendChild(themeToggle);
        }
        
        themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'default') {
            this.currentTheme = 'dark';
            body.classList.add('dark-theme');
            icon.className = 'fas fa-sun';
            this.announceToScreenReader('Dark mode enabled');
        } else {
            this.currentTheme = 'default';
            body.classList.remove('dark-theme');
            icon.className = 'fas fa-moon';
            this.announceToScreenReader('Light mode enabled');
        }
        
        // Save theme preference
        this.saveThemePreference(this.currentTheme);
    }

    saveThemePreference(theme) {
        if (window.authSystem) {
            window.authSystem.setStoredData('iffco_theme', theme);
        }
    }

    loadThemePreference() {
        if (window.authSystem) {
            const savedTheme = window.authSystem.getStoredData('iffco_theme');
            if (savedTheme && savedTheme !== this.currentTheme) {
                this.toggleTheme();
            }
        }
    }

    // Event handlers
    handleResize() {
        // Adjust UI elements on window resize
        const loginWrapper = document.querySelector('.login-wrapper');
        if (loginWrapper && window.innerWidth < 768) {
            loginWrapper.classList.add('mobile-layout');
        } else {
            loginWrapper?.classList.remove('mobile-layout');
        }
    }

    handleBeforeUnload(e) {
        const form = document.getElementById('loginForm');
        const hasUnsavedData = form && (
            document.getElementById('username').value ||
            document.getElementById('password').value
        );
        
        if (hasUnsavedData) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    }

    handleKeyDown(e) {
        // Handle global keyboard shortcuts
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('username')?.focus();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is now hidden
            console.log('Page hidden - pausing non-essential operations');
        } else {
            // Page is now visible
            console.log('Page visible - resuming operations');
            this.checkSession();
        }
    }

    handleSocialLogin(e) {
        e.preventDefault();
        const button = e.currentTarget;
        
        if (button.id === 'googleSignIn') {
            // Google login is handled by the auth system
            console.log('Google Sign-In triggered');
        } else {
            // Fallback for any other social login
            this.showMessage('Social login is not configured.', 'info');
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Simulate navigation
        this.showMessage(`Navigation to ${link.textContent} is not implemented in this demo.`, 'info');
    }

    handleInputChange(e) {
        const input = e.target;
        
        // Auto-save form data (except password)
        if (input.id !== 'password') {
            this.autoSaveFormData();
        }
        
        // Real-time validation feedback
        if (input.value.length > 0) {
            input.classList.add('has-content');
        } else {
            input.classList.remove('has-content');
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        this.showForgotPasswordDialog();
    }

    handleFocusIn(e) {
        e.target.classList.add('focused');
    }

    handleFocusOut(e) {
        e.target.classList.remove('focused');
    }

    // Utility methods
    showMessage(message, type = 'info') {
        if (window.authSystem) {
            window.authSystem.showMessage(message, type);
        }
    }

    clearForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
            this.announceToScreenReader('Form cleared');
        }
    }

    autoSaveFormData() {
        const username = document.getElementById('username')?.value;
        if (username && window.authSystem) {
            window.authSystem.setStoredData('iffco_draft_username', username);
        }
    }

    loadAutoSavedData() {
        if (window.authSystem) {
            const savedUsername = window.authSystem.getStoredData('iffco_draft_username');
            if (savedUsername) {
                document.getElementById('username').value = savedUsername;
            }
        }
    }

    showHelp() {
        const helpContent = `
            IFFCO Employee Portal - Help
            
            Keyboard Shortcuts:
            • Ctrl+Enter: Submit form
            • Escape: Clear form
            • Alt+H: Show this help
            • Ctrl+K: Focus username field
            
            Demo Accounts:
            • admin / admin123
            • manager / manager123  
            • employee / emp123
            • demo / demo123
            
            For technical support, contact IT department.
        `;
        
        alert(helpContent);
    }

    showForgotPasswordDialog() {
        const email = prompt('Enter your email address to reset password:');
        if (email) {
            this.showMessage(`Password reset instructions would be sent to ${email}`, 'info');
        }
    }

    showHelpDialog() {
        this.showHelp();
    }

    checkSession() {
        if (window.authSystem) {
            window.authSystem.checkSession();
        }
    }

    checkSystemRequirements() {
        const requirements = {
            localStorage: typeof(Storage) !== 'undefined',
            javascript: true,
            cookies: navigator.cookieEnabled,
            webgl: !!window.WebGLRenderingContext
        };
        
        console.log('System Requirements Check:', requirements);
        
        if (!requirements.localStorage) {
            this.showMessage('Warning: Local storage not supported. Some features may not work.', 'warning');
        }
    }

    // Public API methods
    getVersion() {
        return this.version;
    }

    getFeatures() {
        return { ...this.features };
    }

    isInitialized() {
        return this.initialized;
    }

    destroy() {
        // Cleanup event listeners and resources
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.initialized = false;
        console.log('IFFCO Application destroyed');
    }
}

// Initialize main application
document.addEventListener('DOMContentLoaded', () => {
    window.iffcoApp = new IFFCOApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IFFCOApp;
}