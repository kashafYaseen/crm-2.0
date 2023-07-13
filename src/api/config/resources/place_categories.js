import { request } from '@/api/admin_user/api'

export const place_categories_data = async (method, endpoint, payload = null) => {
  try {
    const response = await request(method, endpoint, payload)
    if (Array.isArray(response.data)) {
      const extractedData = response.data.map(({ id, attributes }) => ({
        name: attributes.name,
        id: id,
        color_code: attributes.color_code,
        name_nl: attributes.name_nl,
        name_en: attributes.name_en,
      }))
      return extractedData
    } else {
      return response
    }
  } catch (error) {
    console.error('ERROR places categories', error)
    throw error
  }
}
