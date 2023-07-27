import React, { useState, useEffect } from 'react'
import { regions_data } from '@/api/admin_user/config/resources/regions'
import { CSpinner } from '@coreui/react'
import { useStores } from '@/context/storeContext'

import Form from './Form'

const NewRegion = () => {
  const [countriesData, setCountriesData] = useState([])
  const authStore = useStores()
  const authToken = authStore((state) => state.token)

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await regions_data('get', 'regions/new', null, {}, authToken)
        setCountriesData(response.data)
      } catch (error) {
        console.error('Error fetching Countries:', error)
      }
    }
    handleCreateNewRecord()
  }, [])

  return (
    <div>
      {countriesData.length > 0 ? (
        <Form countries={countriesData} />
      ) : (
        <CSpinner color="secondary" variant="grow" />
      )}
    </div>
  )
}

export default NewRegion
