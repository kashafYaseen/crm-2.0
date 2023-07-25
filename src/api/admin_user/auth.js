import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'

export async function authentication(method, endpoint, data) {
  const url = `http://localhost:3000/en/crm/v1/admin_user/${endpoint}`
  try {
    const response = await axios({
      method,
      url,
      data,
    })

    return handleResponse(response)
  } catch (error) {
    throw error
  }
}
