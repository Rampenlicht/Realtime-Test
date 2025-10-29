# 🚀 Quick Start Guide

Starte die Realtime Chat PWA in 5 Minuten!

## 1️⃣ Installation

```bash
npm install
```

## 2️⃣ Supabase Setup (Optional)

Die App funktioniert auch ohne Supabase im **Broadcast-Only Modus**.

### Mit Supabase (Empfohlen)
1. Erstelle kostenloses Konto auf [supabase.com](https://supabase.com)
2. Erstelle neues Projekt
3. Kopiere URL und Anon Key
4. Erstelle `.env` Datei:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

5. (Optional) Führe SQL aus `supabase-schema.sql` aus

**Details:** Siehe [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

### Ohne Supabase
App funktioniert lokal - Nachrichten werden nur zwischen offenen Tabs synchronisiert.

## 3️⃣ App starten

```bash
npm run dev
```

Öffne: [http://localhost:5173](http://localhost:5173)

## 4️⃣ PWA testen

### Lokal (Development)
- PWA funktioniert auch auf localhost!
- Öffne Chrome DevTools → Application → Manifest
- Install-Prompt sollte erscheinen

### Production Build
```bash
npm run build
npm run serve
```

Öffne: [http://localhost:4173](http://localhost:4173)

## 5️⃣ Icons generieren

Die App funktioniert ohne Icons, aber für eine echte PWA solltest du welche erstellen:

### Option A: Online Generator
1. Gehe zu [realfavicongenerator.net](https://realfavicongenerator.net)
2. Lade `public/icon.svg` hoch
3. Generiere PWA Icons
4. Speichere als `icon-192.png` und `icon-512.png` in `public/`

### Option B: Eigene Icons
1. Erstelle 192x192px und 512x512px PNG
2. Speichere in `public/` als `icon-192.png` und `icon-512.png`
3. Verwende das Gradient-Design: Blue → Purple (#3b82f6 → #9c33ff)

## 6️⃣ Deployment

### Vercel (Schnellste Option)
```bash
npm install -g vercel
vercel login
vercel
```

URL wird automatisch generiert und ist sofort live! ✨

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Andere Optionen
Siehe [`PWA_SETUP.md`](./PWA_SETUP.md) für mehr Deployment-Optionen.

## 🎉 Fertig!

Die App läuft jetzt und ist als PWA installierbar!

## 📱 Auf Mobile testen

1. Deploye die App (muss HTTPS haben)
2. Öffne auf Smartphone
3. Banner "Zum Startbildschirm hinzufügen" sollte erscheinen
4. Installiere die App
5. Öffne von Home-Screen

## 🔧 Troubleshooting

### Service Worker funktioniert nicht
```bash
# Cache löschen
rm -rf node_modules/.vite
npm run dev
```

### Supabase-Verbindung fehlgeschlagen
- Prüfe `.env` Datei (muss im Root sein)
- Prüfe ob Werte korrekt sind
- Dev-Server neu starten

### PWA Install-Button erscheint nicht
- Warte 30 Sekunden nach Laden
- Hard-Reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
- Prüfe Chrome DevTools → Console für Fehler

### Icons fehlen
- Generiere Icons (siehe Schritt 5)
- Oder: App funktioniert auch ohne Icons (nur nicht so hübsch)

## 📚 Weitere Dokumentation

- [`README.md`](./README.md) - Komplette Projekt-Übersicht
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Detailliertes Supabase Setup
- [`PWA_SETUP.md`](./PWA_SETUP.md) - Komplette PWA Dokumentation
- [`TAILWIND_DESIGN.md`](./TAILWIND_DESIGN.md) - Design System
- [`MOBILE_OPTIMIZATIONS.md`](./MOBILE_OPTIMIZATIONS.md) - Mobile Features

## 💡 Tipps

### Multi-Device Testing
1. Öffne App in mehreren Browser-Tabs
2. Sende Nachricht in einem Tab
3. Sieh sie sofort in allen Tabs! ✨

### Dark Mode
- Wechselt automatisch mit System-Einstellungen
- Oder: Chrome DevTools → Toggle Dark Mode

### Performance
- Lighthouse Score sollte > 90 sein
- Chrome DevTools → Lighthouse → Run Audit

## 🆘 Hilfe

Probleme? Schau in die Dokumentation oder prüfe:
- Browser Console für Fehler
- Chrome DevTools → Application → Service Workers
- Network Tab für API-Calls

Happy Chatting! 🎉💬

