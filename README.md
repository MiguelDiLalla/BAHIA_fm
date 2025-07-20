# Bahia FM PWA

A Progressive Web App for streaming Bahia FM - Radio Musical para amantes del Surf, el Skate, la Playa y los Deportes extremos. Your favorite reggae and surf music station available 24/7.

## Features

### 🎵 Audio Streaming
- Live radio stream from `https://sonic2.sistemahost.es/8110/stream`
- Click-to-play logo control with visual feedback
- Volume slider with percentage display
- Mute/unmute functionality with emoji indicators
- Background audio streaming capability

### 📱 Progressive Web App
- Installable on mobile and desktop devices
- Offline-capable with smart caching strategies
- Responsive design optimized for all screen sizes
- Native app-like experience with custom manifest
- Service worker for enhanced performance

### 🎨 Modern UI Design
- Clean, minimalist design with Doto font family
- **Dynamic Scrolling Text Strip**: JSON-configurable messaging system
  - Multiple independent scrolling lines
  - Starts when user first presses play
  - Pause/resume with audio playback
  - Easily customizable via `data/scrolling-text.json`
- Smooth CSS transitions and hover effects
- Mobile-first responsive layout
- Dark theme with professional aesthetics

### 🚀 Social Integration
- **Share Functionality**: Comprehensive sharing dropdown with 6 platforms
  - 📱 WhatsApp direct sharing
  - 🐦 Twitter with hashtags and station info
  - ✈️ Telegram messaging
  - 📧 Email with pre-filled content
  - 🔗 Copy link to clipboard
  - 📷 Instagram sharing capability
- Social media links to Instagram and Facebook
- Optimized meta tags for social media previews

### 📊 Analytics & Tracking
- **Google Analytics GA4**: Comprehensive event tracking system
  - **User Segmentation**: Automatic detection of PWA vs. browser users
  - **Audio Lifecycle**: Complete playback tracking (play, pause, resume, buffer events)
  - **Sharing Analytics**: Platform-specific share interaction tracking
  - **PWA Funnel**: Installation prompt, acceptance, and completion tracking
  - **Social Outbound**: Track clicks to official social media profiles
  - **User Engagement**: Volume changes, mute interactions, and session metrics
- **Privacy-First**: No tracking cookies, GDPR-compliant implementation
- **Real-time Insights**: Stream performance and user behavior analytics

### 🔒 Privacy & Consent Management
- **GDPR Compliance**: Full European privacy regulation compliance
- **Cookiebot Integration**: Google-certified Consent Management Platform (CMP)
  - Automatic cookie blocking with `data-blockingmode="auto"`
  - IAB TCF 2.2 (Transparency & Consent Framework) compatible
  - Google Consent Mode v2 integration
- **Consent Categories**: Statistics, Marketing, Preferences granular control
- **Privacy-First Analytics**: Analytics only fire with proper user consent
- **No Tracking Cookies**: All analytics anonymous and consent-based
- **Cookie Banner**: Professional, customizable consent interface
- **Legal Compliance**: Automatic consent signal handling for all services

### ⚡ Performance & Accessibility
- Service worker with multiple caching strategies
- Optimized for low bandwidth connections
- Fast loading times with efficient asset management
- ARIA labels and keyboard navigation support
- Mobile-responsive share dropdown

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
├── index.html          # Main application with audio player and navigation
├── style.css           # Comprehensive styles with responsive design
├── app.js              # Audio controls, PWA logic, share functionality, and GA4 analytics
├── manifest.json       # Web App Manifest for PWA installation
├── sw.js              # Service Worker for caching and offline support
├── package.json        # Project metadata and dependencies
├── Gtag_config_guide.md # GA4 analytics implementation specification
├── data/              # Configuration and content data
│   └── scrolling-text.json  # Scrolling text messages and settings
├── assets/            # Media assets and branding
│   ├── logo.png       # Main station logo
│   ├── logo.svg       # Scalable vector logo
│   ├── social-share-image.jpg  # Social media preview image
│   └── favicon/       # Complete favicon set for all platforms
│       ├── favicon.ico
│       ├── android-chrome-*.png
│       ├── apple-touch-icon.png
│       └── favicon-*.png
└── .github/           # GitHub configuration and workflow
    └── copilot-instructions.md
