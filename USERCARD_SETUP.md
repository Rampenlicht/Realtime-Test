# User Card Setup

Eine User Card Komponente mit Realtime Guthaben-Tracking über Supabase.

## Features

✨ **Realtime Balance Updates** - Guthaben wird in Echtzeit synchronisiert
🎫 **QR-Code** - Jeder User hat einen einzigartigen QR-Code
💳 **User Card Design** - Schöne, moderne Card mit Gradient
📱 **Mobile First** - Optimiert für alle Bildschirmgrößen
⚡ **Postgres Changes** - Updates werden durch DB-Änderungen getriggert

## Schnellstart

### 1. Datenbank einrichten

Führe das SQL-Script aus: `supabase-usercard-schema.sql`

```sql
-- Erstellt:
-- - users Tabelle
-- - Beispiel-User
-- - RLS Policies
-- - Trigger für updated_at
```

Im Supabase SQL Editor ausführen.

### 2. Realtime aktivieren

1. Gehe zu Supabase Dashboard → Database → Replication
2. Suche die `users` Tabelle
3. Aktiviere **Realtime** (Toggle auf ON)

### 3. App starten

```bash
npm run dev
```

## Wie funktioniert es?

### Beim Laden der Seite:

1. **User-Daten laden**
   ```javascript
   const { data } = await supabase
     .from('users')
     .select('*')
     .single()
   ```

2. **Realtime Subscribe**
   ```javascript
   supabase
     .channel('user-balance-changes')
     .on('postgres_changes', {
       event: 'UPDATE',
       schema: 'public',
       table: 'users'
     }, (payload) => {
       // Update State mit neuen Daten
       setUser(payload.new)
     })
   ```

### Bei Guthaben-Änderung:

1. **Update in Datenbank**
   ```javascript
   await supabase
     .from('users')
     .update({ balance: newBalance })
     .eq('id', user.id)
   ```

2. **Postgres triggert UPDATE Event**
3. **Alle Clients empfangen Update**
4. **Guthaben wird automatisch aktualisiert**

## User Card Komponente

### Props

```javascript
<UserCard userId={optionalUserId} />
```

- `userId` (optional) - Spezifischer User, sonst wird erster User geladen

### Features

**Angezeigt werden:**
- Name
- Email
- QR-Code ID
- Aktuelles Guthaben (groß hervorgehoben)
- QR-Code zum Scannen
- Erstellungs- und Update-Datum

**Demo-Buttons:**
- +10 € Button
- -10 € Button

Diese triggern Realtime-Updates!

## Datenbank Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  qrcode_id TEXT UNIQUE,      -- QR-Code Identifier
  name TEXT,                   -- Benutzername
  email TEXT,                  -- E-Mail
  balance DECIMAL(10, 2),      -- Guthaben in Euro
  created_at TIMESTAMPTZ,      -- Erstellt am
  updated_at TIMESTAMPTZ       -- Aktualisiert am
);
```

### Beispiel-Daten

Das SQL-Script fügt automatisch 3 Test-User ein:
- Max Mustermann (150.50 €)
- Anna Schmidt (89.99 €)
- Tom Weber (250.00 €)

## Realtime Testing

### Multi-Tab Test:
1. Öffne App in 2 Browser-Tabs
2. Klicke "+10 €" in Tab 1
3. Guthaben aktualisiert sich sofort in Tab 2! ✨

### Multi-Device Test:
1. Deploye auf HTTPS-Server
2. Öffne auf Smartphone und Desktop
3. Ändere Guthaben auf einem Gerät
4. Andere Geräte aktualisieren sich automatisch

## Anpassungen

### Andere User laden

```javascript
// Spezifischen User laden
<UserCard userId="uuid-hier" />

// Oder User-Auswahl hinzufügen
const [selectedUserId, setSelectedUserId] = useState(null)
<UserCard userId={selectedUserId} />
```

### Guthaben-Änderung anpassen

In `UserCard.jsx`:

```javascript
const updateBalance = async (amount) => {
  const newBalance = parseFloat(user.balance) + amount
  
  await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', user.id)
}
```

### Styling anpassen

Alle Styles sind Tailwind-Klassen:
- Gradient: `from-blue-600 to-purple-600`
- Card: `rounded-2xl shadow-2xl`
- QR-Code Größe: `size={200}`

## Erweiterungen

### Transaktions-Historie

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2),
  type TEXT, -- 'credit' oder 'debit'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Multiple Cards

```javascript
function App() {
  const userIds = ['uuid1', 'uuid2', 'uuid3']
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {userIds.map(id => (
        <UserCard key={id} userId={id} />
      ))}
    </div>
  )
}
```

### QR-Code Scanner

```bash
npm install html5-qrcode
```

```javascript
import { Html5QrcodeScanner } from 'html5-qrcode'

// QR-Code scannen und User laden
const onScanSuccess = (qrcodeId) => {
  // Lade User mit diesem QR-Code
  loadUserByQRCode(qrcodeId)
}
```

## Troubleshooting

### "Keine User gefunden"
- Prüfe ob `users` Tabelle existiert
- Führe `supabase-usercard-schema.sql` aus
- Prüfe ob Beispiel-Daten vorhanden sind

### "Guthaben aktualisiert sich nicht"
- Prüfe ob Realtime für `users` aktiviert ist
- Prüfe Browser Console für Errors
- Prüfe Channel Status in Console

### QR-Code wird nicht angezeigt
- `react-qr-code` muss installiert sein
- Prüfe ob `qrcode_id` vorhanden ist

## Security Best Practices

### Für Production:

```sql
-- Nur eingeloggte User können eigene Daten sehen
CREATE POLICY "User kann nur eigene Daten sehen"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Nur Backend kann Balance ändern
CREATE POLICY "Nur Service kann Balance ändern"
  ON users FOR UPDATE
  USING (false); -- Niemand kann direkt updaten
```

### Backend-Endpoint für Balance-Updates:

```javascript
// Supabase Edge Function
import { createClient } from '@supabase/supabase-js'

export default async (req) => {
  const { userId, amount } = await req.json()
  
  // Validierung & Autorisierung
  // ...
  
  // Sicheres Balance-Update
  const { data } = await supabase
    .from('users')
    .update({ balance: newBalance })
    .eq('id', userId)
    
  return new Response(JSON.stringify(data))
}
```

## Demo vs Production

### Demo (Aktuell):
- ✅ Direkte DB-Updates von Frontend
- ✅ Keine Authentifizierung
- ✅ Perfekt zum Testen

### Production:
- ✅ Backend-API für Balance-Updates
- ✅ Authentifizierung erforderlich
- ✅ RLS Policies aktiv
- ✅ Audit-Log für Transaktionen

## Nächste Schritte

- [ ] User-Authentifizierung hinzufügen
- [ ] Transaktions-Historie implementieren
- [ ] QR-Code Scanner integrieren
- [ ] Backend-API für sichere Updates
- [ ] Notifications bei Balance-Änderungen
- [ ] Export-Funktion für Transaktionen

Viel Erfolg mit der User Card! 💳✨

