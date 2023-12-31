import { request } from '../../api'

export const regions_data = async (method, endpoint, payload = null, params = {}, auth_token) => {
  try {
    const regions = await request(method, endpoint, payload, params, auth_token)
    if (Array.isArray(regions.data)) {
      const totalRecords = regions.count
      const extractedData = regions.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
        name_en: attributes.name_en,
        name_nl: attributes.name_nl,
        slug_en: attributes.slug_en,
        slug_nl: attributes.slug_nl,
        title_en: attributes.title_en,
        title_nl: attributes.title_nl,
        region_country: attributes.region_country,
        content: attributes.content,
        content_en: attributes.content_en,
        content_nl: attributes.content_nl,
        meta_title_en: attributes.meta_title_en,
        meta_title_nl: attributes.meta_title_nl,
        published: attributes.published,
        short_desc: attributes.short_desc,
        country_id: attributes.country_id,
        villas_desc: attributes.villas_desc,
        apartment_desc: attributes.apartment_desc,
        bb_desc: attributes.bb_desc,
      }))
      return { data: extractedData, totalRecords: totalRecords }
    } else {
      return regions
    }
  } catch (error) {
    throw error
  }
}
