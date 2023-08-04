import { authentication } from '@/api/business_owner/auth'

export const login_data = async (method, endpoint, payload = null) => {
  try {
    const login = await authentication(method, endpoint, payload)
    try {
      if (login.data.attributes) {
        const login_data = login.data.attributes
        return login_data
      } else {
        return login
      }
    } catch (error) {
      return error
    }
  } catch (error) {
    throw error
  }
}
