import { request } from '@/api/business_owner/invite'

export const accept_invite_data = async (method, endpoint, payload = null) => {
  try {
    const data = await request(method, endpoint, payload)
    try {
      return data
    } catch (error) {
      return error
    }
  } catch (error) {
    throw error
  }
}