```

## Configuration

### Scrolling Text Customization

The scrolling text strip can be easily customized by editing `data/scrolling-text.json`:

```json
{
  "messages": [
    "Radio Musical para amantes del Surf, el Skate, la Playa y los Deportes extremos.",
    "🌊 Conecta con las mejores vibes del océano y la cultura surf 🏄‍♂️",
    "🎵 Reggae, Chill, Surf Rock y más sonidos para tu lifestyle 🎶",
    "🏖️ La banda sonora perfecta para tus sesiones de surf y skate 🛹",
    "📻 Bahia FM - Donde la música y el océano se encuentran 🌊"
  ],
  "settings": {
    "animationDuration": "30s",
    "animationDelay": "2s",
    "scrollDirection": "left"
  }
}
```

**Features:**
- **Independent Lines**: Each message scrolls on its own timeline
- **Staggered Start**: Lines begin 2 seconds apart after first play
- **Play/Pause Integration**: Scrolling pauses when audio is paused
- **Easy Updates**: Just edit the JSON file to change messages
- **Customizable Timing**: Adjust duration and delays via settings
- **Cache Management**: Automatic refresh of content on page reload

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

## User Interface Controls

### Audio Controls
| Control | Action | Location |
|---------|--------|----------|
| **Logo Click** | Play/Pause | Center player area |
| **Volume Slider** | Adjust volume (0-100%) | Below logo |
| **Mute Button** | Toggle mute (🔈/🔇) | Left of volume slider |

### Navigation Controls
| Control | Action | Location |
|---------|--------|----------|
| **Share Button** | Open share dropdown | Top navigation |
| **Instagram Link** | Open station Instagram | Top navigation |
| **Facebook Link** | Open station Facebook | Top navigation |
| **Install Button** | Install PWA | Top navigation (when available) |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Play/Pause audio stream |
| `M` | Toggle mute/unmute |
| `Escape` | Close share dropdown |

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

### ✅ Implemented Features
- [x] Live audio streaming with play/pause controls
- [x] Volume control with mute functionality  
- [x] PWA installation capability
- [x] Service worker caching and offline support
- [x] Responsive design for all devices
- [x] Social media integration (Instagram, Facebook)
- [x] **Comprehensive share functionality** (6 platforms)
- [x] **Google Analytics GA4** with comprehensive event tracking
- [x] **User segmentation** (PWA vs. browser users)
- [x] **Audio lifecycle tracking** (play, pause, buffer, volume events)
- [x] **Sharing and social analytics** (platform-specific tracking)
- [x] **PWA installation funnel** tracking
- [x] **GDPR Compliance** with Cookiebot Consent Management Platform
- [x] **Privacy-First Analytics** (consent-based, no tracking cookies)
- [x] **Google Consent Mode v2** integration
- [x] **IAB TCF 2.2** Transparency & Consent Framework compatibility
- [x] **Automatic Cookie Blocking** until user consent
- [x] Animated scrolling text banner with JSON configuration
- [x] Professional branding and typography
- [x] Complete favicon set for all platforms
- [x] SEO and social media meta tags
- [x] Keyboard shortcuts and accessibility features
- [x] Legal compliance for EU GDPR and international privacy laws

### 🚧 Planned Enhancements
- [ ] Now playing metadata display (track info, artist)
- [ ] Recently played tracks history
- [ ] User preferences storage (volume, theme)
- [ ] Custom audio equalizer
- [ ] Sleep timer functionality
- [ ] Push notifications for special shows
- [ ] Advanced analytics dashboards and user insights
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Podcast/show schedule integration

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
Deploy to any HTTPS-enabled static hosting service:

```bash
# GitHub Pages (automatic deployment)
git push origin main

# Netlify (drag & drop or Git integration)
netlify deploy --prod --dir .

# Vercel (Git integration)
vercel --prod

# Firebase Hosting
firebase deploy
```

### HTTPS Requirement
- **PWA Features**: Require HTTPS in production
- **Audio Streaming**: Works on HTTP but HTTPS recommended
- **Service Worker**: Requires HTTPS (except localhost)
- **Share API**: Native sharing requires HTTPS

### Environment Configuration
No build process required - this is a vanilla JavaScript PWA:
1. Upload all files to your hosting provider
2. Ensure HTTPS is enabled
3. Update manifest.json with your domain
4. Test PWA installation and audio streaming

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
- Check network connectivity and stream URL
- Verify browser supports audio streaming
- Look for CORS issues in browser console

**PWA not installing:**
- Ensure HTTPS is enabled (required for PWA)
- Check manifest.json is valid
- Verify service worker is registered

**Share not working:**
- Modern browsers: Native Web Share API used when available
- Fallback: Custom dropdown with platform-specific URLs
- Check console for any JavaScript errors

**Performance issues:**
- Clear browser cache and reload
- Check service worker cache in DevTools
- Verify network connection speed

**Privacy/Analytics issues:**
- Check if Cookiebot consent banner appears correctly
- Verify GA4 events fire only after consent in DebugView
- Ensure `analytics_storage` shows correct granted/denied status
- Test consent acceptance/rejection in incognito mode
- Check browser console for Cookiebot or gtag errors

## License

MIT License - feel free to customize and adapt for your own radio station projects.

## Project Information

- **Station**: Bahia FM - Radio Musical para amantes del Surf, el Skate, la Playa y los Deportes extremos
- **Stream URL**: https://sonic2.sistemahost.es/8110/stream
- **Analytics**: Google Analytics GA4 (G-4BFB1KMVW1) with comprehensive event tracking
- **Social Media**: 
  - Instagram: [@bahiasurfersdab](https://www.instagram.com/bahiasurfersdab)
  - Facebook: [Vicente Alfredo Colmenares](https://www.facebook.com/vicentealfredo.colmenarescanellas/)
- **Repository**: [MiguelDiLalla/BAHIA_fm](https://github.com/MiguelDiLalla/BAHIA_fm)

## Support & Contact

For technical issues or questions:
- **Check browser console** for error messages
- **Verify network connectivity** for streaming issues  
- **Test in different browsers** to isolate problems
- **Check service worker registration** in DevTools
- **Review PWA installation requirements** (HTTPS, manifest)

## Acknowledgments

- **Google Fonts**: Doto font family for typography
- **SVG Icons**: Custom social media and UI icons
- **Progressive Web App**: Following modern PWA best practices
- **Accessibility**: WCAG guidelines compliance
- **Performance**: Optimized for mobile and desktop experience

---

**Made with ❤️ for surf and skate music lovers** 🏄‍♂️🛹🎵

*This PWA brings Bahia FM's reggae and surf music directly to your device with professional-grade streaming and social sharing capabilities.*
