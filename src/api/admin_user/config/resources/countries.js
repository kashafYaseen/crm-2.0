import { request } from '../../api'

export const countries_data = async (method, endpoint, payload = null, params = {}, auth_token) => {
  try {
    const countries = await request(method, endpoint, payload, params, auth_token)

    if (Array.isArray(countries.data)) {
      const totalRecords = countries.count
      const extractedData = countries.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
        name_en: attributes.name_en,
        name_nl: attributes.name_nl,
        slug_en: attributes.slug_en,
        slug_nl: attributes.slug_nl,
        content: attributes.content,
        content_en: attributes.content_en,
        content_nl: attributes.content_nl,
        title_en: attributes.title_en,
        title_nl: attributes.title_nl,
        meta_title_en: attributes.meta_title_en,
        meta_title_nl: attributes.meta_title_nl,
        disable: attributes.disable,
        villas_desc: attributes.villas_desc,
        apartment_desc: attributes.apartment_desc,
        bb_desc: attributes.bb_desc,
        dropdown: attributes.dropdown,
        sidebar: attributes.sidebar,
      }))
      return { data: extractedData, totalRecords: totalRecords }
    } else {
      return countries
    }
  } catch (error) {
    throw error
  }
}
