import React, { createContext, useContext } from 'react'
import authStore from '@/stores/authStore'

const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  return <StoreContext.Provider value={authStore}>{children}</StoreContext.Provider>
}

export const useStores = () => {
  return useContext(StoreContext)
}
