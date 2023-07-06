// axiosConfig.js
import { getAccessToken } from '../admin_user/auth.js'

const accessToken = getAccessToken()
const API_CONFIG = {
  baseUrl: 'http://localhost:3000/en/crm/v1',
  headers: {
    'Content-Type': 'application/json',
    'AUTH-TOKEN': `Bearer ${accessToken}`,
    // Add any additional headers if required
  },
}

export default API_CONFIG
