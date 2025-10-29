# Supabase Setup Anleitung

Diese Anleitung zeigt dir, wie du die Realtime Test App mit Supabase verbindest.

## 1. Supabase Projekt erstellen

1. Gehe zu [https://supabase.com](https://supabase.com)
2. Melde dich an oder erstelle ein kostenloses Konto
3. Klicke auf "New Project"
4. Gib deinem Projekt einen Namen (z.B. "realtime-test")
5. Wähle ein sicheres Datenbank-Passwort
6. Wähle eine Region (am besten in deiner Nähe)
7. Klicke auf "Create new project"

## 2. Datenbank-Tabelle erstellen (Optional)

Die App funktioniert auch ohne Datenbank-Tabelle (nur mit Broadcast), aber wenn du die Nachrichten speichern möchtest:

1. Gehe in deinem Supabase Dashboard zu **SQL Editor**
2. Klicke auf "New query"
3. Kopiere und führe dieses SQL aus:

```sql
-- Erstelle messages Tabelle
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  user TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS messages_timestamp_idx ON messages(timestamp DESC);

-- Optional: Row Level Security (RLS) aktivieren
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann Nachrichten lesen
CREATE POLICY "Jeder kann Nachrichten lesen"
  ON messages FOR SELECT
  USING (true);

-- Policy: Jeder kann Nachrichten erstellen
CREATE POLICY "Jeder kann Nachrichten erstellen"
  ON messages FOR INSERT
  WITH CHECK (true);
```

## 3. Realtime aktivieren

1. Gehe zu **Database** → **Replication**
2. Suche die `messages` Tabelle (falls erstellt)
3. Aktiviere Realtime für diese Tabelle (Toggle auf ON)

> **Hinweis:** Auch ohne Tabelle funktioniert Realtime mit Broadcast!

## 4. API-Schlüssel abrufen

1. Gehe zu **Settings** → **API**
2. Kopiere folgende Werte:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon public key** (der lange String unter "Project API keys")

## 5. Umgebungsvariablen konfigurieren

1. Erstelle eine `.env` Datei im Projekt-Root (falls noch nicht vorhanden)
2. Füge deine Supabase-Daten ein:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key-hier
```

⚠️ **Wichtig:** Ersetze die Platzhalter mit deinen echten Werten!

## 6. App starten

```bash
npm run dev
```

Die App sollte sich nun mit Supabase verbinden und du kannst Realtime-Nachrichten testen!

## Testen

1. Öffne die App in zwei verschiedenen Browser-Tabs
2. Sende eine Nachricht in einem Tab
3. Die Nachricht sollte sofort im anderen Tab erscheinen! 🎉

## Troubleshooting

### "Supabase nicht konfiguriert"
- Überprüfe, ob die `.env` Datei existiert und die Werte korrekt sind
- Starte den Dev-Server neu: `Ctrl+C` und dann `npm run dev`

### "Konnte Nachrichten nicht laden"
- Das ist normal, wenn die `messages` Tabelle noch nicht erstellt wurde
- Die App funktioniert trotzdem mit Broadcast-Nachrichten
- Nachrichten werden dann nicht persistent gespeichert

### Verbindung schlägt fehl
- Überprüfe, ob dein Supabase-Projekt läuft
- Prüfe die Browser-Konsole auf Fehlermeldungen
- Stelle sicher, dass Realtime in den Supabase-Einstellungen aktiviert ist

## Broadcast vs. Database

Die App unterstützt zwei Modi:

### 1. Broadcast-Only (Standard, keine DB nötig)
- Nachrichten werden nur in Echtzeit übertragen
- Keine Persistierung
- Perfekt zum schnellen Testen

### 2. Mit Datenbank
- Nachrichten werden gespeichert und geladen
- Verlauf bleibt erhalten
- Besser für Produktions-Apps

Beide Modi funktionieren gleichzeitig! 🚀

