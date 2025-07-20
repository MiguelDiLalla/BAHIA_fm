// Bahia FM PWA - Audio Controls and Service Worker Logic

// Configuration
const CONFIG = {
    streamUrl: 'https://sonic2.sistemahost.es/8110/stream',
    stationName: 'Bahia FM',
    defaultVolume: 0.7
};

// Global audio instance
const audio = new Audio(CONFIG.streamUrl);
audio.crossOrigin = 'anonymous';
audio.volume = CONFIG.defaultVolume;

// DOM elements
const logo = document.getElementById('logo-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumePercentage = document.getElementById('volume-percentage');
const installBtn = document.getElementById('install-btn');
const statusText = document.getElementById('status-text');
const nowPlaying = document.getElementById('now-playing');
const shareBtn = document.getElementById('share-btn');
const shareDropdown = document.getElementById('share-dropdown');
const scrollingContainer = document.getElementById('scrolling-container');

// Application state
let isPlaying = false;
let isLoading = false;
let lastVolume = CONFIG.defaultVolume;
let hasStartedScrolling = false;

// ================================
// SCROLLING TEXT CONFIGURATION
// ================================

/**
 * Default configuration - used as fallback if JSON loading fails
 */
const DEFAULT_SCROLL_CONFIG = {
    speed: 100, // pixels per second
    pauseBetweenMessages: 1000, // milliseconds
    fadeTransition: 500 // milliseconds
};

/**
 * Animation configuration loaded from JSON
 */
let scrollConfig = { ...DEFAULT_SCROLL_CONFIG };
let scrollingMessages = [];
let currentMessageIndex = 0;
let scrollingStarted = false;
let currentAnimation = null;

// ================================
// GA4 ANALYTICS TRACKING
// ================================

/**
 * GA4 event tracking helper
 * @param {string} name - Event name
 * @param {Object} params - Event parameters
 */
function gaEvent(name, params = {}) {
    if (typeof gtag === 'function') {
        gtag('event', name, params);
        console.log('GA4 Event:', name, params);
    }
}

/**
 * Detect if app is installed as PWA
 * @returns {boolean} True if app is installed
 */
function isAppInstalled() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.startsWith('android-app://')
    );
}

/**
 * Get platform type for PWA installation
 * @returns {string} Platform identifier
 */
function getPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    return 'desktop';
}

// Track buffer state for proper buffer events
let isBuffering = false;

// ================================
// END GA4 ANALYTICS TRACKING
// ================================

/**
 * Setup GA4 tracking for social media links and PWA events
 */
function setupGA4Tracking() {
    // Track social media outbound clicks
    const instagramLink = document.querySelector('a[href*="instagram.com"]');
    const facebookLink = document.querySelector('a[href*="facebook.com"]');
    
    if (instagramLink) {
        instagramLink.addEventListener('click', () => {
            gaEvent('outbound_instagram', { url: instagramLink.href });
        });
    }
    
    if (facebookLink) {
        facebookLink.addEventListener('click', () => {
            gaEvent('outbound_facebook', { url: facebookLink.href });
        });
    }
    
    // Track PWA installation events
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        gaEvent('pwa_prompt_shown');
    });
    
    window.addEventListener('appinstalled', () => {
        gaEvent('pwa_install_success', { 
            platform: getPlatform() 
        });
    });
    
    // Track install button clicks if available
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                
                if (choiceResult.outcome === 'accepted') {
                    gaEvent('pwa_install_accept');
                } else {
                    gaEvent('pwa_install_dismiss');
                }
                
                deferredPrompt = null;
            }
        });
    }
}

/**
 * Initialize the application
 */
