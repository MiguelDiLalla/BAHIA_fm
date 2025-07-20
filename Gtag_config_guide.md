## Analytics Implementation Plan for Bahia FM PWA

This document outlines the **GA4 event tracking** requirements for the Bahia FM Progressive Web App. It provides a clear, professional specification for your implementation in JavaScript (app.js), following GA4 best practices.

---

### 1. Session Start by PWA vs. Browser Users

**Goal:** Distinguish between sessions started by users who have installed the PWA and those using a regular browser.

1. **Detect install state** (reuse existing `isAppInstalled()`):

   ```js
   function isAppInstalled() {
     return (
       window.matchMedia('(display-mode: standalone)').matches ||
       window.navigator.standalone === true ||
       document.referrer.startsWith('android-app://')
     );
   }
   ```

2. **Set GA4 user property** immediately after `gtag('config', ...)` in `index.html`:

   ```js
   gtag('set', 'user_properties', {
     install_state: isAppInstalled() ? 'installed' : 'browser'
   });
   ```

3. **Fire manual `page_view`** in `init()` of app.js with install\_state parameter (session-scoped custom dimension):

   ```js
   gaEvent('page_view', {
     page_location: location.href,
     page_title: document.title,
     install_state: isAppInstalled() ? 'installed' : 'browser'
   });
   ```

4. **GA4 Admin:**

   * Create a **user-scoped** custom dimension `install_state` (for user\_properties) or session-scoped `install_state` (for event param).

---

### 2. Playback Lifecycle Events

Capture every key phase of the audio stream:

| Phase         | Event Name             | Parameters                                        | Hook / Location                                                  |
| ------------- | ---------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| Stream start  | `stream_play`          | `{ station: CONFIG.stationName, autoplay }`       | After `audio.play()` resolves                                    |
| Pause         | `stream_pause`         | `{ position_sec: Math.round(audio.currentTime) }` | Inside `audio.addEventListener('pause', …)`                      |
| Resume        | `stream_resume`        | `{ position_sec }`                                | On `audio.addEventListener('playing', …)` if resumed             |
| Stream end    | `stream_end`           | `{ duration_sec: Math.round(audio.duration) }`    | On `audio.addEventListener('ended', …)` (if using recorded show) |
| Buffer start  | `buffer_start`         | `{ position_sec }`                                | On `audio.addEventListener('waiting', …)`                        |
| Buffer end    | `buffer_end`           | `{ position_sec }`                                | On `audio.addEventListener('playing', …)` following wait         |
| Volume change | `volume_change`        | `{ volume_level: audio.volume }`                  | In `handleVolumeChange()`                                        |
| Mute / Unmute | `mute_on` / `mute_off` | `{}`                                              | In `toggleMute()`                                                |

> **Implementation:** Call `gaEvent(name, params)` helper at each hook.

---

### 3. Sharing Interactions

Track every sharing mechanism to measure viral growth:

| Interaction        | Event Name            | Parameters | Hook / Location                  |
| ------------------ | --------------------- | ---------- | -------------------------------- |
| Open share menu    | `share_dropdown_open` | `{}`       | In `toggleShareDropdown()`       |
| Click WhatsApp     | `share_whatsapp`      | `{}`       | Case `shareType === 'whatsapp'`  |
| Click Twitter      | `share_twitter`       | `{}`       | Case `shareType === 'twitter'`   |
| Click Telegram     | `share_telegram`      | `{}`       | Case `shareType === 'telegram'`  |
| Click Email        | `share_email`         | `{}`       | Case `shareType === 'email'`     |
| Copy Link          | `share_copy`          | `{}`       | Case `shareType === 'copy'`      |
| Copy for Instagram | `share_instagram`     | `{}`       | Case `shareType === 'instagram'` |

> **Note:** Use distinct event names (not a single `share_click`), to analyze platform-specific performance.

---

### 4. Social Media Visits

Capture outbound clicks to official social profiles:

| Platform       | Event Name           | Parameters      | Hook / Location                      |
| -------------- | -------------------- | --------------- | ------------------------------------ |
| Instagram link | `outbound_instagram` | `{ url: href }` | In `<a>` click handler for Instagram |
| Facebook link  | `outbound_facebook`  | `{ url: href }` | In `<a>` click handler for Facebook  |

**Implementation:** Add click listeners:

```js
const instagramLink = document.querySelector('a[href*="instagram.com"]');
instagramLink.addEventListener('click', () => gaEvent('outbound_instagram', { url: instagramLink.href }));
// Repeat for Facebook
```

---

### 5. PWA Installation Events

Monitor the end-to-end install funnel:

| Step                    | Event Name            | Parameters              | Hook / Location                                     |               |                                              |
| ----------------------- | --------------------- | ----------------------- | --------------------------------------------------- | ------------- | -------------------------------------------- |
| Prompt shown            | `pwa_prompt_shown`    | `{}`                    | In `window.addEventListener('beforeinstallprompt')` |               |                                              |
| Prompt accepted         | `pwa_install_accept`  | `{}`                    | On `choiceResult.outcome === 'accepted'`            |               |                                              |
| Prompt dismissed        | `pwa_install_dismiss` | `{}`                    | On `choiceResult.outcome === 'dismissed'`           |               |                                              |
| App installed (success) | `pwa_install_success` | \`{ platform: 'android' | 'ios'                                               | 'desktop' }\` | In `window.addEventListener('appinstalled')` |

> **Implementation:** Insert `gaEvent(...)` calls in the existing PWA install handlers.

---

## Helper & Setup Reminder

1. **gaEvent helper** in `app.js`:

   ```js
   function gaEvent(name, params = {}) {
     if (typeof gtag === 'function') {
       gtag('event', name, params);
     }
   }
   ```

2. **Load gtag snippet** in `index.html` before `app.js`:

   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}  
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXX', { send_page_view: false });
   </script>
   ```

3. **GA4 Admin:**

   * Ensure Measurement ID matches.
   * Configure **custom dimensions** for any custom params (e.g., `install_state`).

---

*This specification will guide your Copilot implementation. Adjust parameter names or hooks as needed, but maintain consistency across events for accurate reporting.*
