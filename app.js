// Surfers Bahia FM PWA - Audio Controls and Service Worker Logic

// Configuration
const CONFIG = {
    streamUrl: 'https://sonic2.sistemahost.es/8110/stream',
    stationName: 'Surfers Bahia FM',
    defaultVolume: 0.7
};

// Global audio instance
const audio = new Audio(CONFIG.streamUrl);
audio.crossOrigin = 'anonymous';
audio.autoplay = true;  // Enable autoplay
audio.volume = CONFIG.defaultVolume;

// DOM elements
const logo = document.getElementById('logo-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumePercentage = document.getElementById('volume-percentage');
const installBtn = document.getElementById('install-btn');
const statusText = document.getElementById('status-text');
const nowPlaying = document.getElementById('now-playing');

// Application state
let isPlaying = false;
let isLoading = false;
let lastVolume = CONFIG.defaultVolume;

/**
 * Initialize the application
 */
function init() {
    setupEventListeners();
    setupAudioEvents();
    registerServiceWorker();
    updateUI();
    
    // Auto-play on page load
    startAutoPlay();
    
    // Initialize volume percentage display
    updateVolumePercentage(CONFIG.defaultVolume);
    
    // Check install button visibility
    updateInstallButtonVisibility();
    
    // TODO: Add metadata retrieval
    // TODO: Add error handling for network issues
    // TODO: Add keyboard shortcuts
}

/**
 * Setup DOM event listeners
 */
function setupEventListeners() {
    // Logo click - play/pause toggle
    logo.addEventListener('click', togglePlayback);
    
    // Mute button
    muteBtn.addEventListener('click', toggleMute);
    
    // Volume slider
    volumeSlider.addEventListener('input', handleVolumeChange);
    
    // Install button
    if (installBtn) {
        installBtn.addEventListener('click', handlePWAInstall);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Visibility change - pause when tab is hidden (optional)
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Setup audio event listeners
 */
function setupAudioEvents() {
    audio.addEventListener('loadstart', () => {
        isLoading = true;
        updateUI();
    });
    
    audio.addEventListener('canplay', () => {
        isLoading = false;
        updateUI();
    });
    
    audio.addEventListener('play', () => {
        isPlaying = true;
        logo.classList.add('playing');
        if (statusText) statusText.textContent = 'Now Playing';
        updateUI();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        logo.classList.remove('playing');
        if (statusText) statusText.textContent = 'Click logo to start playing';
        updateUI();
    });
    
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        handleAudioError();
    });
    
    audio.addEventListener('waiting', () => {
        if (statusText) statusText.textContent = 'Buffering...';
    });
    
    audio.addEventListener('playing', () => {
        if (statusText) statusText.textContent = 'Now Playing';
    });
}

/**
 * Toggle audio playback
 */
function togglePlayback() {
    if (isLoading) return;
    
    try {
        if (audio.paused) {
            audio.play().catch(handleAudioError);
        } else {
            audio.pause();
        }
    } catch (error) {
        handleAudioError(error);
    }
}

/**
 * Toggle mute state
 */
function toggleMute() {
    if (audio.muted) {
        audio.muted = false;
        audio.volume = lastVolume;
        muteBtn.textContent = audio.volume === 0 ? '�' : '🔈';
        volumeSlider.value = lastVolume;
    } else {
        lastVolume = audio.volume;
        audio.muted = true;
        muteBtn.textContent = '🔇';
        volumeSlider.value = 0;
    }
    updateUI();
}

/**
 * Handle volume slider changes
 */
function handleVolumeChange(event) {
    const volume = parseFloat(event.target.value);
    audio.volume = volume;
    lastVolume = volume;
    
    if (volume === 0) {
        audio.muted = true;
        muteBtn.textContent = '🔇';
    } else {
        audio.muted = false;
        muteBtn.textContent = '🔈';
    }
    
    // Update volume percentage display
    updateVolumePercentage(volume);
    updateUI();
}

/**
 * Update volume percentage display
 */
function updateVolumePercentage(volume) {
    if (volumePercentage) {
        const percentage = Math.round(volume * 100);
        volumePercentage.textContent = `${percentage}%`;
        
        // Update color based on volume level
        volumePercentage.classList.remove('muted', 'high');
        
        if (percentage === 0) {
            volumePercentage.classList.add('muted');
        } else if (percentage >= 80) {
            volumePercentage.classList.add('high');
        }
    }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboard(event) {
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            togglePlayback();
            break;
        case 'KeyM':
            event.preventDefault();
            toggleMute();
            break;
        case 'ArrowUp':
            event.preventDefault();
            adjustVolume(0.1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            adjustVolume(-0.1);
            break;
    }
}

/**
 * Adjust volume by increment
 */
function adjustVolume(increment) {
    const newVolume = Math.max(0, Math.min(1, audio.volume + increment));
    audio.volume = newVolume;
    volumeSlider.value = newVolume;
    lastVolume = newVolume;
    
    if (newVolume === 0) {
        audio.muted = true;
        muteBtn.textContent = '🔇';
    } else {
        audio.muted = false;
        muteBtn.textContent = '🔈';
    }
    
    // Update volume percentage display
    updateVolumePercentage(newVolume);
    updateUI();
}

/**
 * Handle visibility changes
 */
function handleVisibilityChange() {
    // TODO: Implement behavior for when tab becomes hidden/visible
    // Option 1: Pause when hidden, resume when visible
    // Option 2: Continue playing in background
    // Currently: Continue playing (better for radio)
}

/**
 * Handle audio errors
 */
function handleAudioError(error) {
    console.error('Audio playback error:', error);
    isPlaying = false;
    isLoading = false;
    logo.classList.remove('playing');
    if (statusText) {
        statusText.textContent = 'Error: Unable to play stream';
        statusText.className = 'error';
    }
    
    // TODO: Add retry mechanism
    // TODO: Add user notification
    // TODO: Add fallback stream URL
}

/**
 * Update UI elements
 */
function updateUI() {
    // Update logo state
    if (isLoading) {
        logo.classList.add('loading');
    } else {
        logo.classList.remove('loading');
    }
    
    // Update volume slider
    volumeSlider.value = audio.muted ? 0 : audio.volume;
    
    // TODO: Update now playing information
    // TODO: Update favicon based on state
    // TODO: Update page title with current status
}

/**
 * Service Worker Registration
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // TODO: Show update notification to user
                            console.log('New version available');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

/**
 * PWA Installation
 */
let deferredPrompt;

// Check if app is already installed
function isAppInstalled() {
    // Check for standalone mode (Android Chrome, Edge)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    
    // Check for iOS standalone mode
    if (window.navigator.standalone === true) {
        return true;
    }
    
    // Check for other PWA indicators
    if (document.referrer.includes('android-app://')) {
        return true;
    }
    
    return false;
}

// Show/hide install button based on conditions
function updateInstallButtonVisibility() {
    if (installBtn) {
        const shouldShow = deferredPrompt && !isAppInstalled();
        installBtn.style.display = shouldShow ? 'block' : 'none';
        
        // Debug information
        console.log('Install button visibility check:', {
            hasDeferredPrompt: !!deferredPrompt,
            isAppInstalled: isAppInstalled(),
            shouldShow: shouldShow,
            buttonDisplay: installBtn.style.display
        });
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Store the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button if app is not already installed
    updateInstallButtonVisibility();
    
    console.log('PWA install prompt available');
});

/**
 * Handle PWA installation
 */
function handlePWAInstall() {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                
                // Optional: Show installing message
                if (statusText) {
                    const originalText = statusText.textContent;
                    statusText.textContent = 'Installing app...';
                    statusText.className = 'info';
                    
                    // Reset after a moment if installation doesn't complete
                    setTimeout(() => {
                        if (statusText.textContent === 'Installing app...') {
                            statusText.textContent = originalText;
                            statusText.className = '';
                        }
                    }, 5000);
                }
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            updateInstallButtonVisibility();
        });
    } else {
        console.log('Install prompt not available');
        
        // Provide user feedback
        if (statusText) {
            const originalText = statusText.textContent;
            statusText.textContent = 'App installation not available';
            statusText.className = 'warning';
            
            setTimeout(() => {
                statusText.textContent = originalText;
                statusText.className = '';
            }, 3000);
        }
    }
}

