import API_CONFIG from '../configs/axiosConfigs'
import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'

export async function request(method, endpoint, data, params = {}) {
  const url = `${API_CONFIG.baseUrl}/admin_user/${endpoint}`
  try {
    const response = await axios({
      method,
      url,
      headers: API_CONFIG.headers,
      data,
      params: {
        per_page: params.per_page || 1000,
        page: params.page || 1,
        query: params.query,
      },
    })

    return handleResponse(response)
  } catch (error) {
    throw error
  }
}
