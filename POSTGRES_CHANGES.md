# Postgres Changes statt Broadcast

Die App wurde von **Broadcast** auf **Postgres Changes** umgestellt.

## Was ist der Unterschied?

### Broadcast (Vorher)
- Nachrichten werden direkt über WebSocket versendet
- **KEINE** Datenbank erforderlich
- Nachrichten werden nicht persistent gespeichert
- Schneller, aber kein Verlauf

### Postgres Changes (Jetzt)
- Nachrichten werden in der Datenbank gespeichert
- **Datenbank ist ERFORDERLICH**
- Realtime-Events werden durch DB-Änderungen getriggert
- Persistent + Verlauf verfügbar

## ⚠️ Wichtig: Datenbank Setup erforderlich!

Mit Postgres Changes **MUSS** die Datenbank konfiguriert sein:

### 1. Supabase Projekt erstellen
Siehe [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

### 2. Messages-Tabelle erstellen
Führe das SQL aus `supabase-schema.sql` aus:

```sql
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  username TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für Performance
CREATE INDEX IF NOT EXISTS messages_timestamp_idx ON messages(timestamp DESC);
```

### 3. Realtime aktivieren
1. Gehe zu Supabase Dashboard → Database → Replication
2. Suche die `messages` Tabelle
3. Aktiviere **Realtime** (Toggle auf ON)

### 4. RLS (Row Level Security) konfigurieren
```sql
-- RLS aktivieren
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann lesen
CREATE POLICY "Jeder kann Nachrichten lesen"
  ON messages FOR SELECT
  USING (true);

-- Policy: Jeder kann einfügen
CREATE POLICY "Jeder kann Nachrichten erstellen"
  ON messages FOR INSERT
  WITH CHECK (true);
```

## Wie funktioniert es jetzt?

### Flow:
```
1. User sendet Nachricht
   ↓
2. INSERT in Datenbank (messages Tabelle)
   ↓
3. Postgres triggert INSERT Event
   ↓
4. Supabase Realtime sendet Event an alle Clients
   ↓
5. Alle verbundenen Clients empfangen die neue Nachricht
```

### Code:

**Subscribe (Listen):**
```javascript
supabase
  .channel('messages-db-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    // Neue Nachricht: payload.new
    const newMessage = payload.new
    // Füge zu State hinzu
  })
  .subscribe()
```

**Send (Insert):**
```javascript
await supabase
  .from('messages')
  .insert([newMessage])
```

Das INSERT triggert automatisch ein Realtime-Event an alle Subscriber!

## Vorteile

✅ **Persistent**: Nachrichten bleiben in DB gespeichert
✅ **Verlauf**: Lade alte Nachrichten beim Start
✅ **Zuverlässig**: Garantierte Zustellung durch DB
✅ **Löschbar**: DELETE Events werden auch getriggert
✅ **Sync**: Alle Clients immer im Sync mit DB

## Nachteile

⚠️ **Datenbank erforderlich**: Funktioniert nicht ohne DB
⚠️ **Etwas langsamer**: Durch DB Round-Trip
⚠️ **Setup nötig**: Tabelle + Realtime muss aktiviert sein

## Events die getriggert werden

### INSERT (Neue Nachricht)
```javascript
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages'
}, (payload) => {
  console.log('Neue Nachricht:', payload.new)
})
```

### DELETE (Nachricht gelöscht)
```javascript
.on('postgres_changes', {
  event: 'DELETE',
  schema: 'public',
  table: 'messages'
}, (payload) => {
  console.log('Gelöschte Nachricht:', payload.old)
})
```

### UPDATE (Nachricht bearbeitet)
```javascript
.on('postgres_changes', {
  event: 'UPDATE',
  schema: 'public',
  table: 'messages'
}, (payload) => {
  console.log('Alt:', payload.old)
  console.log('Neu:', payload.new)
})
```

## Debugging

### Prüfe ob Realtime aktiviert ist
1. Supabase Dashboard → Database → Replication
2. `messages` Tabelle sollte grünen Toggle haben

### Teste manuell
```javascript
// In Browser Console:
const { data, error } = await supabase
  .from('messages')
  .insert([{
    id: 'test-123',
    text: 'Test',
    username: 'TestUser',
    timestamp: new Date().toISOString()
  }])
  .select()

console.log(data, error)
```

Wenn Realtime aktiviert ist, sollte die Nachricht sofort in allen Clients erscheinen!

### Prüfe Channel Status
```javascript
// In Browser Console:
channel.state // Sollte 'joined' sein
```

## Zurück zu Broadcast wechseln

Falls du zurück zu Broadcast wechseln möchtest (keine DB erforderlich):

1. Ändere Channel-Setup:
```javascript
.channel('realtime-chat')
.on('broadcast', { event: 'message' }, (payload) => {
  const newMessage = payload.payload
  // ...
})
```

2. Ändere Send-Funktion:
```javascript
await channelRef.current.send({
  type: 'broadcast',
  event: 'message',
  payload: newMessage
})
```

## Best Practices

### Performant laden
```javascript
// Lade nur letzte 50 Nachrichten
const { data } = await supabase
  .from('messages')
  .select('*')
  .order('timestamp', { ascending: true })
  .limit(50)
```

### Alte Nachrichten löschen
```sql
-- Lösche Nachrichten älter als 7 Tage
DELETE FROM messages 
WHERE timestamp < NOW() - INTERVAL '7 days';
```

### Pagination
```javascript
const { data } = await supabase
  .from('messages')
  .select('*')
  .order('timestamp', { ascending: true })
  .range(0, 49) // 0-49 = erste 50
```

## Troubleshooting

### "Nachricht konnte nicht gespeichert werden"
- Prüfe ob `messages` Tabelle existiert
- Prüfe RLS Policies
- Prüfe Supabase URL & Key in `.env`

### "Keine neuen Nachrichten empfangen"
- Prüfe ob Realtime für `messages` aktiviert ist
- Prüfe Channel Status in Console
- Hard-Reload: Ctrl+Shift+R

### "Duplikate in Liste"
- Code hat Duplikat-Check
- Sollte nicht passieren
- Prüfe Browser Console für Fehler

## Mehr Infos

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

