-- Realtime Test App - Supabase Datenbank Schema
-- Führe dieses SQL in deinem Supabase SQL Editor aus

-- Erstelle messages Tabelle
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  username TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für schnellere Abfragen nach Zeitstempel
CREATE INDEX IF NOT EXISTS messages_timestamp_idx ON messages(timestamp DESC);

-- Row Level Security (RLS) aktivieren für Sicherheit
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann Nachrichten lesen
CREATE POLICY "Jeder kann Nachrichten lesen"
  ON messages FOR SELECT
  USING (true);

-- Policy: Jeder kann Nachrichten erstellen
CREATE POLICY "Jeder kann Nachrichten erstellen"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Optional: Policy zum Löschen alter Nachrichten (nur für Admins)
-- CREATE POLICY "Admins können Nachrichten löschen"
--   ON messages FOR DELETE
--   USING (auth.jwt() ->> 'role' = 'admin');

-- Optional: Funktion zum automatischen Löschen alter Nachrichten (z.B. älter als 7 Tage)
-- CREATE OR REPLACE FUNCTION delete_old_messages()
-- RETURNS void AS $$
-- BEGIN
--   DELETE FROM messages 
--   WHERE timestamp < NOW() - INTERVAL '7 days';
-- END;
-- $$ LANGUAGE plpgsql;

-- Optional: Trigger zum automatischen Löschen (täglich um Mitternacht)
-- Dies erfordert die pg_cron Extension
-- SELECT cron.schedule('delete-old-messages', '0 0 * * *', 'SELECT delete_old_messages();');

COMMENT ON TABLE messages IS 'Chat-Nachrichten für die Realtime Test App';
COMMENT ON COLUMN messages.id IS 'Eindeutige ID der Nachricht';
COMMENT ON COLUMN messages.text IS 'Nachrichtentext';
COMMENT ON COLUMN messages.username IS 'Benutzername des Absenders';
COMMENT ON COLUMN messages.timestamp IS 'Zeitstempel der Nachricht';

