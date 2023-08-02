import { request } from '@/api/admin_user/api'

export const experiences_data = async (
  method,
  endpoint,
  payload = null,
  params = {},
  auth_token,
) => {
  try {
    const response = await request(method, endpoint, payload, params, auth_token)
    if (Array.isArray(response.data)) {
      const totalRecords = response.count
      const extractedData = response.data.map(({ id, attributes }) => ({
        name: attributes.name,
        name_nl: attributes.name_nl,
        name_en: attributes.name_en,
        id: id,
        guests: attributes.guests,
        priority: attributes.priority,
        publish: attributes.publish,
        short_desc: attributes.short_desc,
      }))

      return { data: extractedData, totalRecords: totalRecords }
    } else {
      return response
    }
  } catch (error) {
    console.error('ERROR: Amenity Categories', error)
    throw error
  }
}
