import axios from 'axios'

const API_CONFIG = {
  baseUrl: 'http://localhost:3000/en/crm/v1/admin_user/sessions',
}

export async function authenticateUser(username, password) {
  const url = `${API_CONFIG.baseUrl}/authenticate`

  try {
    const response = await axios.post(url, { username, password })

    // Save the access token to local storage or state
    const accessToken = response.data.accessToken
    localStorage.setItem('accessToken', accessToken)

    return true // Authentication successful
  } catch (error) {
    throw new Error('User authentication failed')
  }
}

export function getAccessToken() {
  // Retrieve the access token from local storage or state
  return localStorage.getItem('accessToken')
}

export function isAuthenticated() {
  // Check if the user is authenticated
  const accessToken = getAccessToken()
  return accessToken !== null
}
