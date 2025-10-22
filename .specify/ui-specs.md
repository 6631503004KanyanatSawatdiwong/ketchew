# Ketchew - UI/UX Specifications

## Design System

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;

  /* Secondary Colors */
  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;

  /* Success/Timer Colors */
  --color-success-50: #f0fdf4;
  --color-success-500: #10b981;
  --color-success-600: #059669;

  /* Warning/Break Colors */
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;

  /* Error Colors */
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;

  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}
```

### Typography

```css
/* Font Families */
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
/* Spacing Scale */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem; /* 2px */
--radius-base: 0.25rem; /* 4px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-xl: 0.75rem; /* 12px */
--radius-2xl: 1rem; /* 16px */
--radius-full: 9999px;
```

## Layout Specifications

### Main Desktop Interface

```css
.desktop-container {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}
```

### Sticky Sidebar

```css
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-3);
}

.sidebar-tab {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-tab:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.sidebar-tab.active {
  background: var(--color-primary-500);
  border-color: var(--color-primary-600);
}
```

### Header Controls

```css
.header-controls {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  gap: var(--space-3);
  z-index: 40;
}

.header-button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

### Multi-Popup Overlay System

```css
.popup-manager {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none; /* Allow interaction with desktop behind */
}

.popup-window {
  position: absolute;
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  min-width: 320px;
  min-height: 200px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: popupEnter 0.2s ease-out;
  resize: both;
}

.popup-window.dragging {
  user-select: none;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35);
  transform: scale(1.02);
}

.popup-header {
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
  padding: var(--space-3) var(--space-4);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.popup-header:active {
  cursor: grabbing;
}

.popup-title {
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.popup-controls {
  display: flex;
  gap: var(--space-1);
}

.popup-control-button {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-base);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.popup-control-button.minimize {
  background: var(--color-warning-100);
  color: var(--color-warning-600);
}

.popup-control-button.minimize:hover {
  background: var(--color-warning-200);
}

.popup-control-button.close {
  background: var(--color-error-100);
  color: var(--color-error-600);
}

.popup-control-button.close:hover {
  background: var(--color-error-200);
}

.popup-content {
  padding: var(--space-6);
  overflow: auto;
  height: calc(100% - 60px); /* Account for header */
}

/* Cascade positioning for new popups */
.popup-window:nth-child(1) {
  top: 10%;
  left: 15%;
}

.popup-window:nth-child(2) {
  top: 15%;
  left: 20%;
}

.popup-window:nth-child(3) {
  top: 20%;
  left: 25%;
}

.popup-window:nth-child(4) {
  top: 25%;
  left: 30%;
}

.popup-window:nth-child(5) {
  top: 30%;
  left: 35%;
}

/* Minimized popup state */
.popup-window.minimized {
  height: 60px !important;
  overflow: hidden;
  transition: height 0.3s ease;
}

.popup-window.minimized .popup-content {
  display: none;
}

/* Focus and layering */
.popup-window.focused {
  z-index: 110;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.3);
}

.popup-window:not(.focused) {
  z-index: 105;
}

@keyframes popupEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Single Popup Overlay System (Legacy)

```css
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.popup-container {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: popupEnter 0.2s ease-out;
}

@keyframes popupEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

## Component-Specific UI

### Pomodoro Timer

```css
.timer-container {
  width: 480px;
  padding: var(--space-8);
  text-align: center;
}

.timer-display {
  font-family: var(--font-mono);
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
  margin: var(--space-8) 0;
}

.progress-dots {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-6);
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--color-gray-300);
  transition: background-color 0.3s ease;
}

.progress-dot.completed {
  background: var(--color-gray-900);
}

.timer-controls {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
}

.timer-button {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timer-button.primary {
  background: var(--color-primary-500);
  color: white;
}

.timer-button.primary:hover {
  background: var(--color-primary-600);
}

.timer-button.secondary {
  background: var(--color-gray-200);
  color: var(--color-gray-700);
}

.timer-button.secondary:hover {
  background: var(--color-gray-300);
}
```

### Todo List

```css
.todo-container {
  width: 400px;
  height: 500px;
  padding: var(--space-6);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.todo-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.todo-list {
  max-height: 300px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  transition: background-color 0.2s ease;
}

.todo-item:hover {
  background: var(--color-gray-50);
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
}

.todo-text {
  flex: 1;
  color: var(--color-gray-700);
}

.todo-text.completed {
  text-decoration: line-through;
  color: var(--color-gray-400);
}
```

### Collaboration Interface

```css
.collaboration-container {
  width: 600px;
  height: 600px;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.participants-list {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.participant-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-medium);
  color: var(--color-primary-700);
}

.chat-container {
  padding: var(--space-4);
  overflow-y: auto;
}

.chat-message {
  margin-bottom: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  background: var(--color-gray-50);
}

.chat-input-container {
  padding: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  gap: var(--space-2);
}

.chat-input {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: 60px;
    top: auto;
    bottom: 0;
    flex-direction: row;
    justify-content: center;
  }

  .popup-container {
    width: 95vw;
    height: 90vh;
  }

  .timer-container {
    width: 100%;
    padding: var(--space-4);
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 60px;
  }

  .popup-container {
    max-width: 80vw;
  }
}
```

## Animation System

### Transitions

```css
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.slide-up-enter {
  transform: translateY(100%);
}

.slide-up-enter-active {
  transform: translateY(0);
  transition: transform 300ms ease-out;
}
```

### Loading States

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s infinite;
}

@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## Accessibility

### Focus States

```css
.focusable:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### ARIA Labels

- All interactive elements have appropriate ARIA labels
- Timer status announced to screen readers
- Progress indicators accessible via ARIA live regions
- Chat messages properly labeled for screen readers
