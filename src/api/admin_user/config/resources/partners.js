import { request } from '../../api'

export const partners_data = async (method, endpoint, payload = null, params = {}, auth_token) => {
  try {
    const partners = await request(method, endpoint, payload, params, auth_token)
    if (Array.isArray(partners.data)) {
      const totalRecords = partners.count
      const extractedData = partners.data.map(({ id, attributes }) => ({
        id: id,
        full_name: attributes.full_name,
        admin_user: attributes.admin_user_name,
        first_name: attributes.first_name,
        last_name: attributes.last_name,
        email: attributes.email,
        pre_payment: attributes.pre_payment,
        final_payment: attributes.final_payment,
        invitation_accepted_at: attributes.invitation_accepted_at,
      }))
      return { data: extractedData, totalRecords: totalRecords }
    } else {
      return partners
    }
  } catch (error) {
    throw error
  }
}
