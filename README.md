# Bahia FM PWA

A Progressive Web App for streaming Bahia FM - Radio Musical para amantes del Surf, el Skate, la Playa y los Deportes extremos. Your favorite reggae and surf music station available 24/7.

## Features

### 🎵 Audio Streaming
- Live radio stream from `https://sonic2.sistemahost.es/8110/stream`
- Click-to-play logo control with visual feedback
- Volume slider with percentage display and color-coded feedback
- Mute/unmute functionality with visual indicators
- Background audio streaming capability
- Media Session API integration for lock screen controls
- Keyboard shortcuts (Space: play/pause, M: mute, arrows: volume)

### 📱 Progressive Web App
- Installable on mobile and desktop devices with guided installation
- Offline-capable with smart caching strategies (cache-first for static assets, network-first for dynamic content)
- Responsive design optimized for all screen sizes
- Native app-like experience with custom manifest and shortcuts
- Service worker v2.1.0 with comprehensive caching and update handling
- Auto-detection of PWA vs browser usage for analytics

### 🎨 Modern UI Design & Theming
- **Dual Theme System**: Toggle between OriginalColor (colorful) and Secondary (minimalist) themes
  - OriginalColor theme: Vibrant blue/gold design with full-color logo and background
  - Secondary theme: Clean white/black design with monochrome assets
  - Theme preference saved to localStorage with automatic persistence
  - Dynamic logo and background image switching
- Clean, professional design with Doto font family
- **Advanced Scrolling Text Strip**: JSON-configurable messaging system
  - 12 custom messages with surf/skate culture content
  - Independent animation timing with precise Web Animations API control
  - Starts when user first presses play, syncs with audio playback
  - Fully customizable via `data/scrolling-text.json` with speed, timing, and fade controls
  - Graceful fallback if JSON loading fails
- Smooth CSS transitions and hover effects
- Mobile-first responsive layout with touch-optimized controls

### 🚀 Social Integration & External Links
- **Comprehensive Share Functionality**: Professional sharing dropdown with 6 platforms
  - 📱 WhatsApp direct sharing with pre-formatted messages
  - 🐦 Twitter with optimized hashtags and station info
  - ✈️ Telegram messaging with description
  - 📧 Email with pre-filled subject and body content
  - 🔗 Copy link to clipboard with user feedback
  - 📷 Instagram sharing with copy-to-clipboard functionality
  - Click-outside-to-close and Escape key support
  - Mobile-responsive design with smooth animations
- **SurfFactory Partnership**: Dedicated bottom-left button linking to SurfFactory.pt
- Social media links to official Instagram and Facebook profiles
- Optimized meta tags for social media previews with custom share image
- Comprehensive analytics tracking for all sharing interactions

### 📊 Analytics & Tracking
- **Google Analytics GA4**: Comprehensive event tracking system (G-4BFB1KMVW1)
  - **User Segmentation**: Automatic detection and tracking of PWA vs. browser users
  - **Complete Audio Lifecycle**: Stream play/pause/resume, buffer events, volume changes, mute interactions
  - **Sharing Analytics**: Platform-specific share interaction tracking across all 6 platforms
  - **PWA Installation Funnel**: Full installation lifecycle tracking from prompt to completion
  - **Social Outbound**: Track clicks to Instagram, Facebook, and SurfFactory profiles
  - **User Engagement**: Session metrics, theme changes, and interaction patterns
  - **Performance Tracking**: Buffer events, stream reliability, and technical metrics
- **Privacy-First Implementation**: No tracking cookies, GDPR-compliant anonymous tracking
- **Real-time Insights**: Comprehensive dashboard data for user behavior and stream performance
- **Custom Event Helper**: Centralized `gaEvent()` function with error handling and consent checking

### 🔒 Privacy & Consent Management
- **Full GDPR Compliance**: European privacy regulation compliance with Google-certified CMP
- **Cookiebot Integration**: Professional Consent Management Platform (CMP) implementation
  - Automatic cookie blocking with `data-blockingmode="auto"` until user consent
  - IAB TCF 2.2 (Transparency & Consent Framework) compatible
  - Google Consent Mode v2 seamless integration with GA4
  - Granular consent categories: Statistics, Marketing, Preferences
  - Multi-language support and customizable consent interface
