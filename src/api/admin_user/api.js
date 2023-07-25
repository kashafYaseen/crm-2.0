import { useStores } from '@/context/storeContext'
import API_CONFIG from '../configs/axiosConfigs'
import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'

export async function request(method, endpoint, data, params = {}, auth_token) {
  const url = `${API_CONFIG.baseUrl}/admin_user/${endpoint}`
  try {
    const response = await axios({
      method,
      url,
      headers: {
        ...API_CONFIG.headers,
        'AUTH-TOKEN': `Bearer ${auth_token}`,
      },
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
