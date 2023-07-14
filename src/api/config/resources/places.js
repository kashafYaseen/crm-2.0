import { request } from '@/api/admin_user/api'

export const places_data = async (method, endpoint, payload = null) => {
  try {
    const response = await request(method, endpoint, payload)
    if (Array.isArray(response.data)) {
      const extractedData = response.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
        name_nl: attributes.name_nl,
        name_en: attributes.name_en,
        address: attributes.address,
        category: attributes.place_category,
        place_category_id: attributes.place_category_id,
        region: attributes.place_region,
        region_id: attributes.place_region_id,
        country: attributes.place_country,
        country_id: attributes.place_country_id,
        description: attributes.description,
        description_nl: attributes.description_nl,
        description_en: attributes.description_en,
        latitude: attributes.latitude,
        longitude: attributes.longitude,
        short_desc: attributes.short_desc,
        short_desc_nav: attributes.short_desc_nav,
        publish: attributes.publish,
        header_dropdown: attributes.header_dropdown,
        spotlight: attributes.spotlight,
        slug: attributes.slug,
        slug_en: attributes.slug_en,
        slug_nl: attributes.slug_nl,
      }))
      return extractedData
    } else {
      return response
    }
  } catch (error) {
    throw error
  }
}