- **Privacy-First Analytics**: All analytics fire only with proper user consent via `CookiebotOnAccept` events
- **No Tracking Cookies**: Anonymous tracking with consent-based user property setting
- **Legal Protection**: Certified CMP reduces compliance risk and handles regulation updates
- **Professional Consent Banner**: Customizable interface that builds user trust

### ⚡ Performance & Accessibility
- **Advanced Service Worker v2.1.0**: Multiple caching strategies for optimal performance
  - Cache-first strategy for static assets (images, fonts, icons)
  - Network-first strategy for dynamic content (HTML, CSS, JS, JSON)
  - Automatic cache versioning and cleanup
  - Graceful offline fallback with custom offline page
  - Smart cache invalidation on updates
- Optimized for low bandwidth connections with WebP image formats
- Fast loading times with efficient asset management and preloading
- Complete ARIA labels and keyboard navigation support
- Mobile-responsive design with touch-optimized controls
- WCAG compliant contrast ratios and accessibility features
- Cross-browser compatibility testing and fallback support

## Quick Start

1. **Clone or download** this repository
2. **Serve locally** using any static server (HTTPS recommended for full PWA features)
3. **Open** in a web browser and click the Bahia FM logo to start streaming
4. **Install** the PWA by clicking the "Instalar" button when prompted
5. **Share** the station using the share button in the navigation

### Development Server Options
```bash
# Python HTTP server
python -m http.server 8000

# Node.js serve
npx serve . -p 8000

# VS Code Live Server extension (recommended)
```

## File Structure

```
BAHIA_fm/
├── index.html          # Main application with audio player, navigation, and theming
├── style.css           # Comprehensive styles with dual-theme system and responsive design
├── app.js              # Audio controls, PWA logic, theme system, share functionality, and GA4 analytics
├── manifest.json       # Web App Manifest for PWA installation with shortcuts
├── sw.js              # Service Worker v2.1.0 for caching and offline support
├── test.html          # Stream testing page with metadata debugging tools
├── test.ipynb         # Jupyter notebook for development testing
├── package.json        # Project metadata, scripts, and dependencies
├── Gtag_config_guide.md # GA4 analytics implementation specification
├── CookiesBot_config_guide.md # GDPR compliance and Cookiebot setup guide
├── data/              # Configuration and content data
│   └── scrolling-text.json  # 12 scrolling messages with animation settings
├── assets/            # Media assets and branding (dual theme support)
│   ├── logo.webp      # Main station logo (secondary theme)
│   ├── logo_fullcolor.webp # Full-color logo (OriginalColor theme)
│   ├── logo.svg       # Scalable vector logo
│   ├── BahiaFM_BW_background.webp    # Black & white background (secondary theme)
│   ├── BahiaFM_Color_background.webp # Colorful background (OriginalColor theme)
│   ├── social-share-image.webp # Social media preview image
│   ├── SurfFactory_PT.webp    # SurfFactory partnership button image
│   ├── TurnToWebP.py  # Image optimization utility script
│   └── favicon/       # Complete favicon set for all platforms
│       ├── favicon.ico
│       ├── android-chrome-*.png
│       ├── apple-touch-icon.png
│       ├── favicon-*.png
│       └── FullColor/ # Alternative favicon set for OriginalColor theme
└── .github/           # GitHub configuration and workflow
    └── copilot-instructions.md # Development guidelines and project context
```

## Configuration

### Scrolling Text Customization

The scrolling text strip can be easily customized by editing `data/scrolling-text.json`. Current configuration includes 12 custom messages with surf/skate culture content:

