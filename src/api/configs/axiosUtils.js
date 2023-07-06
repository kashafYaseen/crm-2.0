// axiosUtils.js

export function handleResponse(response) {
  if (!response.status >= 200 && response.status < 300) {
    throw new Error('API request failed')
  }

  return response.data
}

export function handleError(error) {
  console.error(error)
  throw error
}