function init() {
    setupEventListeners();
    setupAudioEvents();
    registerServiceWorker();
    updateUI();
    
    // Initialize scrolling text
    loadScrollingMessages();
    showInitialMessage();
    
    // Initialize volume percentage display
    updateVolumePercentage(CONFIG.defaultVolume);
    
    // Check install button visibility
    updateInstallButtonVisibility();
    
    // Setup GA4 tracking
    setupGA4Tracking();
    
    // Fire manual page_view with install state
    gaEvent('page_view', {
        page_location: location.href,
        page_title: document.title,
        install_state: isAppInstalled() ? 'installed' : 'browser'
    });
    
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
    
    // Share button and dropdown
    if (shareBtn && shareDropdown) {
        shareBtn.addEventListener('click', toggleShareDropdown);
        
        // Share options
        shareDropdown.addEventListener('click', handleShareOption);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
                shareDropdown.classList.remove('show');
            }
        });
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
        
        // Track pause event
        gaEvent('stream_pause', {
            position_sec: Math.round(audio.currentTime || 0)
        });
    });
    
    audio.addEventListener('playing', () => {
        if (statusText) statusText.textContent = 'Now Playing';
        
        // Track resume event (if was buffering or paused)
        if (isBuffering) {
            gaEvent('buffer_end', {
                position_sec: Math.round(audio.currentTime || 0)
            });
            isBuffering = false;
        } else if (!isPlaying) {
            gaEvent('stream_resume', {
                position_sec: Math.round(audio.currentTime || 0)
            });
        }
    });
    
    audio.addEventListener('waiting', () => {
        if (statusText) statusText.textContent = 'Buffering...';
        
        // Track buffer start
        gaEvent('buffer_start', {
            position_sec: Math.round(audio.currentTime || 0)
        });
        isBuffering = true;
    });
    
    audio.addEventListener('ended', () => {
        // Track stream end (for recorded content)
        gaEvent('stream_end', {
            duration_sec: Math.round(audio.duration || 0)
        });
    });
    
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        handleAudioError();
    });
}

/**
 * Toggle audio playback
 */