```json
{
  "messages": [
    "Bahía Surfers Radio — tu ola de Classic Rock en Tenerife",
    "Sube el volumen, baja la quilla: rockeamos cada sesión de surf 🏄‍♂️",
    "De Hendrix a los Stones: himnos que chocan como olas 🌊🎸",
    "Reggae sunset vibes + rock adrenalina: equilibrio perfecto",
    "Skate, arena y riffs glam que pintan el cielo de neón ✨",
    "Rockabilly de alto octanaje para riders sin frenos 🚀",
    "Streaming & DAB: la música te sigue, estés donde estés",
    "Comunidad libre, joven, viajera… ¡enciende Bahía Surfers!",
    "La banda sonora oficial de tus take-offs y ollies 🤙",
    "Tenerife style: mar, volcán y rock que late fuerte",
    "Indie fresco para noches de fogata y estrellas 🌌",
    "Espíritu extremo, actitud positiva: eso es Bahía Surfers Radio"
  ],
  "settings": {
    "animationDuration": "2s",
    "animationDelay": "1s", 
    "scrollDirection": "left",
    "speed": 100,
    "pauseBetweenMessages": 1000,
    "fadeTransition": 500
  }
}
```

**Advanced Features:**
- **Precise Timing Control**: Uses Web Animations API for pixel-perfect scrolling
- **Dynamic Speed Calculation**: Automatically adjusts animation duration based on text length
- **Event-Driven System**: Starts on first play button click, syncs with audio playback state
- **Graceful Fallback**: Default messages if JSON fails to load
- **CSS Custom Properties**: Real-time animation adjustment
- **Performance Optimized**: RequestAnimationFrame for smooth rendering

### Analytics Configuration

The app includes comprehensive GA4 analytics tracking with the measurement ID `G-4BFB1KMVW1`. To configure for your own project:

1. **Current Implementation** (Bahia FM):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4BFB1KMVW1"></script>
<script>
    gtag('config', 'G-4BFB1KMVW1', { send_page_view: false });
</script>
```

2. **For Custom Implementation** - Update Measurement ID in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
    gtag('config', 'G-YOUR-ID', { send_page_view: false });
</script>
```

2. **Tracked Events** (automatically implemented):
```javascript
// User Segmentation
'page_view' - with install_state parameter (PWA vs browser)

// Audio Lifecycle
'stream_play' - when audio starts playing
'stream_pause' - when user pauses audio
'stream_resume' - when audio resumes after pause
'buffer_start' - when stream begins buffering
'buffer_end' - when buffering completes
'stream_end' - when stream ends (for recorded content)

// User Interactions
'volume_change' - when user adjusts volume
'mute_on' / 'mute_off' - when user toggles mute

// Sharing Events
'share' - platform-specific sharing (method: whatsapp|twitter|telegram|email|copy_link|instagram)

// Social Media Outbound
'outbound_instagram' - clicks to Instagram profile
'outbound_facebook' - clicks to Facebook profile

// PWA Installation Funnel
'pwa_prompt_shown' - when install prompt appears
'pwa_install_prompt_click' - when user clicks install button
'pwa_install_accept' - when user accepts install prompt
'pwa_install_dismiss' - when user dismisses install prompt
'pwa_install_success' - when app is successfully installed
'pwa_install_unavailable' - when install is not available
```

3. **Custom Dimensions Setup** (in GA4 Admin):
   - Create user-scoped custom dimension: `install_state`
   - Create event-scoped custom dimensions as needed for `platform`, `method`, etc.

4. **Privacy Compliance**:
   - No tracking cookies used
   - Anonymous tracking only
   - GDPR compliant with Cookiebot CMP
   - `send_page_view: false` prevents automatic page tracking
   - Analytics only fire with proper user consent

### Privacy & Consent Management (Cookiebot)

**GDPR Compliance Implementation:**

The app uses Cookiebot as a Google-certified Consent Management Platform (CMP) for full GDPR compliance:

```html
<!-- Cookiebot CMP (Google‑certified) -->
<script id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="fdc0ecbc-3104-4661-8edd-2e8ec43217a5"
        data-blockingmode="auto"
        type="text/javascript"></script>
```

**Key Features:**
- **IAB TCF 2.2 Compatible**: Transparency & Consent Framework compliance
- **Google Consent Mode v2**: Automatic integration with GA4
- **Automatic Cookie Blocking**: `data-blockingmode="auto"` prevents cookies until consent
- **Granular Categories**: Statistics, Marketing, Preferences user control
- **Legal Compliance**: EU GDPR, CCPA, and other privacy regulations

**Consent-Aware Analytics:**
```javascript
// User properties only set with consent
window.addEventListener('CookiebotOnAccept', () => {
    if (Cookiebot.consent.statistics) {
        gtag('set', 'user_properties', {
            install_state: isAppInstalled() ? 'installed' : 'browser'
        });
    }
});
```

