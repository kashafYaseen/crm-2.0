import { request } from '../../api'

export const partners_commission = async (
  method,
  endpoint,
  payload = null,
  params = {},
  auth_token,
) => {
  try {
    const partners_commission = await request(method, endpoint, payload, params, auth_token)
    if (Array.isArray(partners_commission.data)) {
      const totalRecords = partners_commission.count
      const extractedOwnersCommissionsData = partners_commission.data.map(({ id, attributes }) => ({
        id: id,
        business_name: attributes.business_name,
        country_name: attributes.country_name,
        region_name: attributes.region_name,
        commission_previous_7_year: attributes.commission_previous_7_year,
        commission_previous_6_year: attributes.commission_previous_6_year,
        commission_previous_5_year: attributes.commission_previous_5_year,
        commission_previous_4_year: attributes.commission_previous_4_year,
        commission_previous_3_year: attributes.commission_previous_3_year,
        commission_previous_2_year: attributes.commission_previous_2_year,
        commission_previous_1_year: attributes.commission_previous_1_year,
        commission_current_year: attributes.commission_current_year,
        commission_next_1_year: attributes.commission_next_1_year,
      }))

      return {
        data: extractedOwnersCommissionsData,
        totalRecords: totalRecords,
      }
    } else {
      return partners_commission
    }
  } catch (error) {
    throw error
  }
}
