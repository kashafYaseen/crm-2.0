import API_CONFIG from '../configs/axiosConfigs'
import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'

export async function request(method, endpoint, data) {
  const url = `${API_CONFIG.baseUrl}/owner/${endpoint}`
  try {
    const response = await axios({
      method,
      url,
      headers: API_CONFIG.headers,
      data,
    })

    return handleResponse(response)
  } catch (error) {
    throw error
  }
}
