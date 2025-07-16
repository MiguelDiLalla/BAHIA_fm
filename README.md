# Surfers Bahia FM PWA

A Progressive Web App for streaming Surfers Bahia FM - your favorite reggae and surf music station available 24/7.

## Features

### 🎵 Audio Streaming
- Live radio stream from high-quality audio source
- Play/pause controls with visual feedback
- Volume control with mute functionality
- Keyboard shortcuts for quick access

### 📱 Progressive Web App
- Installable on mobile and desktop devices
- Offline-capable with smart caching
- Responsive design for all screen sizes
- Native app-like experience

### 🎨 Modern UI
- Clean, minimalist design
- Animated logo when playing
- Smooth transitions and hover effects
- Mobile-first responsive layout

### ⚡ Performance
- Service worker for efficient caching
- Background audio streaming
- Optimized for low bandwidth
- Fast loading times

## Quick Start

1. **Clone or download** this repository
2. **Open** `index.html` in a web browser
3. **Click** the logo to start playing
4. **Install** the PWA by clicking the install prompt

## File Structure

```
reggae-surf-radio/
├── index.html          # Main application page
├── style.css           # Global styles and responsive design
├── app.js              # Audio controls and PWA logic
├── manifest.json       # Web App Manifest for PWA
├── sw.js              # Service Worker for caching
├── assets/            # Images and media assets
│   └── logo.png       # Station logo (placeholder)
└── .github/           # GitHub configuration
    └── copilot-instructions.md
```

## Development

### Local Development
```bash
# Serve the files using any static server
# For example, using Python:
python -m http.server 8000

# Or using Node.js:
npx serve .

# Or using Live Server extension in VS Code
```

### PWA Testing
- Use Chrome DevTools > Application > Service Workers
- Test installation with DevTools > Application > Manifest
- Verify offline functionality by toggling network in DevTools

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support with minor limitations
- Mobile browsers: Optimized for mobile use

## Customization

### Stream Configuration
Edit `app.js` to change the stream URL:
```javascript
const CONFIG = {
    streamUrl: 'https://your-stream-url.com/stream',
    stationName: 'Your Station Name',
    defaultVolume: 0.7
};
```

### Visual Customization
- Replace `assets/logo.png` with your station logo
- Modify colors in `style.css` CSS custom properties
- Update station name and branding in `index.html`

### PWA Settings
Update `manifest.json` for your station:
```json
{
  "name": "Your Station Name",
  "short_name": "Station",
  "theme_color": "#your-color",
  "background_color": "#your-bg-color"
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `M` | Mute/Unmute |
| `↑` | Volume Up |
| `↓` | Volume Down |

## Features in Development

### Core Features
- [x] Audio streaming with controls
- [x] PWA installation
- [x] Service worker caching
- [x] Responsive design
- [x] Keyboard shortcuts

### Planned Features
- [ ] Now playing metadata display
- [ ] Playlist/history functionality
- [ ] Social sharing capabilities
- [ ] User preferences storage
- [ ] Custom equalizer
- [ ] Sleep timer
- [ ] Push notifications
- [ ] Analytics tracking

## Browser Support

| Browser | Support Level |
|---------|---------------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

## Performance Optimizations

### Caching Strategy
- **Static Assets**: Cache first strategy
- **Dynamic Content**: Network first with fallback
- **API Calls**: Stale while revalidate

### Audio Optimization
- Streaming without download
- Efficient buffer management
- Network-aware quality adjustment

## Deployment

### Static Hosting
Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### HTTPS Requirement
PWA features require HTTPS in production. Most hosting services provide this automatically.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to customize for your own radio station.

## Support

For issues or questions:
- Check the browser console for error messages
- Verify network connectivity for streaming
- Test in different browsers
- Check service worker registration

---

**Note**: This is a template/starter project. Replace placeholder content with your actual station branding and information.
