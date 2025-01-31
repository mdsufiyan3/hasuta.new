import { auth, db } from './firebase-config.js';
import { signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Remove old configurations and keep only Brevo SMTP
const EMAIL_CONFIG = {
    Host: "smtp-relay.brevo.com",
    Username: "mdsufiyanmallick3@gmail.com",
    Password: "AaDUMEKfznIjRmWO",
    Port: 587,
    SSL: true
};

// Update email configuration for Brevo API
const BREVO_CONFIG = {
    apiKey: "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",
    senderEmail: "mdsufiyanmallick3@gmail.com",
    senderName: "HASUTA"
};

// Update the showMessage function to allow for longer durations
function showMessage(message, duration = 5000) {  // increased default duration
    const overlay = document.getElementById('messageOverlay');
    const messageText = document.getElementById('messageText');
    messageText.textContent = message;
    overlay.style.display = 'flex';
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, duration);
}

// Enhance the debug logging function
function logDebug(message, error = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Debug] ${message}`);
    if (error) {
        console.error('Detailed error:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
    }
}

// Add rate limiting tracking
const rateLimitTracker = {
    attempts: 0,
    lastAttempt: null,
    resetTimeout: null,
    maxAttempts: 5,
    resetTime: 15 * 60 * 1000, // 15 minutes
    
    check() {
        const now = Date.now();
        if (this.lastAttempt && (now - this.lastAttempt) > this.resetTime) {
            this.reset();
        }
        return this.attempts < this.maxAttempts;
    },
    
    increment() {
        this.attempts++;
        this.lastAttempt = Date.now();
        if (!this.resetTimeout) {
            this.resetTimeout = setTimeout(() => this.reset(), this.resetTime);
        }
    },
    
    reset() {
        this.attempts = 0;
        this.lastAttempt = null;
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout);
            this.resetTimeout = null;
        }
    }
};

let verificationCode = '';

document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const verificationSection = document.getElementById('verificationSection');
    const verifyBtn = document.getElementById('verifyBtn');
    const inputs = document.querySelectorAll('.code-input');

    // Add input handling for verification code boxes
    inputs.forEach((input, index) => {
        // Handle numeric input
        input.addEventListener('input', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Move to next input if value is entered
            if (this.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                // Move to previous input on backspace if current input is empty
                inputs[index - 1].focus();
            }
        });

        // Handle paste event
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            
            // Distribute pasted numbers across inputs
            inputs.forEach((input, i) => {
                if (pastedData[i]) {
                    input.value = pastedData[i];
                    if (i < inputs.length - 1) {
                        inputs[i + 1].focus();
                    }
                }
            });
        });
    });

    // Add a function to validate email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Email form submission
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value.trim();
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', 3000);
            return;
        }

        try {
            // Show loading state
            sendCodeBtn.classList.add('loading');
            sendCodeBtn.disabled = true;
            logDebug('Attempting to send verification code to:', email);
            
            // First check if email exists in Firebase
            try {
                const userDoc = await getDoc(doc(db, 'users', email));
                if (!userDoc.exists()) {
                    logDebug('New user detected, will create account after verification');
                }
            } catch (error) {
                logDebug('Error checking user existence:', error);
            }
            
            // Generate verification code
            verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Send email using Brevo API
            console.log('Attempting to send email...');
            
            const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': BREVO_CONFIG.apiKey
                },
                body: JSON.stringify({
                    sender: { email: BREVO_CONFIG.senderEmail, name: BREVO_CONFIG.senderName },
                    to: [{ email: email }],
                    subject: 'Login Verification Code - HASUTA',
                    htmlContent: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Your Verification Code</h2>
                            <div style="font-size: 32px; font-weight: bold; color: #6B7FD7; padding: 20px 0;">
                                ${verificationCode}
                            </div>
                            <p style="color: #666;">Please enter this code to complete your login.</p>
                            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                        </div>
                    `
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            console.log('Email sent successfully');

            localStorage.setItem('userEmail', email);
            localStorage.setItem('verificationCode', verificationCode);
            
            emailForm.style.display = 'none';
            verificationSection.style.display = 'block';
            document.getElementById('emailDisplay').textContent = `Code sent to ${email}`;
        } catch (error) {
            logDebug('Failed to send verification code:', error);
            showMessage('Failed to send verification code. Please try again.');
        } finally {
            // Remove loading state
            sendCodeBtn.classList.remove('loading');
            sendCodeBtn.disabled = false;
        }
    });

    // Updated verification handling
    verifyBtn.addEventListener('click', async function() {
        const enteredCode = Array.from(inputs).map(input => input.value).join('');
        const storedCode = localStorage.getItem('verificationCode');
        const email = localStorage.getItem('userEmail');

        try {
            if (!navigator.onLine) {
                showMessage('Please check your internet connection', 3000);
                return;
            }

            verifyBtn.classList.add('loading');
            verifyBtn.disabled = true;
            logDebug('Starting verification process...');

            if (enteredCode === storedCode) {
                try {
                    // Generate a more secure password
                    const password = btoa(email).slice(0, 16); // Use base64 of email as password
                    localStorage.setItem('userPassword', password);
                    
                    logDebug('Attempting authentication...');
                    let userCredential;

                    try {
                        // First try to sign in with existing account
                        userCredential = await signInWithEmailAndPassword(auth, email, password);
                        logDebug('Existing user signed in successfully');
                    } catch (signInError) {
                        logDebug('Sign-in attempt failed:', signInError);
                        
                        // If user doesn't exist or credentials are invalid, create new account
                        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                            logDebug('Creating new user account');
                            userCredential = await createUserWithEmailAndPassword(auth, email, password);
                            logDebug('New user created successfully');
                        } else {
                            throw signInError;
                        }
                    }

                    const uid = userCredential.user.uid;
                    logDebug(`Authentication successful for UID: ${uid}`);

                    // Update user document with latest login
                    await setDoc(doc(db, "users", uid), {
                        email: email,
                        lastLogin: new Date().toISOString(),
                        lastLoginSuccess: true,
                        loginAttempts: 0 // Reset login attempts on success
                    }, { merge: true });

                    await handleSuccessfulLogin(email, uid);

                } catch (error) {
                    logDebug('Authentication error:', error);
                    let errorMessage = 'Login failed. ';
                    
                    switch(error.code) {
                        case 'auth/too-many-requests':
                            errorMessage += 'Too many attempts. Please try again later.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage += 'Please check your internet connection.';
                            break;
                        default:
                            errorMessage += 'Please try again.';
                    }
                    
                    showMessage(errorMessage, 5000);
                }
            } else {
                showMessage('Invalid verification code. Please try again.', 3000);
            }
        } catch (error) {
            logDebug('Login process failed:', error);
            showMessage('Login failed. Please try again later.', 5000);
        } finally {
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    });

    // Update the verification handler
    verifyBtn.addEventListener('click', async function() {
        const enteredCode = Array.from(inputs).map(input => input.value).join('');
        const storedCode = localStorage.getItem('verificationCode');
        const email = localStorage.getItem('userEmail');

        try {
            verifyBtn.classList.add('loading');
            verifyBtn.disabled = true;
            logDebug('Starting verification process...');

            if (enteredCode === storedCode) {
                try {
                    // Create a fixed password for the user
                    const password = btoa(email).slice(0, 16);
                    
                    let userCredential;
                    try {
                        // First try to sign in
                        userCredential = await signInWithEmailAndPassword(auth, email, password);
                        logDebug('Existing user signed in');
                    } catch (signInError) {
                        if (signInError.code === 'auth/user-not-found') {
                            // Create new user if not found
                            userCredential = await createUserWithEmailAndPassword(auth, email, password);
                            logDebug('New user created');
                        } else {
                            throw signInError;
                        }
                    }

                    const uid = userCredential.user.uid;
                    logDebug('Authentication successful, initializing user data...');

                    try {
                        // Initialize user document with proper path
                        await setDoc(doc(db, "users", uid), {
                            email: email,
                            lastLogin: new Date().toISOString(),
                            createdAt: new Date().toISOString()
                        }, { merge: true });

                        // Initialize cart and wishlist after authentication
                        await Promise.all([
                            initializeUserData(uid, 'cart'),
                            initializeUserData(uid, 'wishlist')
                        ]);

                        await handleSuccessfulLogin(email, uid);
                    } catch (dbError) {
                        logDebug('Database operation failed:', dbError);
                        if (dbError.code === 'permission-denied') {
                            showMessage('Login successful, but some data could not be loaded. Please try logging in again.');
                        } else {
                            throw dbError;
                        }
                    }
                } catch (error) {
                    logDebug('Authentication error:', error);
                    let errorMessage = 'Login failed: ';
                    
                    switch(error.code) {
                        case 'auth/too-many-requests':
                            errorMessage += 'Too many attempts. Please try again later.';
                            break;
                        case 'auth/permission-denied':
                            errorMessage += 'Access denied. Please contact support.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage += 'Network error. Please check your connection.';
                            break;
                        default:
                            errorMessage += 'An unexpected error occurred. Please try again.';
                    }
                    showMessage(errorMessage, 5000);
                }
            } else {
                showMessage('Invalid verification code. Please try again.');
            }
        } catch (error) {
            logDebug('Top-level error:', error);
            showMessage('Login failed. Please try again later.');
        } finally {
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    });

    // Update the initializeUserData function to handle permissions
    async function initializeUserData(uid, collection) {
        try {
            logDebug(`Initializing ${collection} for user ${uid}`);
            const docRef = doc(db, `users/${uid}/${collection}/data`);
            
            // First try to get existing data
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                // Initialize with default data
                const defaultData = {
                    items: [],
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    userId: uid
                };

                await setDoc(docRef, defaultData);
                logDebug(`Created new ${collection} for user ${uid}`);
                return defaultData;
            }

            logDebug(`${collection} already exists for user ${uid}`);
            return docSnap.data();
        } catch (error) {
            logDebug(`Error in initializeUserData for ${collection}:`, error);
            throw error; // Propagate error for handling
        }
    }
});

