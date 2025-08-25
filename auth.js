// IFFCO Authentication System
class AuthSystem {
    constructor() {
        this.users = new Map();
        this.currentUser = null;
        this.loginAttempts = new Map();
        this.maxAttempts = 3;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        this.loadUsers();
        this.bindEvents();
        this.checkSession();
    }

    // Load predefined users (simulate database)
    loadUsers() {
        const defaultUsers = [
            {
                username: 'admin',
                password: 'admin123',
                empId: 'IFFCO001',
                name: 'System Administrator',
                role: 'Admin',
                department: 'IT',
                lastLogin: null
            },
            {
                username: 'manager',
                password: 'manager123',
                empId: 'IFFCO002',
                name: 'John Doe',
                role: 'Manager',
                department: 'Production',
                lastLogin: null
            },
            {
                username: 'employee',
                password: 'emp123',
                empId: 'IFFCO003',
                name: 'Jane Smith',
                role: 'Employee',
                department: 'Sales',
                lastLogin: null
            },
            {
                username: 'demo',
                password: 'demo123',
                empId: 'IFFCO004',
                name: 'Demo User',
                role: 'Demo',
                department: 'Demo',
                lastLogin: null
            },
            {
                username: 'google.demo',
                password: 'google123',
                empId: 'GOOGLE_DEMO',
                name: 'Google Demo User',
                email: 'demo@gmail.com',
                role: 'Google User',
                department: 'External',
                lastLogin: null,
                loginMethod: 'google'
            }
        ];

        defaultUsers.forEach(user => {
            this.users.set(user.username, user);
        });

        // Load from memory (simulate localStorage)
        const savedUsers = this.getStoredData('iffco_users');
        if (savedUsers) {
            Object.entries(savedUsers).forEach(([username, user]) => {
                this.users.set(username, user);
            });
        }
    }

    // Simulate localStorage with in-memory storage
    storage = {};

    getStoredData(key) {
        return this.storage[key] ? JSON.parse(this.storage[key]) : null;
    }

    setStoredData(key, data) {
        this.storage[key] = JSON.stringify(data);
    }

    removeStoredData(key) {
        delete this.storage[key];
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const googleSignIn = document.getElementById('googleSignIn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        if (googleSignIn) {
            googleSignIn.addEventListener('click', (e) => this.handleGoogleSignIn(e));
        }

        // Real-time validation
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        if (username) {
            username.addEventListener('input', () => this.validateInput(username));
            username.addEventListener('blur', () => this.validateUsername(username.value));
        }
        
        if (password) {
            password.addEventListener('input', () => this.validateInput(password));
        }

        // Initialize Google Sign-In when API is loaded
        this.initializeGoogleSignIn();
    }

