import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { I18nProvider } from './i18n/index.tsx'
import { themeCss } from './tokens/theme.ts'
import './index.css'
import './styles/components.css'

// Locked tokens become CSS custom properties before the first paint, so
// theme.ts stays the only place any of these values is written down.
const style = document.createElement('style')
style.id = 'bhavsetu-tokens'
style.textContent = themeCss()
document.head.prepend(style)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