**Configuration Benefits:**
- **Legal Protection**: Certified CMP reduces compliance risk
- **User Trust**: Professional consent interface builds confidence
- **Analytics Quality**: Only consented users provide reliable data
- **Automatic Updates**: Cookiebot handles regulation changes
- **Multi-Language**: Supports multiple languages for international users

**Testing Consent Implementation:**
1. **Open in incognito mode** (no browser extensions)
2. **Reject all cookies** → GA4 DebugView shows `analytics_storage=denied`
3. **Accept "Statistics"** → Refresh → GA4 shows `analytics_storage=granted`
4. **Check GA4 Admin** → Data Streams → Consent settings show proper status

**Customization via Cookiebot Dashboard:**
- **Content & Language**: Customize banner text and translations
- **Visual Design**: Match brand colors and positioning
- **Category Settings**: Configure cookie categories and descriptions
- **Domain Management**: Handle subdomains and staging environments

### Analytics Insights

**Key Metrics to Monitor:**

1. **User Engagement**:
   - PWA installation rate vs. browser users
   - Average session duration and stream listening time
   - Audio interaction patterns (play, pause, volume changes)

2. **Sharing Performance**:
   - Most popular sharing platforms
   - Viral coefficient and organic growth tracking
   - Social media outbound click rates

3. **Technical Performance**:
   - Buffer events and stream reliability
   - PWA installation funnel conversion rates
   - Platform-specific user behavior (iOS vs Android vs Desktop)

4. **Content Optimization**:
   - Peak listening hours and user activity patterns
   - Geographic distribution of listeners
   - User retention and repeat visit analysis

**GA4 Dashboard Setup**:
- Create custom reports for PWA vs browser user comparison
- Set up conversion goals for PWA installation
- Monitor real-time stream performance and user engagement
- Track sharing campaign effectiveness

## Development

### Local Development
```bash
# Serve the files using any static server
# Python (recommended for development)
python -m http.server 8000

# Node.js alternative
npx serve . -p 8000

# Access the app at: http://localhost:8000
```

### Stream Configuration
The app is configured for Bahia FM's live stream:
```javascript
// Current stream URL in app.js
const streamUrl = 'https://sonic2.sistemahost.es/8110/stream';
```

### PWA Testing
- Use Chrome DevTools > Application > Service Workers
- Test installation with DevTools > Application > Manifest  
- Verify offline functionality by toggling network in DevTools
- Test share functionality on different platforms

### Browser Compatibility
- **Chrome/Edge**: Full support including PWA installation
- **Firefox**: Full support with excellent audio streaming
- **Safari**: Full support with minor PWA limitations
- **Mobile browsers**: Optimized for mobile use with responsive design

## Customization

### Station Branding
```html
<!-- Update station name in index.html -->
<h1 class="station-name">Your Station Name</h1>

<!-- Update social media links -->
<a href="https://instagram.com/yourstation" target="_blank">
<a href="https://facebook.com/yourstation" target="_blank">
```

### Audio Stream
Edit the stream URL in `app.js`:
```javascript
// Replace with your stream URL
const streamUrl = 'https://your-stream-url.com/stream';
```

### Visual Customization
```css
/* Update colors in style.css */
:root {
    --primary-color: #your-color;
    --background-color: #your-bg;
    --text-color: #your-text;
}
```

### PWA Manifest
Update `manifest.json` for your station:
```json
{
  "name": "Your Station Name",
  "short_name": "Station",
  "description": "Your station description",
  "theme_color": "#your-theme-color",
  "background_color": "#your-bg-color"
}
```

### Analytics Customization
Update GA4 configuration in `index.html`:
```html
<!-- Current Bahia FM implementation -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4BFB1KMVW1"></script>
<script>
    gtag('config', 'G-4BFB1KMVW1', { 
        send_page_view: false,
        // Add custom configuration as needed
        custom_map: {
            'custom_parameter': 'custom_dimension_1'
        }
    });
</script>

<!-- For your own project, replace with your GA4 Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
    gtag('config', 'G-YOUR-ID', { 
        send_page_view: false,
        // Add custom configuration as needed
        custom_map: {
            'custom_parameter': 'custom_dimension_1'
        }
    });
</script>
```