    initializeGoogleSignIn() {
        // For demo purposes, we'll simulate Google Sign-In
        // In production, you need a real Google Client ID
        console.log('Initializing Google Sign-In (Demo Mode)');
        
        // Check if we're in demo mode (no real client ID)
        const clientId = document.querySelector('meta[name="google-signin-client_id"]')?.content;
        if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
            console.log('Demo mode: Using simulated Google Sign-In');
            this.setupDemoGoogleSignIn();
        } else {
            // Try to setup real Google Sign-In
            const checkGoogleAPI = () => {
                if (typeof google !== 'undefined' && google.accounts) {
                    this.setupRealGoogleSignIn();
                } else {
                    setTimeout(checkGoogleAPI, 100);
                }
            };
            setTimeout(checkGoogleAPI, 1000);
        }
    }

    setupDemoGoogleSignIn() {
        console.log('Demo Google Sign-In ready');
        // Demo mode is ready - no additional setup needed
    }

    setupRealGoogleSignIn() {
        try {
            const clientId = document.querySelector('meta[name="google-signin-client_id"]').content;
            
            google.accounts.id.initialize({
                client_id: clientId,
                callback: this.handleGoogleCallback.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });

            console.log('Real Google Sign-In initialized successfully');
        } catch (error) {
            console.warn('Google Sign-In API error:', error);
            this.setupDemoGoogleSignIn();
        }
    }

    handleGoogleSignIn(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        const originalContent = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Google...';
        button.disabled = true;
        
        // Check if we have real Google API
        const clientId = document.querySelector('meta[name="google-signin-client_id"]')?.content;
        
        if (typeof google !== 'undefined' && google.accounts && clientId && !clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
            // Real Google Sign-In
            try {
                google.accounts.id.prompt((notification) => {
                    // Reset button
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    
                    if (notification.isNotDisplayed()) {
                        this.showMessage('Google Sign-In not available. Please try regular login.', 'warning');
                    }
                });
            } catch (error) {
                console.error('Google Sign-In error:', error);
                button.innerHTML = originalContent;
                button.disabled = false;
                this.simulateDemoGoogleLogin();
            }
        } else {
            // Demo Google Sign-In
            this.simulateDemoGoogleLogin().finally(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
            });
        }
    }

    async simulateDemoGoogleLogin() {
        // Show demo message
        this.showMessage('Demo Mode: Simulating Google Sign-In...', 'info');
        
        // Simulate API delay
        await this.delay(2000);
        
        // Create demo Google user
        const demoGoogleUser = {
            username: 'google.demo',
            password: 'google123', // For demo purposes
            empId: 'GOOGLE_DEMO',
            name: 'Google Demo User',
            email: 'demo@gmail.com',
            picture: 'https://via.placeholder.com/96/4285f4/ffffff?text=G',
            role: 'Google User',
            department: 'External',
            lastLogin: new Date().toISOString(),
            loginMethod: 'google'
        };

        // Add to users list
        this.users.set(demoGoogleUser.username, demoGoogleUser);
        
        // Show success message
        this.showMessage('Demo Google Sign-In successful!', 'success');
        
        // Wait a moment then login
        await this.delay(1000);
        this.handleSuccessfulLogin(demoGoogleUser, false);
    }

    validateInput(input) {
        const inputGroup = input.closest('.input-group');
        inputGroup.classList.remove('error', 'success');
        
        if (input.value.length > 0) {
            inputGroup.classList.add('success');
        }
    }

    validateUsername(username) {
        const input = document.getElementById('username');
        const inputGroup = input.closest('.input-group');
        
        if (username.length < 3) {
            this.showInputError(inputGroup, 'Username must be at least 3 characters');
            return false;
        }
        
        inputGroup.classList.remove('error');
        return true;
    }

    showInputError(inputGroup, message) {
        inputGroup.classList.add('error');
        // Could add error message display here
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#togglePassword i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Check if user is locked out
        if (this.isUserLockedOut(username)) {
            this.showMessage('Account temporarily locked. Please try again later.', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // Simulate API call delay
        await this.delay(2000);
        
        try {
            const loginResult = this.authenticateUser(username, password);
            
            if (loginResult.success) {
                this.handleSuccessfulLogin(loginResult.user, rememberMe);
            } else {
                this.handleFailedLogin(username, loginResult.message);
            }
        } catch (error) {
            this.showMessage('System error. Please try again.', 'error');
            console.error('Login error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    authenticateUser(username, password) {
        // Check if user exists
        const user = this.users.get(username.toLowerCase());
        
        if (!user) {
            return { success: false, message: 'Invalid username or password' };
        }
        
        // Verify password
        if (user.password !== password) {
            return { success: false, message: 'Invalid username or password' };
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.users.set(username.toLowerCase(), user);
        
        return { success: true, user: user };
    }

    handleSuccessfulLogin(user, rememberMe) {
        this.currentUser = user;
        this.clearLoginAttempts(user.username);
        
        // Store session
        this.setStoredData('iffco_current_user', user);
        if (rememberMe) {
            this.setStoredData('iffco_remember_user', user.username);
        }
        
        // Show success message
        this.showMessage('Login successful! Redirecting...', 'success');
        
        // Simulate redirect to dashboard
        setTimeout(() => {
            this.redirectToDashboard();
        }, 2000);
    }

    handleFailedLogin(username, message) {
        this.recordLoginAttempt(username);
        const attempts = this.getLoginAttempts(username);
        const remaining = this.maxAttempts - attempts;
        
        if (remaining > 0) {
            this.showMessage(`${message}. ${remaining} attempts remaining.`, 'error');
        } else {
            this.lockoutUser(username);
            this.showMessage('Account locked due to multiple failed attempts.', 'error');
        }
    }

    recordLoginAttempt(username) {
        const attempts = this.getLoginAttempts(username) + 1;
        this.loginAttempts.set(username, {
            count: attempts,
            timestamp: Date.now()
        });
    }

    getLoginAttempts(username) {
        const data = this.loginAttempts.get(username);
        if (!data) return 0;
        
        // Reset if lockout time has passed
        if (Date.now() - data.timestamp > this.lockoutTime) {
            this.loginAttempts.delete(username);
            return 0;
        }
        
        return data.count;
    }

    clearLoginAttempts(username) {
        this.loginAttempts.delete(username);
    }

    isUserLockedOut(username) {
        const attempts = this.getLoginAttempts(username);
        return attempts >= this.maxAttempts;
    }

    lockoutUser(username) {
        this.loginAttempts.set(username, {
            count: this.maxAttempts,
            timestamp: Date.now()
        });
    }

    setLoadingState(loading) {
        const loginBtn = document.getElementById('loginBtn');
        const form = document.getElementById('loginForm');
        
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
            form.style.pointerEvents = 'none';
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            form.style.pointerEvents = 'auto';
        }
    }

    showMessage(text, type) {
        const messageContainer = document.getElementById('messageContainer');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        // Hide all messages first
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
        
        const targetMessage = type === 'success' ? successMessage : errorMessage;
        const messageText = targetMessage.querySelector('span');
        
        messageText.textContent = text;
        targetMessage.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            targetMessage.classList.remove('show');
        }, 5000);
    }

    checkSession() {
        const currentUser = this.getStoredData('iffco_current_user');
        const rememberedUser = this.getStoredData('iffco_remember_user');
        
        if (currentUser) {
            this.currentUser = currentUser;
            // Could redirect to dashboard if already logged in
        } else if (rememberedUser) {
            document.getElementById('username').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }
    }

    redirectToDashboard() {
        // In a real application, this would redirect to the dashboard
        // For demo purposes, we'll show an alert
        alert(`Welcome ${this.currentUser.name}!\n\nEmployee ID: ${this.currentUser.empId}\nRole: ${this.currentUser.role}\nDepartment: ${this.currentUser.department}\n\nRedirecting to dashboard...`);
        
        // Reset form for demo
        document.getElementById('loginForm').reset();
        this.currentUser = null;
        this.removeStoredData('iffco_current_user');
    }

    logout() {
        this.currentUser = null;
        this.removeStoredData('iffco_current_user');
        this.removeStoredData('iffco_remember_user');
        // Redirect to login page
        window.location.reload();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Admin functions for user management
    addUser(userData) {
        if (this.currentUser && this.currentUser.role === 'Admin') {
            this.users.set(userData.username, userData);
            this.saveUsers();
            return true;
        }
        return false;
    }

    removeUser(username) {
        if (this.currentUser && this.currentUser.role === 'Admin') {
            return this.users.delete(username);
        }
        return false;
    }

    saveUsers() {
        const usersObject = {};
        this.users.forEach((user, username) => {
            usersObject[username] = user;
        });
        this.setStoredData('iffco_users', usersObject);
    }

    getAllUsers() {
        if (this.currentUser && this.currentUser.role === 'Admin') {
            return Array.from(this.users.values());
        }
        return [];
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const strength = {
            score: 0,
            feedback: []
        };

        if (password.length >= 8) strength.score++;
        else strength.feedback.push('Password should be at least 8 characters');

        if (/[A-Z]/.test(password)) strength.score++;
        else strength.feedback.push('Add uppercase letters');

        if (/[a-z]/.test(password)) strength.score++;
        else strength.feedback.push('Add lowercase letters');

        if (/[0-9]/.test(password)) strength.score++;
        else strength.feedback.push('Add numbers');

        if (/[^A-Za-z0-9]/.test(password)) strength.score++;
        else strength.feedback.push('Add special characters');

        return strength;
    }

    // Generate session token (for API usage)
    generateSessionToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Validate session token
    validateSessionToken(token) {
        // In a real app, this would validate against server
        return token && token.length > 10;
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    console.log('IFFCO Authentication System initialized');
    
    // Log available demo accounts
    console.log('Demo Accounts Available:');
    console.log('1. admin / admin123 (Administrator)');
    console.log('2. manager / manager123 (Manager)');
    console.log('3. employee / emp123 (Employee)');
    console.log('4. demo / demo123 (Demo User)');
    console.log('5. Click "Continue with Google" for Google demo login');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}