function togglePlayback() {
    if (isLoading) return;
    
    try {
        if (audio.paused) {
            audio.play().then(() => {
                // Track stream play event
                gaEvent('stream_play', {
                    station: CONFIG.stationName,
                    autoplay: false
                });
            }).catch(handleAudioError);
            
            // Start scrolling text on first play
            if (!hasStartedScrolling) {
                startScrollingText();
                hasStartedScrolling = true;
            } else {
                resumeScrollingText();
            }
        } else {
            audio.pause();
            pauseScrollingText();
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
        muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔈';
        volumeSlider.value = lastVolume;
        gaEvent('mute_off');
    } else {
        lastVolume = audio.volume;
        audio.muted = true;
        muteBtn.textContent = '🔇';
        volumeSlider.value = 0;
        gaEvent('mute_on');
    }
    updateUI();
}

// ================================
// ENHANCED SCROLLING TEXT FUNCTIONALITY
// ================================

/**
 * Converts JSON animation settings to pixel-based configuration
 * @param {Object} jsonSettings - Settings from JSON file
 * @returns {Object} Processed configuration object
 */
function processJsonSettings(jsonSettings) {
    const config = { ...DEFAULT_SCROLL_CONFIG };
    
    // Direct speed setting (takes priority)
    if (jsonSettings.speed && typeof jsonSettings.speed === 'number' && jsonSettings.speed > 0) {
        config.speed = jsonSettings.speed;
    } else if (jsonSettings.animationDuration) {
        // Convert duration string to speed
        const durationMatch = jsonSettings.animationDuration.match(/^(\d+(?:\.\d+)?)s?$/);
        if (durationMatch) {
            const duration = parseFloat(durationMatch[1]) * 1000;
            config.speed = 800 / (duration / 1000); // Assume 800px average width
        }
    }
    
    // Pause between messages
    if (jsonSettings.pauseBetweenMessages && typeof jsonSettings.pauseBetweenMessages === 'number') {
        config.pauseBetweenMessages = Math.max(500, jsonSettings.pauseBetweenMessages);
    } else if (jsonSettings.animationDelay) {
        const delayMatch = jsonSettings.animationDelay.match(/^(\d+(?:\.\d+)?)s?$/);
        if (delayMatch) {
            config.pauseBetweenMessages = Math.max(500, parseFloat(delayMatch[1]) * 1000);
        }
    }
    
    // Fade transition
    if (jsonSettings.fadeTransition && typeof jsonSettings.fadeTransition === 'number') {
        config.fadeTransition = Math.max(100, Math.min(2000, jsonSettings.fadeTransition));
    }
    
    return config;
}

/**
 * Show initial static message before scrolling starts
 */
function showInitialMessage() {
    const container = document.getElementById('scrolling-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const initialMessage = document.createElement('div');
    initialMessage.classList.add('initial-message');
    initialMessage.textContent = 'Tap Logo to START';
    
    container.appendChild(initialMessage);
}

/**
 * Loads scrolling messages and configuration from JSON file
 * Provides comprehensive error handling and fallbacks
 * @returns {Promise<void>}
 */
async function loadScrollingMessages() {
    try {
        const response = await fetch('data/scrolling-text.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Load messages with fallback
        scrollingMessages = data.messages?.length > 0 
            ? data.messages 
            : ["🎵 Bahia FM - Streaming now! 🏄‍♂️"];
        
        // Process and apply settings
        if (data.settings) {
            scrollConfig = processJsonSettings(data.settings);
            console.log('Scrolling configuration loaded:', scrollConfig);
        }
        
    } catch (error) {
        console.error('Error loading scrolling messages:', error);
        
        // Fallback messages and configuration
        scrollingMessages = [
            "🎵 Bahia FM - Streaming now! 🏄‍♂️",
            "🌊 Best surf and skate music 🛹"
        ];
        scrollConfig = { ...DEFAULT_SCROLL_CONFIG };
        
        console.log('Using fallback configuration:', scrollConfig);
    }
}

/**
 * Starts scrolling animation with dynamic configuration
 * Uses Web Animations API for precise control
 */
function startScrollingAnimation() {
    const container = document.getElementById('scrolling-container');
    if (!container || !scrollingMessages.length) return;
    
    container.innerHTML = ''; // Clear previous content (including initial message)
    
    // Create message element
    const messageElem = document.createElement('div');
    messageElem.classList.add('scrolling-message');
    messageElem.textContent = scrollingMessages[currentMessageIndex];
    container.appendChild(messageElem);
    
    // Measure dimensions after rendering
    requestAnimationFrame(() => {
        const containerWidth = container.clientWidth;
        const messageWidth = messageElem.scrollWidth; // Use scrollWidth for accurate measurement
        
        // Calculate animation parameters
        const totalDistance = containerWidth + messageWidth;
        const duration = (totalDistance / scrollConfig.speed) * 1000; // Convert to milliseconds
        
        console.log(`Animating message ${currentMessageIndex + 1}:`, {
            text: scrollingMessages[currentMessageIndex].substring(0, 30) + '...',
            distance: totalDistance,
            duration: duration,
            speed: scrollConfig.speed
        });
        
        // Fade in
        messageElem.style.opacity = 1;
        messageElem.style.transition = `opacity ${scrollConfig.fadeTransition}ms ease`;
        
        // Animate scrolling with precise timing
        currentAnimation = messageElem.animate([
            { transform: `translateX(${containerWidth}px)` },
            { transform: `translateX(-${messageWidth}px)` }
        ], {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
        });
        
        // Handle animation completion
        currentAnimation.onfinish = () => {
            // Fade out before next message
            messageElem.style.opacity = 0;
            
            setTimeout(() => {
                currentMessageIndex = (currentMessageIndex + 1) % scrollingMessages.length;
                startScrollingAnimation();
            }, scrollConfig.pauseBetweenMessages);
        };
    });
}

/**
 * Initiates scrolling text system on first play
 * Loads configuration and starts animation cycle
 */
async function initiateScrollingText() {
    if (scrollingStarted) return;
    
    scrollingStarted = true;
    console.log('Initializing scrolling text system...');
    
    await loadScrollingMessages();
    
    if (scrollingMessages.length > 0) {
        console.log(`Starting scrolling text with ${scrollingMessages.length} messages`);
        startScrollingAnimation();
    }
}

/**
 * Start scrolling text (called on first play)
 */
function startScrollingText() {
    initiateScrollingText();
}

/**
 * Pause scrolling text animation
 */
function pauseScrollingText() {
    if (currentAnimation) {
        currentAnimation.pause();
    }
}

/**
 * Resume scrolling text animation
 */
function resumeScrollingText() {
    if (currentAnimation) {
        currentAnimation.play();
    }
}

// ================================
// END ENHANCED SCROLLING TEXT FUNCTIONALITY
// ================================

/**
 * Handle volume slider changes
 */
function handleVolumeChange(event) {
    const volume = parseFloat(event.target.value);
    audio.volume = volume;
    lastVolume = volume;
    
    // Track volume change event
    gaEvent('volume_change', {
        volume_level: volume
    });
    
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
        // Track install button click
        gaEvent('pwa_install_prompt_click', {
            platform: getPlatform()
        });
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                gaEvent('pwa_install_accept', {
                    platform: getPlatform()
                });
                
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
                gaEvent('pwa_install_dismiss', {
                    platform: getPlatform()
                });
            }
            deferredPrompt = null;
            updateInstallButtonVisibility();
        });
    } else {
        console.log('Install prompt not available');
        gaEvent('pwa_install_unavailable', {
            platform: getPlatform()
        });
        
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
    gaEvent('pwa_install_success', {
        platform: getPlatform()
    });
    
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
 * Toggle share dropdown visibility
 */
function toggleShareDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    shareDropdown.classList.toggle('show');
}