**Analytics Event Customization:**
- Modify `gaEvent()` helper in `app.js` to add custom parameters
- Add new tracking events by calling `gaEvent('event_name', {params})`
- Customize user properties by updating the `install_state` logic
- Configure custom dimensions in GA4 admin to match your tracking needs

## Share Functionality

The app includes comprehensive sharing capabilities:

### Supported Platforms
- **WhatsApp**: Direct message sharing with station info
- **Twitter**: Tweet with hashtags (#BahiaFM #SurfRadio #ReggaeMusic)
- **Telegram**: Share via Telegram with description
- **Email**: Mailto with pre-filled subject and body
- **Copy Link**: Clipboard operation with user feedback
- **Instagram**: Opens Instagram app for manual sharing

### Share Button Features
- Click-outside-to-close dropdown
- Escape key support for accessibility
- Mobile-responsive design
- Success/error feedback messages
- Smooth animations and transitions

### User Interface Controls

### Audio Controls
| Control | Action | Location | Keyboard Shortcut |
|---------|--------|----------|-------------------|
| **Logo Click** | Play/Pause toggle | Center player area | `Space` |
| **Volume Slider** | Adjust volume (0-100%) | Below logo | `↑` `↓` arrows |
| **Mute Button** | Toggle mute with visual feedback | Left of volume slider | `M` |
| **Volume Percentage** | Live volume display with color coding | Below volume slider | - |

### Navigation Controls
| Control | Action | Location |
|---------|--------|----------|
| **Share Button** | Open 6-platform share dropdown | Top navigation |
| **Instagram Link** | Open official station Instagram | Top navigation |
| **Facebook Link** | Open official station Facebook | Top navigation |
| **Install Button** | Install PWA (when available) | Top navigation |
| **Theme Toggle** | Switch between OriginalColor/Secondary themes | Bottom right corner |
| **SurfFactory Button** | Open SurfFactory.pt partnership page | Bottom left corner |

### Keyboard Shortcuts
| Key | Action | Context |
|-----|--------|---------|
| `Space` | Play/Pause audio stream | Global |
| `M` | Toggle mute/unmute | Global |
| `↑` / `↓` | Increase/decrease volume by 10% | Global |
| `Escape` | Close share dropdown | When dropdown is open |

### Interactive Features
- **Click-outside-to-close**: Share dropdown automatically closes when clicking elsewhere
- **Touch-optimized**: All controls designed for mobile touch interaction
- **Visual feedback**: Hover states, active states, and loading indicators
- **Accessibility**: Full keyboard navigation and screen reader support

## Technical Implementation

### Core Technologies
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Audio**: HTML5 Audio API with streaming support
- **PWA**: Web App Manifest + Service Worker
- **Analytics**: Google Analytics GA4 with comprehensive event tracking
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Typography**: Google Fonts (Doto family)

### Analytics Implementation
- **GA4 Events**: 15+ tracked events covering complete user journey
- **User Segmentation**: PWA vs. browser user identification
- **Privacy-First**: Consent-based tracking, GDPR compliant with Cookiebot CMP
- **Event Helper**: Centralized `gaEvent()` function for consistent tracking
- **Platform Detection**: Automatic iOS/Android/desktop identification
- **Install State Tracking**: Real-time PWA installation status monitoring
- **Consent Integration**: Analytics only fire with proper user consent via Cookiebot

### Privacy & Consent Implementation
- **Cookiebot CMP**: Google-certified Consent Management Platform
- **Automatic Blocking**: `data-blockingmode="auto"` prevents cookies until consent
- **Google Consent Mode v2**: Seamless integration with GA4 analytics
- **IAB TCF 2.2**: Transparency & Consent Framework compliance
- **Granular Control**: Statistics, Marketing, Preferences categories
- **Legal Protection**: EU GDPR, CCPA, and international privacy law compliance
- **Consent Events**: `CookiebotOnAccept` integration for user property setting

### Scrolling Text System
- **JSON Configuration**: Dynamic loading of messages from `data/scrolling-text.json`
- **Independent Animation**: Each line has its own CSS animation cycle
- **Event-Driven**: Starts on first play button click, syncs with audio playback
- **Graceful Fallback**: Default message if JSON fails to load
- **CSS Custom Properties**: Configurable animation duration per line

### Performance Features
- **Caching Strategies**: Multiple service worker patterns
- **Responsive Images**: Optimized asset loading
- **Efficient DOM**: Minimal JavaScript footprint
- **Network Awareness**: Graceful degradation for poor connections

### Accessibility Features
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant contrast ratios
- **Semantic HTML**: Proper heading structure and landmarks

## Features Status

### ✅ Fully Implemented Features
- [x] **Live Audio Streaming**: Complete streaming with play/pause, volume, and mute controls
- [x] **Dual Theme System**: OriginalColor (colorful) and Secondary (minimalist) themes with localStorage persistence
- [x] **Advanced PWA Functionality**: Installation, offline support, shortcuts, and native app experience
- [x] **Service Worker v2.1.0**: Multi-strategy caching, automatic updates, and offline fallback
- [x] **Responsive Design**: Mobile-first approach optimized for all screen sizes and devices
- [x] **Social Media Integration**: Official Instagram and Facebook profile links
- [x] **6-Platform Share System**: WhatsApp, Twitter, Telegram, Email, Copy Link, Instagram sharing
- [x] **Google Analytics GA4**: Comprehensive event tracking with user segmentation and funnel analysis
- [x] **GDPR Compliance**: Full Cookiebot CMP integration with Google Consent Mode v2
- [x] **Privacy-First Analytics**: Consent-based tracking with automatic cookie blocking
- [x] **Advanced Scrolling Text**: 12 custom messages with JSON configuration and Web Animations API
- [x] **SurfFactory Partnership**: Dedicated external link button with tracking
- [x] **Professional Branding**: Complete favicon set, social share images, and typography
- [x] **SEO Optimization**: Meta tags, structured data, and social media previews
- [x] **Keyboard Shortcuts**: Full keyboard accessibility with Space, M, arrows, and Escape
- [x] **Media Session API**: Lock screen and notification controls for background playback
- [x] **Network Monitoring**: Online/offline detection with automatic reconnection
- [x] **Cross-Browser Compatibility**: Tested on Chrome, Firefox, Safari, and Edge
- [x] **Performance Optimization**: WebP images, preloading, and efficient asset management
- [x] **Accessibility Compliance**: ARIA labels, WCAG contrast ratios, and screen reader support
- [x] **Legal Compliance**: EU GDPR, CCPA, and international privacy law adherence

### 🚧 Planned Enhancements
- [ ] **Metadata Display**: Now playing track info and artist information from stream
- [ ] **Playback History**: Recently played tracks with timestamps
- [ ] **User Preferences**: Persistent settings for volume, theme, and audio quality
- [ ] **Audio Equalizer**: Custom 5-band equalizer with presets
- [ ] **Sleep Timer**: Auto-stop functionality with fade-out
- [ ] **Push Notifications**: Special show alerts and station updates
- [ ] **Advanced Analytics Dashboard**: Real-time user insights and stream metrics
- [ ] **Multi-Language Support**: Spanish, English, and other international languages
- [ ] **Podcast Integration**: Show schedule and on-demand content
- [ ] **Social Features**: User comments, favorites, and community integration
- [ ] **Stream Quality Options**: Multiple bitrate options for different connections
- [ ] **Chromecast Support**: Cast to smart TVs and speakers
- [ ] **Voice Commands**: Integration with Web Speech API
- [ ] **Gesture Controls**: Swipe controls for mobile devices

## Browser Support

| Browser | PWA Install | Audio Streaming | Share API | Overall Support |
|---------|-------------|-----------------|-----------|-----------------|
| **Chrome Desktop** | ✅ Full | ✅ Excellent | ✅ Native | ✅ Complete |
| **Chrome Mobile** | ✅ Full | ✅ Excellent | ✅ Native | ✅ Complete |
| **Edge** | ✅ Full | ✅ Excellent | ✅ Native | ✅ Complete |
| **Firefox Desktop** | ⚠️ Limited | ✅ Excellent | ❌ Fallback | ✅ Good |
| **Firefox Mobile** | ⚠️ Limited | ✅ Excellent | ❌ Fallback | ✅ Good |
| **Safari Desktop** | ⚠️ Limited | ✅ Good | ❌ Fallback | ✅ Good |
| **Safari Mobile** | ✅ Good | ✅ Good | ❌ Fallback | ✅ Good |

*Note: Fallback sharing uses custom dropdown with platform-specific URLs*

## Performance Optimizations

### Caching Strategy
- **Static Assets**: Cache-first strategy for images and fonts
- **Critical Assets**: Network-first for CSS, JS, and JSON data files
- **JSON Configuration**: Network-first with cache fallback for `scrolling-text.json`
- **Dynamic Content**: Network-first with cache fallback for HTML
- **Audio Stream**: Direct streaming without caching
- **Cache Versioning**: Automatic cache invalidation on updates

### Audio Optimization
- **Streaming Protocol**: Direct HTTP streaming
- **Buffer Management**: Efficient memory usage
- **Error Recovery**: Automatic reconnection on network issues
- **Cross-browser Compatibility**: Fallback audio formats

### Mobile Performance
- **Responsive Images**: Optimized asset sizes
- **Touch Interactions**: Native mobile gestures
- **Viewport Optimization**: Proper mobile scaling
- **Battery Efficiency**: Optimized for mobile battery life

## Deployment

### Static Hosting (Recommended)
Deploy to any HTTPS-enabled static hosting service. No build process required:

```bash
# GitHub Pages (automatic deployment)
git push origin main

# Netlify (drag & drop or Git integration)
netlify deploy --prod --dir .

# Vercel (Git integration)
vercel --prod

# Firebase Hosting
firebase deploy

# Local development server
python -m http.server 8000
# or
npx serve . -p 8000
```

### HTTPS Requirement
- **PWA Features**: Require HTTPS in production (service worker, installation)
- **Audio Streaming**: Works on HTTP but HTTPS recommended for CORS
- **Share API**: Native Web Share API requires HTTPS
- **Geolocation**: Location-based features need HTTPS
- **Clipboard API**: Copy functionality requires secure context

### Environment Configuration
This is a vanilla JavaScript PWA with no build step required:

1. **Upload Files**: All files to your hosting provider
2. **Enable HTTPS**: Required for PWA functionality
3. **Update Manifest**: Change `start_url` and `scope` in `manifest.json` to match your domain
4. **Configure Analytics**: Update GA4 measurement ID if using your own
5. **Test Installation**: Verify PWA installation prompt appears
6. **Audio Testing**: Confirm stream URL accessibility from your domain

## Contributing

### Development Setup
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Serve** locally using Python or Node.js
4. **Test** changes across different browsers
5. **Submit** pull request with detailed description

### Code Style Guidelines
- Follow the existing code formatting
- Use semantic HTML5 elements
- Maintain CSS organization (variables, mobile-first)
- Add comments for complex JavaScript logic
- Test accessibility features

### Testing Checklist
- [ ] Audio stream plays correctly across browsers
- [ ] PWA installation works on mobile and desktop
- [ ] Service worker caches resources properly
- [ ] Share functionality works on all platforms
- [ ] Responsive design looks good on all screen sizes
- [ ] Keyboard shortcuts function correctly
- [ ] Accessibility features work with screen readers

## Troubleshooting

### Common Issues

**Audio not playing:**
- Check network connectivity and stream URL accessibility
- Verify browser supports audio streaming (test with `test.html`)
- Look for CORS issues in browser console
- Confirm autoplay policies aren't blocking playback
- Test with different browsers (Chrome, Firefox, Safari)

**PWA not installing:**
- Ensure HTTPS is enabled (required for service worker registration)
- Check `manifest.json` is valid using browser DevTools > Application
- Verify service worker is registered in DevTools > Application > Service Workers
- Clear browser cache and reload page
- Test installation criteria: manifest + service worker + HTTPS

**Share functionality not working:**
- Modern browsers: Native Web Share API used when available
- Fallback: Custom dropdown with platform-specific URLs works offline
- Check browser console for JavaScript errors
- Verify clipboard permissions for copy functionality
- Test different sharing methods individually

**Theme switching issues:**
- Check localStorage permissions in browser
- Verify theme toggle button is visible (bottom-right corner)
- Clear browser storage and refresh
- Look for CSS loading issues in Network tab

**Scrolling text not appearing:**
- Check if `data/scrolling-text.json` loads successfully
- Verify network access to JSON file (check Network tab)
- Test with fallback messages if JSON fails
- Confirm scrolling starts after first audio play

**Performance issues:**
- Clear browser cache and service worker cache
- Check service worker status in DevTools > Application
- Verify network connection speed and stream accessibility
- Test with different audio quality settings
- Monitor memory usage for long listening sessions

**Privacy/Analytics issues:**
- Check if Cookiebot consent banner appears on first visit
- Verify GA4 events fire only after consent in GA4 DebugView
- Ensure `analytics_storage` shows correct granted/denied status
- Test consent acceptance/rejection in incognito mode
- Check browser console for Cookiebot or gtag errors
- Verify GDPR compliance for EU users

## License

MIT License - feel free to customize and adapt for your own radio station projects.

## Project Information

- **Station**: Bahia FM - Radio Musical para amantes del Surf, el Skate, la Playa y los Deportes extremos
- **Live Stream**: https://sonic2.sistemahost.es/8110/stream (24/7 streaming)
- **Analytics**: Google Analytics GA4 (G-4BFB1KMVW1) with comprehensive event tracking and GDPR compliance
- **Privacy**: Cookiebot CMP (fdc0ecbc-3104-4661-8edd-2e8ec43217a5) for EU GDPR compliance
- **Social Media**: 
  - Instagram: [@bahiasurfersdab](https://www.instagram.com/bahiasurfersdab) (Official station profile)
  - Facebook: [Vicente Alfredo Colmenares](https://www.facebook.com/vicentealfredo.colmenarescanellas/) (Station manager)
- **Partnership**: [SurfFactory.pt](https://www.surfactory.pt/) (Surf equipment and culture partner)
- **Repository**: [MiguelDiLalla/BAHIA_fm](https://github.com/MiguelDiLalla/BAHIA_fm)
- **Technology Stack**: Vanilla HTML5, CSS3, JavaScript ES6+, PWA, Service Worker v2.1.0
- **Current Version**: 2.1.0 (January 2025) - Full theme system and advanced analytics integration

## Support & Contact

For technical issues or questions:
- **Check Browser Console**: Look for error messages and warnings (F12 > Console)
- **Test Stream URL**: Use `test.html` for direct stream debugging and metadata testing
- **Verify Network**: Confirm internet connectivity and stream accessibility
- **PWA Installation**: Check DevTools > Application > Manifest and Service Workers
- **Analytics Testing**: Use GA4 DebugView to verify event tracking
- **GDPR Compliance**: Test consent banner in incognito mode
- **Theme Issues**: Clear localStorage and cache, test theme toggle functionality
- **Performance**: Monitor Network and Performance tabs in DevTools

**Debug Tools Included:**
- `test.html`: Stream testing page with metadata debugging
- `test.ipynb`: Jupyter notebook for development testing
- Browser DevTools: Complete PWA, analytics, and performance debugging
- GA4 DebugView: Real-time event tracking verification

## Acknowledgments

- **Google Fonts**: Doto font family for modern typography and professional appearance
- **Font Awesome**: Icon library for consistent UI elements and social media icons
- **Google Analytics GA4**: Advanced event tracking and user behavior analytics platform
- **Cookiebot**: Google-certified Consent Management Platform for GDPR compliance
- **SurfFactory.pt**: Official partnership for surf culture and equipment
- **Web APIs**: Media Session, Web Share, Clipboard, Service Worker, and Web App Manifest
- **Progressive Web App**: Following Google's PWA best practices and guidelines
- **Accessibility Standards**: WCAG 2.1 compliance for inclusive design
- **Performance Optimization**: Core Web Vitals and lighthouse recommendations
- **Privacy Engineering**: Privacy-by-design principles and European data protection

---

**Made with ❤️ for surf and skate music lovers worldwide** 🏄‍♂️🛹🎵

*This PWA brings Bahia FM's reggae, surf rock, and skate culture music directly to your device with professional-grade streaming, comprehensive analytics, and rock-solid privacy compliance.*
