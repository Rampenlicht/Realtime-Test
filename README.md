# Realtime Test App

Eine PWA mit User Card und Realtime Guthaben-Tracking über Supabase.

## Features

✨ **Realtime Chat** - Sofortige Nachrichtenübertragung zwischen Clients  
🔄 **Supabase Integration** - Powered by Supabase Realtime  
💾 **Optionale Persistierung** - Nachrichten können in der DB gespeichert werden  
🎨 **Modernes UI** - Schönes, responsives Design mit Tailwind CSS  
🌓 **Dark/Light Mode** - Automatische Anpassung an System-Präferenzen  
📱 **Mobile First** - Optimiert für alle Bildschirmgrößen  
📲 **Progressive Web App** - Installierbar auf allen Geräten  
⚡ **Offline-Support** - Funktioniert auch ohne Internetverbindung  
🚀 **Auto-Update** - Neue Versionen werden automatisch geladen  

## Schnellstart

### 1. Installation

```bash
npm install
```

### 2. Supabase Setup

Folge der detaillierten Anleitung in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

**Kurzversion:**
1. Erstelle ein Supabase-Projekt auf [supabase.com](https://supabase.com)
2. Erstelle eine `.env` Datei mit deinen Credentials:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

3. (Optional) Führe das SQL-Schema aus: `supabase-schema.sql`

### 3. Entwicklung starten

```bash
npm run dev
```

Öffne [http://localhost:5173](http://localhost:5173) im Browser.

## Verfügbare Befehle

```bash
npm run dev      # Entwicklungsserver starten
npm run build    # Production Build erstellen
npm run preview  # Production Build lokal testen
```

## Komponenten

- **RealtimeChat** - Haupt-Chat-Komponente mit Supabase Integration
- **ConnectionStatus** - Zeigt Realtime-Verbindungsstatus an
- **MessageList** - Scrollbare Nachrichtenliste mit Auto-Scroll
- **MessageInput** - Eingabefeld mit Enter-to-Send

## Technologie-Stack

- ⚡ **Vite** - Schnelles Build-Tool
- ⚛️ **React 18** - UI Framework
- 🔥 **Supabase** - Backend & Realtime
- 🎨 **Tailwind CSS 3** - Utility-First CSS Framework
- 🌓 **Dark Mode** - Automatische Anpassung

## Wie es funktioniert

Die App nutzt **Supabase Realtime Broadcast**, um Nachrichten zwischen Clients zu synchronisieren:

1. Beim Start wird eine Verbindung zum Supabase Realtime Channel aufgebaut
2. Gesendete Nachrichten werden per Broadcast an alle verbundenen Clients geschickt
3. Optional werden Nachrichten auch in der Datenbank gespeichert
4. Die Verbindung wird in Echtzeit überwacht und angezeigt

## Testen

Öffne die App in mehreren Browser-Tabs oder auf verschiedenen Geräten und chatte in Echtzeit! 🚀

## PWA Installation

Die App ist eine vollständige Progressive Web App! 📲

### Installation
1. Öffne die App im Browser
2. Klicke auf "Installieren" (Desktop) oder "Zum Startbildschirm hinzufügen" (Mobile)
3. Die App öffnet sich in eigenem Fenster/als App

**Mehr Infos:** Siehe [`PWA_SETUP.md`](./PWA_SETUP.md)

### Wichtige Hinweise
- PWA funktioniert nur über HTTPS (oder localhost)
- Icons müssen noch generiert werden (siehe PWA_SETUP.md)
- Service Worker cached alle Assets für Offline-Nutzung

## Nächste Schritte

- [x] PWA Manifest und Service Worker ✅
- [ ] App Icons generieren
- [ ] Benutzer-Authentifizierung implementieren
- [ ] Typing-Indikatoren hinzufügen
- [ ] Mehrere Chat-Räume unterstützen
- [ ] Nachrichtenformatierung (Markdown, Links, etc.)
- [ ] Push-Benachrichtigungen

## Lizenz

MIT

