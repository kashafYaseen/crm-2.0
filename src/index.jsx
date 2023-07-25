import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { StoreProvider } from '@/context/storeContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </Provider>,
)

reportWebVitals()
