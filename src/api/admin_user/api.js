import API_CONFIG from '../configs/axiosConfigs'
import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'
import i18next from 'i18next'

export async function request(method, endpoint, data, params = {}, auth_token) {
  const url = `${API_CONFIG.baseUrl}/${i18next.language}/crm/v1/admin_user/${endpoint}`
  try {
    const requestConfig = {
      method,
      url,
      headers: {
        ...API_CONFIG.headers,
        'AUTH-TOKEN': auth_token,
      },
      data,
      params: {},
    }

    if (method.toUpperCase() === 'GET' && Object.keys(params).length > 0) {
      const { query, category, page, per_page } = params

      Object.assign(requestConfig.params, {
        ...(category && { category }),
        ...(query && { query }),
        ...(page && { page }),
        ...(per_page && { per_page }),
      })
    }

    const response = await axios(requestConfig)
    return handleResponse(response)
  } catch (error) {
    throw error
  }
}
