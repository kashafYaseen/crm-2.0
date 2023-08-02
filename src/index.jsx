// index.jsx
import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client' // Use createRoot from 'react-dom'
import { Provider } from 'react-redux'
import 'flag-icon-css/css/flag-icons.min.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import store from './store'
import { StoreProvider } from '@/context/storeContext'
import initializeI18n from './initializeI18n'

initializeI18n()

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </Provider>,
)

reportWebVitals()
