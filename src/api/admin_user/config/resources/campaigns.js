import { request } from '@/api/admin_user/api'

export const campaigns_data = async (method, endpoint, payload = null, params = {}, auth_token) => {
  try {
    const response = await request(method, endpoint, payload, params, auth_token)
    if (Array.isArray(response.data)) {
      const totalRecords = response.count

      const extractedData = response.data.map(({ id, attributes }) => ({
        id: id,
        title: attributes.title,
        title_en: attributes.title_en,
        title_nl: attributes.title_nl,
        url: attributes.url,
        collection: attributes.collection,
        popular_search: attributes.popular_search,
        footer: attributes.footer,
        top_menu: attributes.top_menu,
        homepage: attributes.homepage,
        popular_homepage: attributes.popular_homepage,
        region: attributes.region_name,
        country: attributes.country_name,
        region_id: attributes.region_id,
        country_id: attributes.country_id,
        min_price: attributes.min_price,
        max_price: attributes.max_price,
        to: attributes.to,
        from: attributes.from,
        description_nl: attributes.description_nl,
        description_en: attributes.description_en,
        category: attributes.category,
      }))
      return { data: extractedData, totalRecords: totalRecords }
    } else if (response.countries) {
      const countriesData = response.countries.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
      }))
      return { countries: countriesData }
    } else if (response.amenities) {
      const amenitiesData = response.amenities.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
      }))
      return { data: amenitiesData }
    } else if (response.experiences) {
      const experiencesData = response.experiences.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
      }))
      return { data: experiencesData }
    } else if (response.guests) {
      const guestsData = response.guests.map((guest) => ({
        id: guest,
        name: guest.toString(),
      }))
      return { data: guestsData }
    } else if (response.lodging_categories) {
      const LodgingCategoriesData = response.lodging_categories.map((guest) => ({
        id: id,
        name: attributes.name,
      }))
      return { data: LodgingCategoriesData }
    } else {
      return response
    }
  } catch (error) {
    console.error('ERROR: Campaigns', error)
    throw error
  }
}
