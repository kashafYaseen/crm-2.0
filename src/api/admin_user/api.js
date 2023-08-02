import { useStores } from '@/context/storeContext'
import API_CONFIG from '../configs/axiosConfigs'
import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'
import i18next from 'i18next'

export async function request(method, endpoint, data, params = {}, auth_token) {
  const url = `${API_CONFIG.baseUrl}/${i18next.language}/crm/v1/admin_user/${endpoint}`
  try {
    const response = await axios({
      method,
      url,
      headers: {
        ...API_CONFIG.headers,
        'AUTH-TOKEN': `${auth_token}`,
      },
      data,
      params: {
        per_page: params.per_page || 10,
        page: params.page || 1,
        query: params.query,
      },
    })

    return handleResponse(response)
  } catch (error) {
    throw error
  }
}