/**
 * Handle app installation
 */
window.addEventListener('appinstalled', (e) => {
    console.log('PWA was installed');
    // Hide install button
    updateInstallButtonVisibility();
    
    // Optional: Show success message
    if (statusText) {
        const originalText = statusText.textContent;
        statusText.textContent = 'App installed successfully!';
        statusText.className = 'success';
        
        setTimeout(() => {
            statusText.textContent = originalText;
            statusText.className = '';
        }, 3000);
    }
});

/**
 * Media Session API (for media controls in notifications/lock screen)
 */
function setupMediaSession() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Live Stream',
            artist: CONFIG.stationName,
            album: 'Live Radio',
            artwork: [
                { src: 'assets/logo.png', sizes: '192x192', type: 'image/png' }
            ]
        });
        
        navigator.mediaSession.setActionHandler('play', () => {
            if (audio.paused) togglePlayback();
        });
        
        navigator.mediaSession.setActionHandler('pause', () => {
            if (!audio.paused) togglePlayback();
        });
        
        // TODO: Add more media session handlers
        // TODO: Add seeking controls if supported
    }
}

/**
 * Network status monitoring
 */
function setupNetworkMonitoring() {
    window.addEventListener('online', () => {
        console.log('Network connection restored');
        // TODO: Show connection restored message
        // TODO: Attempt to resume playback if needed
    });
    
    window.addEventListener('offline', () => {
        console.log('Network connection lost');
        // TODO: Show offline message
        // TODO: Pause playback
    });
}

/**
 * Start auto-play when page loads
 */
function startAutoPlay() {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        // Modern browsers require user interaction for autoplay
        // We'll try to play, but handle gracefully if it fails
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Auto-play started successfully');
                    isPlaying = true;
                    logo.classList.add('playing');
                    updateUI();
                })
                .catch(error => {
                    console.log('Auto-play was prevented by browser policy:', error);
                    // Auto-play was prevented, which is normal
                    // User will need to click the logo to start playing
                    isPlaying = false;
                    logo.classList.remove('playing');
                    updateUI();
                    
                    // Add a visual hint that user can click to play
                    if (logo) {
                        logo.style.opacity = '0.8';
                        logo.style.transform = 'scale(0.95)';
                        
                        // Remove the hint after a few seconds
                        setTimeout(() => {
                            logo.style.opacity = '1';
                            logo.style.transform = 'scale(1)';
                        }, 2000);
                    }
                });
        }
    }, 100);
}

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupMediaSession();
    setupNetworkMonitoring();
});

// TODO: Add analytics tracking
// TODO: Add playlist/history functionality
// TODO: Add social sharing features
// TODO: Add user preferences storage
// TODO: Add custom equalizer
// TODO: Add sleep timer functionality