/**
 * Handle share option clicks
 */
function handleShareOption(event) {
    event.preventDefault();
    
    const shareOption = event.target.closest('.share-option');
    if (!shareOption) return;
    
    const shareType = shareOption.getAttribute('data-share');
    const url = window.location.href;
    const title = 'Bahia FM - Radio Musical para amantes del Surf y el Skate';
    const text = 'Radio Musical para amantes del Surf, el Skate, la Playa y los Deportes extremos.';
    
    // Close dropdown
    shareDropdown.classList.remove('show');
    
    switch (shareType) {
        case 'whatsapp':
            gaEvent('share', {
                method: 'whatsapp',
                content_type: 'url',
                item_id: 'bahia_fm_stream'
            });
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            break;
            
        case 'twitter':
            gaEvent('share', {
                method: 'twitter',
                content_type: 'url',
                item_id: 'bahia_fm_stream'
            });
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            break;
            
        case 'telegram':
            gaEvent('share', {
                method: 'telegram',
                content_type: 'url',
                item_id: 'bahia_fm_stream'
            });
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
            break;
            
        case 'email':
            gaEvent('share', {
                method: 'email',
                content_type: 'url',
                item_id: 'bahia_fm_stream'
            });
            window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
            break;
            
        case 'copy':
            gaEvent('share', {
                method: 'copy_link',
                content_type: 'url',
                item_id: 'bahia_fm_stream'
            });
            copyToClipboard(url);
            showCopyFeedback();
            break;
            
        case 'instagram':
            gaEvent('share', {
                method: 'instagram',
                content_type: 'url',
                item_id: 'bahia_fm_stream'
            });
            // Instagram doesn't support direct URL sharing, so we'll copy the link
            copyToClipboard(url);
            showInstagramFeedback();
            break;
            
        default:
            console.log('Unknown share type:', shareType);
    }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

/**
 * Show copy feedback
 */
function showCopyFeedback() {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = '¡Link copiado!';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #111;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: "Doto", sans-serif;
        font-weight: 700;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

/**
 * Show Instagram feedback
 */
function showInstagramFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = '¡Link copiado! Pégalo en Instagram Stories';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #111;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: "Doto", sans-serif;
        font-weight: 700;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 250px;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

/**
 * Start auto-play when page loads
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
