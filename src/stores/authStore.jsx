import moment from 'moment'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dispatchEvent } from '@/eventDispatcher'

const authStore = create(
  persist(
    (set, get) => ({
      token: null,
      targetTime: null,
      userType: null,
      userId: null,
      userName: null,
      setToken: (token, targetTime, userType, userId, userName) =>
        set(() => ({ token, targetTime, userType, userId, userName })),
      logout: () => {
        set(() => ({ token: null, targetTime: null, userType: null, userId: null, userName: null }))
        dispatchEvent('triggerNavigationToLogin')
      },
      startTimeTracker: () => {
        const interval = setInterval(() => {
          const targetTime = get().targetTime

          if (targetTime) {
            const expireDate = moment.unix(parseInt(targetTime))
            const currentTime = moment()
            const isTokenExpired = currentTime.isAfter(expireDate)

            if (isTokenExpired) {
              get().logout()
              clearInterval(interval)
            }
          }
        }, 1000)
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    },
  ),
)

export default authStore
