import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'flag-icon-css/css/flag-icons.min.css'

import App from './App'
import reportWebVitals from './reportWebVitals'
import store from './store'
import { StoreProvider } from '@/context/storeContext'
import initializeI18n from './initializeI18n'

initializeI18n()

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </Provider>,
)

reportWebVitals()
