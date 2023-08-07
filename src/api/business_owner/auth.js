import { handleResponse, handleError } from '../configs/axiosUtils'
import axios from 'axios'
import i18next from 'i18next'

export async function authentication(method, endpoint, data) {
  const url = `http://localhost:3000/${i18next.language}/crm/v1/owner/${endpoint}`

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
