import { request } from '@/api/admin_user/api'

export const countries_data = async (method, endpoint, payload = null) => {
  try {
    const places = await request(method, endpoint)
    const extractedData = places.data.map(({ id, attributes }) => ({
      name: attributes.name,
      id: id,
    }))
    return extractedData
  } catch (error) {
    console.error(error)
    return error
  }
}
