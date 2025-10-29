# PWA Setup & Installation

Die App ist jetzt eine vollständige Progressive Web App (PWA)!

## ✅ Was wurde implementiert

### 1. **PWA Manifest** (`public/manifest.json`)
- App-Name und -Beschreibung
- Icons (192x192, 512x512)
- Display-Modus: `standalone` (App-ähnlich)
- Theme-Color: `#3b82f6` (Blue)
- Orientation: `portrait-primary`

### 2. **Service Worker** (Auto-generiert von Vite PWA Plugin)
- Automatisches Caching aller Assets
- Offline-Funktionalität
- Auto-Update bei neuen Versionen
- Network-First für Supabase API-Calls

### 3. **Install-Prompt** (`src/components/PWAInstallPrompt.jsx`)
- Native Install-Banner
- "Später" Option (7 Tage Pause)
- Schönes Design mit Animation
- Responsive für Mobile & Desktop

### 4. **App Icons**
Die Icons müssen noch generiert werden. Zwei Optionen:

#### Option A: Manuell erstellen
1. Erstelle Icons in 192x192 und 512x512 px
2. Speichere sie als `icon-192.png` und `icon-512.png` in `/public`
3. Verwende das SVG in `public/icon.svg` als Vorlage

#### Option B: Online Generator verwenden
1. Gehe zu [realfavicongenerator.net](https://realfavicongenerator.net)
2. Lade `public/icon.svg` hoch
3. Generiere PWA Icons
4. Lade herunter und kopiere nach `/public`

## 📱 PWA Features

### Offline-Funktionalität
- ✅ App läuft offline
- ✅ Gecachte Nachrichten sichtbar
- ⚠️ Neue Nachrichten nur bei Verbindung

### App-ähnliches Erlebnis
- ✅ Kein Browser-UI (Standalone Mode)
- ✅ Eigenes Icon im App-Drawer
- ✅ Splash-Screen beim Start
- ✅ System-Theme-Color

### Auto-Update
- ✅ Neue Versionen werden automatisch erkannt
- ✅ Update im Hintergrund
- ✅ Reload bei nächstem Start

## 🚀 Installation testen

### Desktop (Chrome/Edge)
1. Starte die App: `npm run dev`
2. Öffne in Chrome: `http://localhost:5173`
3. Schaue in die Adressleiste: Install-Icon (+)
4. Klicke "Installieren"
5. App öffnet sich in eigenem Fenster

### Mobile (Android)
1. Deploye die App (siehe unten)
2. Öffne in Chrome auf Android
3. Banner "Zum Startbildschirm hinzufügen" erscheint
4. Oder: Menü → "App installieren"
5. Icon erscheint auf Home-Screen

### Mobile (iOS/Safari)
1. Deploye die App
2. Öffne in Safari auf iOS
3. Tippe auf Teilen-Button
4. "Zum Home-Bildschirm"
5. Icon erscheint auf Home-Screen

⚠️ **Wichtig**: PWAs funktionieren nur über HTTPS (oder localhost)!

## 📦 Deployment

### Option 1: Vercel (Empfohlen)
```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option 3: GitHub Pages
1. In `vite.config.js` base hinzufügen:
   ```js
   export default defineConfig({
     base: '/repo-name/',
     // ...
   })
   ```
2. Build: `npm run build`
3. Deploy `dist` Ordner zu gh-pages

### Option 4: Eigener Server
1. Build: `npm run build`
2. Uploade `dist` Ordner
3. Stelle sicher, dass HTTPS aktiv ist
4. Konfiguriere Server für SPA (alle Requests → index.html)

## 🧪 PWA Testen

### Chrome DevTools
1. Öffne DevTools (F12)
2. Gehe zu "Application" Tab
3. Prüfe:
   - **Manifest**: Zeigt alle Manifest-Daten
   - **Service Workers**: Zeigt Status
   - **Storage**: Zeigt Cache

### Lighthouse Audit
1. Öffne DevTools (F12)
2. Gehe zu "Lighthouse" Tab
3. Wähle "Progressive Web App"
4. Klicke "Analyze page load"
5. Ziel: 100 Score! 🎯

### PWA Builder
1. Gehe zu [pwabuilder.com](https://www.pwabuilder.com)
2. Gib deine URL ein
3. Prüfe Manifest Score
4. Teste Service Worker
5. Optional: Generiere App-Store Packages

## ⚙️ Konfiguration

### Cache-Strategien (in `vite.config.js`)

**NetworkFirst** (Standard für Supabase):
```js
{
  urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
  handler: 'NetworkFirst', // Versuche erst Netzwerk, dann Cache
}
```

**CacheFirst** (für Assets):
```js
{
  urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
  handler: 'CacheFirst', // Nimm aus Cache, wenn verfügbar
}
```

**StaleWhileRevalidate** (für häufige Updates):
```js
{
  handler: 'StaleWhileRevalidate', // Zeige Cache, update im Hintergrund
}
```

## 🔧 Debugging

### Service Worker neu laden
1. Chrome DevTools → Application → Service Workers
2. Klicke "Unregister"
3. Reload Page (Ctrl+Shift+R)

### Cache löschen
1. Chrome DevTools → Application → Storage
2. Klicke "Clear site data"

### Update erzwingen
```js
// In Browser Console:
navigator.serviceWorker.getRegistration().then(reg => reg.update())
```

## 📋 Checklist für Produktion

- [ ] Icons generiert (192x192, 512x512)
- [ ] Supabase URL & Key konfiguriert
- [ ] Build erstellt: `npm run build`
- [ ] Auf HTTPS-Server deployed
- [ ] Lighthouse Score > 90
- [ ] Auf echtem Mobile Device getestet
- [ ] Service Worker funktioniert
- [ ] Offline-Modus funktioniert
- [ ] Install-Prompt erscheint

## 🎨 Anpassungen

### App-Name ändern
In `vite.config.js`:
```js
manifest: {
  name: 'Dein App Name',
  short_name: 'Kurzname',
}
```

### Theme-Color ändern
In `vite.config.js`:
```js
manifest: {
  theme_color: '#deine-farbe',
  background_color: '#deine-farbe',
}
```

### Icons ersetzen
Ersetze `public/icon-192.png` und `public/icon-512.png`

## 📱 App Store Submission (Optional)

### Google Play Store (TWA)
1. Nutze [PWA Builder](https://www.pwabuilder.com)
2. Generiere Android Package
3. Signiere mit Android Studio
4. Upload zu Play Store

### Apple App Store (iOS)
1. Nutze [PWA Builder](https://www.pwabuilder.com)
2. Generiere iOS Package
3. Öffne in Xcode
4. Submit zu App Store

⚠️ **Hinweis**: App Store Submission erfordert Developer-Accounts ($99/Jahr)

## 🆘 Troubleshooting

### "Service Worker registration failed"
- Prüfe ob HTTPS aktiv ist (oder localhost)
- Prüfe Browser-Konsole für Fehler
- Lösche Cache und versuche erneut

### "Add to Home Screen" erscheint nicht
- Warte 30 Sekunden nach Laden
- Prüfe ob Manifest gültig ist
- Prüfe ob Icons vorhanden sind
- Manche Browser zeigen es nur bei mehrfachen Besuchen

### Icons werden nicht angezeigt
- Prüfe ob PNG-Dateien vorhanden sind
- Prüfe Manifest-Pfade
- Hard-Reload (Ctrl+Shift+R)

### App funktioniert nicht offline
- Prüfe Service Worker Status
- Prüfe Cache in DevTools
- Stelle sicher dass Assets gecached wurden

## 📚 Weitere Ressourcen

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

Viel Erfolg mit deiner PWA! 🚀

