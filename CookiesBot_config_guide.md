## Implementación de Cookiebot + Google Consent Mode v2 para Bahia FM PWA

> Este documento describe **paso a paso** cómo integrar Cookiebot (plan Free) con tu sitio vanilla (sin GTM) y garantizar el cumplimiento de RGPD / IAB TCF 2.2 mientras se mantienen las métricas de GA4.

---

### 1 · Insertar el script de Cookiebot

Pega **este script** como **PRIMERA línea** dentro de `<head>` (debe ir **antes** de cualquier otra etiqueta `<script>` que pueda colocar cookies):

```html
<!-- Cookiebot CMP (Google‑certified) -->
<script id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="fdc0ecbc-3104-4661-8edd-2e8ec43217a5"
        data-blockingmode="auto"
        type="text/javascript"></script>
<!-- End Cookiebot -->
```

*`data-blockingmode="auto"`* habilita el **bloqueo automático**: Cookiebot detecta patrones de GA4/Ads y detiene cookies hasta que el usuario otorgue consentimiento.

---

### 2 · Mover tu snippet de GA4 **después** de Cookiebot

Coloca tu `gtag.js` **justo debajo** del script de Cookiebot:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G‑XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  /* No establezcas consent aquí – Cookiebot lo gestionará */
  gtag('config', 'G‑XXXXXXX', { send_page_view: false });
</script>
<!-- End GA4 -->
```

> **Importante:** elimina cualquier llamada manual a:
>
> ```js
> gtag('consent', 'default' … )
> gtag('consent', 'update'  … )
> ```
>
> porque Cookiebot enviará automáticamente las señales `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` según la elección del usuario.

---

### 3 · Ajustar tu lógica de eventos GA4

1. **Mantén** tu helper `gaEvent(name, params)` en `app.js` – no cambia.
2. **Instalación PWA / propiedades de usuario**

   * Puedes seguir llamando:

     ```js
     gtag('set', 'user_properties', { install_state: isAppInstalled() ? 'installed' : 'browser' });
     ```
   * Coloca esta línea **después** de que Cookiebot haya terminado de cargar (para asegurarte de que exista la categoría *statistics*).
   * Opción recomendada:

     ```js
     window.addEventListener('CookiebotOnAccept', () => {
       if (Cookiebot.consent.statistics) {
         gtag('set', 'user_properties', { install_state: isAppInstalled() ? 'installed' : 'browser' });
       }
     });
     ```

---

### 4 · Personalizar el banner desde el panel Cookiebot

1. **Dominios y Plan:** ya añadiste tu dominio y usas *Plan Free* (≤ 50 000 páginas vistas/mes).
2. **Diseño:** en **Cookies → Content → Dialog** elige idioma (es/en), posición, colores.
3. **Categorías:** asegúrate de mantener activadas (*Statistics*, *Marketing*, *Preferences*) para granularidad.
4. **Google Consent Mode v2** ya viene activado por defecto – verifica en **Settings → Integrations → Google**.

---

### 5 · Verificar que la señal llega a GA4

1. Abre la web en **modo incógnito** (sin extensiones).
2. Rechaza todas las cookies → abre **GA4 › Admin › DebugView**: los eventos deberían registrar `analytics_storage=denied`.
3. Acepta solo “Statistics” → refresca → los eventos ahora muestran `analytics_storage=granted`.
4. En **Admin › Data Streams › Consent settings** verás los cuatro campos con estado `granted/denied`.

---

### 6 · Limpieza de código heredado

* Borra el banner casero de cookies y su CSS.
* Elimina llamadas manuales a `gtag('consent', …)`.
* Si llegaste a etiquetar scripts como `type="text/plain" cookieconsent="statistics"`, ya no es necesario con *blockingmode auto* – puedes dejarlos o retirarlos.

---

## Checklist final

* [ ] Script Cookiebot como *primero* en `<head>`.
* [ ] Snippet GA4 justo debajo; sin llamadas manuales de consent.
* [ ] Callback `CookiebotOnAccept` opcional para `install_state`.
* [ ] Banner configurado (texto, idiomas, categorías).
* [ ] Pruebas en **DebugView** y **Consent settings** correctas.

¡Listo! Tienes Consent Mode v2 operativo con un CMP certificado y GA4 continuará midiendo a tus oyentes de forma legal y fiable.
