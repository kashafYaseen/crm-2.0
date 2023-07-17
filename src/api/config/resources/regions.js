import { request } from '../../admin_user/api'

export const regions_data = async (method, endpoint, payload = null) => {
  try {
    const regions = await request(method, endpoint, payload)
    try {
      const extractedData = regions.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name_en,
        name_en: attributes.name_en,
        name_nl: attributes.name_nl,
        slug_en: attributes.slug_en,
        slug_nl: attributes.slug_nl,
        title_en: attributes.title_en,
        title_nl: attributes.title_nl,
        region_country: attributes.region_country,
        content: attributes.content_en,
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
      return extractedData
    } catch (error) {
      return error
    }
  } catch (error) {
    throw error
  }
}
