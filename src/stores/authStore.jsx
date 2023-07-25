import dayjs from 'dayjs'
import { login_data } from '@/api/admin_user/config/resources/sessions'
import { extendObservable, runInAction } from 'mobx'
import SessionStore from 'mobx-session'

class AuthStore {
  constructor() {
    SessionStore.initialize()

    extendObservable(this, {
      start_timer_value: null,
      isTimerRunning: false,
      user: null,
      loginError: false,
      logoutError: false,
      get loggedIn() {
        return this.user !== null && SessionStore.hasSession
      },
    })

    runInAction('Load user', async () => {
      this.user = await SessionStore.getSession()
    })
  }

  saveUser = (session) => {
    SessionStore.saveSession(session)
    runInAction('Save user', () => {
      this.user = session
    })
  }

  removeUser = () => {
    SessionStore.deleteSession()
    runInAction('Logout user', () => {
      this.user = null
    })
  }

  getUser = () => {
    SessionStore.getSession()
    runInAction('Get user', async () => {
      this.user = await SessionStore.getSession()
    })
    return this.user
  }

  startTimeTracker(targetTime) {
    const interval = setInterval(() => {
      const now = dayjs()
      const expired = dayjs(targetTime)

      if (now.isAfter(expired)) {
        this.logout()
        clearInterval(interval)
      }
    }, 1000)
  }

  login = async (values) => {
    try {
      runInAction('Init Login', () => {
        this.loginError = false
      })
      const extractedData = await login_data('post', 'sessions', values)
      this.saveUser(extractedData)

      const expireTime = dayjs(extractedData.token_expires_at)
      const targetTime = expireTime.format('YYYY-MM-DD HH:mm:ss')

      this.startTimeTracker(targetTime)

      return true
    } catch (error) {
      runInAction('Error Login', () => {
        this.loginError = error.errors
      })
    }
  }

  logout = async () => {
    try {
      runInAction('Init Logout', () => {
        this.logoutError = false
      })
      this.removeUser()
    } catch (error) {
      runInAction('Error Logout', () => {
        this.logoutError = error.errors
      })
    }
  }
}

export default new AuthStore()
