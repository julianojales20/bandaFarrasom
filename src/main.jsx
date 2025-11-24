import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Fonts and icons installed via npm
import '@fontsource/urbanist/400.css'
import '@fontsource/urbanist/700.css'
import '@fontsource/urbanist/900.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
