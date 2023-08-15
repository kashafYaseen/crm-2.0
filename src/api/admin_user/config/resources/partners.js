import { request } from '../../api'

export const partners_data = async (method, endpoint, payload = null, params = {}, auth_token) => {
  try {
    const partners = await request(method, endpoint, payload, params, auth_token)
    if (Array.isArray(partners.data)) {
      const totalRecords = partners.count
      const extractedOwnersData = partners.data.map(({ id, attributes }) => ({
        id: id,
        admin_user_id: attributes.admin_user_id,
        full_name: attributes.full_name,
        admin_user: attributes.admin_user_name,
        first_name: attributes.first_name,
        last_name: attributes.last_name,
        email: attributes.email,
        email_boolean: attributes.email_boolean,
        business_name: attributes.business_name,
        account_id: attributes.account_id,
        not_interested: attributes.not_interested,
        automated_availability: attributes.automated_availability,
        updating_availability: attributes.updating_availability,
        country_name: attributes.country_name,
        region_name: attributes.region_name,
        language: attributes.language,
        invitation_accepted_at: attributes.invitation_accepted_at,
      }))

      return {
        data: extractedOwnersData,
        totalRecords: totalRecords,
      }
    } else if (partners.countries) {
      const countriesData = partners.countries.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
        name_nl: attributes.name_nl,
        name_en: attributes.name_en,
      }))
      const regionsData = partners.regions.data.map(({ id, attributes }) => ({
        id: id,
        name: attributes.name,
        name_nl: attributes.name_nl,
        name_en: attributes.name_en,
      }))
      const adminsData = partners.admin_users.data.map(({ id, attributes }) => ({
        id: id,
        full_name: attributes.full_name,
      }))

      return { countries: countriesData, regions: regionsData, admin_users: adminsData }
    } else {
      return partners
    }
  } catch (error) {
    throw error
  }
}
