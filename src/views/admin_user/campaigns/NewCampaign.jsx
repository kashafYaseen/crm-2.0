import React, { useState, useEffect } from 'react'
import { campaigns_data } from '@/api/admin_user/config/resources/campaigns'
import { CSpinner } from '@coreui/react'
import Form from './Form'
import { useStores } from '@/context/storeContext'

const NewCampaign = () => {
  const [countries, setCountries] = useState([])

  const authStore = useStores()
  const authToken = authStore((state) => state.token)

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await campaigns_data('get', 'campaigns/new', null, {}, authToken)
        setCountries(response.countries)
      } catch (error) {
        console.error('Error fetching Countries:', error)
        setCountries([])
      }
    }
    handleCreateNewRecord()
  }, [])

  return (
    <div>
      {countries.length > 0 ? (
        <Form countries={countries} />
      ) : (
        <CSpinner color="secondary" variant="grow" />
      )}
    </div>
  )
}

export default NewCampaign
