# Tailwind CSS Design System

Diese App verwendet ein **Mobile-First** Design mit Tailwind CSS.

## Responsive Breakpoints

Tailwind CSS verwendet folgende Breakpoints:

- **Base (< 640px)** - Mobile Phones
- **sm (640px+)** - Tablets
- **md (768px+)** - Small Laptops
- **lg (1024px+)** - Desktops
- **xl (1280px+)** - Large Desktops

## Design-Prinzipien

### 1. Mobile First
Alle Komponenten sind zuerst für Mobile optimiert und werden dann für größere Bildschirme erweitert:

```jsx
// Mobile zuerst (kein Präfix)
className="text-sm p-3"

// Tablet und größer (sm:)
className="text-sm sm:text-base sm:p-4"
```

### 2. Dark Mode
Die App unterstützt automatisch Light und Dark Mode basierend auf System-Präferenzen:

```jsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

### 3. Gradient Hintergründe
Der Body nutzt einen subtilen Gradient:

```css
bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
```

## Komponenten-Styling

### App Container
- Zentriert auf großen Bildschirmen
- Maximale Breite: 4xl (896px)
- Responsives Padding

### RealtimeChat
- Glasmorphism-Effekt mit `backdrop-blur-md`
- Semi-transparenter Hintergrund (`bg-white/80`)
- Abgerundete Ecken (mobile: `rounded-xl`, desktop: `rounded-2xl`)

### MessageList
- Custom Scrollbar mit `scrollbar-thin`
- Adaptive Höhe: 300px (mobile) bis 600px (desktop)
- Smooth Scroll-Verhalten

### MessageInput
- Stacked Layout auf Mobile (vertical)
- Horizontal auf Tablet+ (`sm:flex-row`)
- Gradient Button mit Hover-Effekten
- Scale-Animationen bei Interaktion

### ConnectionStatus
- Pill-Form mit `rounded-full`
- Animierter Status-Indikator (`animate-pulse-slow`)
- Farbcodiert: Grün (verbunden) / Rot (getrennt)

## Farben

### Primary Colors
- Blue: `from-blue-600 to-purple-600`
- Verwendet für Buttons und Hervorhebungen

### Status Colors
- Success/Connected: `green-500`, `green-100` (dark: `green-900/30`)
- Error/Disconnected: `red-500`, `red-100` (dark: `red-900/20`)
- Info: `blue-500`, `blue-100` (dark: `blue-900/20`)

### Text Colors
- Primary: `gray-900` (dark: `gray-100`)
- Secondary: `gray-600` (dark: `gray-400`)
- Muted: `gray-500` (dark: `gray-500`)

## Animationen

### Fade-In (Neue Nachrichten)
```js
animate-fade-in // 0.3s ease-in
```

### Pulse (Connection Status)
```js
animate-pulse-slow // 2s infinite
```

### Hover Effects
- Scale: `hover:scale-[1.02]`
- Shadow: `hover:shadow-md`
- Color Transitions: `transition-all duration-200`

## Custom Utilities

### Scrollbar
```css
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}
```

Definiert in `src/index.css` mit `@layer utilities`.

## Tipps für Erweiterungen

1. **Neue Komponente erstellen**: Beginne mit Mobile-Styling, füge dann `sm:`, `md:` Varianten hinzu
2. **Dark Mode**: Füge immer `dark:` Varianten für Farben hinzu
3. **Spacing**: Nutze `gap-` statt `margin` für konsistenten Abstand
4. **Transitions**: Füge `transition-all` für smooth Animationen hinzu

## Beispiel Komponente

```jsx
function MyComponent() {
  return (
    <div className="
      p-3 sm:p-4 md:p-6
      bg-white dark:bg-gray-800
      rounded-lg sm:rounded-xl
      border border-gray-200 dark:border-gray-700
      shadow-sm hover:shadow-md
      transition-all duration-200
    ">
      <h3 className="
        text-base sm:text-lg md:text-xl
        font-semibold
        text-gray-900 dark:text-gray-100
      ">
        Überschrift
      </h3>
      <p className="
        text-sm sm:text-base
        text-gray-600 dark:text-gray-400
        mt-2
      ">
        Text
      </p>
    </div>
  )
}
```

## Browser Support

- Chrome/Edge: ✅ Volle Unterstützung
- Firefox: ✅ Volle Unterstützung
- Safari: ✅ Volle Unterstützung (iOS 12.2+)
- IE: ❌ Nicht unterstützt