// Updated success handler
async function handleSuccessfulLogin(email, uid) {
    try {
        logDebug('Starting login process for user:', uid);
        
        // First ensure user document exists
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            email: email,
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }, { merge: true });

        // Initialize user data with retries
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                // Initialize both cart and wishlist
                const [cartData, wishlistData] = await Promise.all([
                    initializeUserData(uid, 'cart'),
                    initializeUserData(uid, 'wishlist')
                ]);

                // Set session data
                localStorage.clear();
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', uid);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('cartItems', JSON.stringify(cartData.items || []));
                localStorage.setItem('wishlist', JSON.stringify(wishlistData.items || []));

                logDebug('Login successful, redirecting...');
                window.location.href = 'index.html';
                return;
            } catch (error) {
                attempts++;
                logDebug(`Attempt ${attempts} failed:`, error);
                if (attempts === maxAttempts) {
                    throw error;
                }
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        logDebug('Fatal error in handleSuccessfulLogin:', error);
        if (error.code === 'permission-denied') {
            showMessage('Access denied. Please try logging in again.', 5000);
        } else {
            showMessage('Error setting up user data. Please try again.', 5000);
        }
        throw error;
    }
}

// Update verification handler
async function handleVerification(email, password) {
    if (!rateLimitTracker.check()) {
        const waitMinutes = Math.ceil(rateLimitTracker.resetTime / 60000);
        throw new Error(`Too many login attempts. Please try again in ${waitMinutes} minutes.`);
    }

    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password);
        rateLimitTracker.reset(); // Reset on successful login
        return userCredential;
    } catch (error) {
        rateLimitTracker.increment();
        throw error;
    }
}

