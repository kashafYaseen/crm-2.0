import React, { useState, useEffect } from 'react'
import { partners_data } from '@/api/admin_user/config/resources/partners'
import { CSpinner } from '@coreui/react'
import { useStores } from '@/context/storeContext'

import Form from './Form'

const NewPartner = () => {
  const [adminData, setAdminData] = useState([])
  const [countryData, setCountryData] = useState([])
  const [regionData, setRegionData] = useState([])

  const authStore = useStores()
  const authToken = authStore((state) => state.token)

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await partners_data('get', 'owners/new', null, {}, authToken)
        setCountryData(response.countries)
        setRegionData(response.regions)
        setAdminData(response.admin_users)
      } catch (error) {
        console.error('Error fetching Admin Users:', error)
      }
    }
    handleCreateNewRecord()
  }, [])

  return (
    <div>
      {adminData.length > 0 ? (
        <Form admins={adminData} countries={countryData} regions={regionData} />
      ) : (
        <CSpinner color="secondary" variant="grow" />
      )}
    </div>
  )
}

export default NewPartner
