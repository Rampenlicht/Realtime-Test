-- User Card Schema für Realtime Guthaben-Tracking

-- Erstelle users Tabelle
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qrcode_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für schnellen QR-Code Lookup
CREATE INDEX IF NOT EXISTS users_qrcode_id_idx ON users(qrcode_id);

-- Index für Email-Suche
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Funktion zum automatischen Update des updated_at Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatisches updated_at Update
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann User lesen
CREATE POLICY "Jeder kann User lesen"
  ON users FOR SELECT
  USING (true);

-- Policy: Jeder kann User erstellen (für Demo)
CREATE POLICY "Jeder kann User erstellen"
  ON users FOR INSERT
  WITH CHECK (true);

-- Policy: Jeder kann User aktualisieren (für Demo)
CREATE POLICY "Jeder kann User aktualisieren"
  ON users FOR UPDATE
  USING (true);

-- Beispiel-Daten einfügen
INSERT INTO users (qrcode_id, name, email, balance) VALUES
  ('QR-2024-001', 'Max Mustermann', 'max@example.com', 150.50),
  ('QR-2024-002', 'Anna Schmidt', 'anna@example.com', 89.99),
  ('QR-2024-003', 'Tom Weber', 'tom@example.com', 250.00)
ON CONFLICT (qrcode_id) DO NOTHING;

-- Kommentare
COMMENT ON TABLE users IS 'Benutzer mit Guthaben-Tracking';
COMMENT ON COLUMN users.id IS 'Eindeutige UUID des Benutzers';
COMMENT ON COLUMN users.qrcode_id IS 'QR-Code ID für Identifikation';
COMMENT ON COLUMN users.name IS 'Name des Benutzers';
COMMENT ON COLUMN users.email IS 'E-Mail-Adresse';
COMMENT ON COLUMN users.balance IS 'Aktuelles Guthaben in Euro';
COMMENT ON COLUMN users.created_at IS 'Erstellungszeitpunkt';
COMMENT ON COLUMN users.updated_at IS 'Letztes Update';

