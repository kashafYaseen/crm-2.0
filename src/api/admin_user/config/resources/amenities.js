import { request } from '@/api/admin_user/api'

export const amenities_data = async (method, endpoint, payload = null, params = {}) => {
  try {
    const response = await request(method, endpoint, payload, params)

    if (Array.isArray(response.data)) {
      const totalRecords = response.count
      const extractedData = response.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
        name_nl: attributes.name_nl,
        name_en: attributes.name_en,
        hot: attributes.hot ? 'YES' : 'NO',
        icon: attributes.icon,
        filter_enabled: attributes.filter_enabled ? 'YES' : 'NO',
        slug: attributes.slug,
        slug_en: attributes.slug_en,
        slug_nl: attributes.slug_nl,
        amenity_category: attributes.amenity_category,
        amenity_category_id: attributes.amenity_category_id,
      }))
      return { data: extractedData, totalRecords: totalRecords }
    } else {
      return response
    }
  } catch (error) {
    throw error
  }
}