// Update the verify button click handler
verifyBtn.addEventListener('click', async function() {
    const enteredCode = Array.from(inputs).map(input => input.value).join('');
    const storedCode = localStorage.getItem('verificationCode');
    const email = localStorage.getItem('userEmail');

    try {
        verifyBtn.classList.add('loading');
        verifyBtn.disabled = true;

        if (enteredCode === storedCode) {
            const password = btoa(email).slice(0, 16);
            
            try {
                const userCredential = await handleVerification(email, password);
                const uid = userCredential.user.uid;

                // Initialize user data
                await setDoc(doc(db, "users", uid), {
                    email: email,
                    lastLogin: new Date().toISOString(),
                    loginAttempts: 0
                }, { merge: true });

                await handleSuccessfulLogin(email, uid);
            } catch (error) {
                logDebug('Authentication error:', error);
                let errorMessage;
                
                switch(error.code) {
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many attempts. Please wait 15 minutes before trying again.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your connection.';
                        break;
                    default:
                        if (error.message.includes('Too many login attempts')) {
                            errorMessage = error.message;
                        } else {
                            errorMessage = 'Login failed. Please try again.';
                        }
                }
                
                showMessage(errorMessage, 7000);
            }
        } else {
            rateLimitTracker.increment();
            showMessage('Invalid verification code. Please try again.', 3000);
        }
    } catch (error) {
        logDebug('Login process failed:', error);
        showMessage(error.message || 'Login failed. Please try again later.', 5000);
    } finally {
        verifyBtn.classList.remove('loading');
        verifyBtn.disabled = false;
    }
});
