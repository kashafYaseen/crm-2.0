import React, { useState, useEffect } from 'react'
import { regions_data } from '@/api/admin_user/config/resources/regions'
import { CSpinner } from '@coreui/react'

import Form from './Form'

const NewRegion = () => {
  const [countriesData, setCountriesData] = useState([])

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await regions_data('get', 'regions/new')
        setCountriesData(response.countries)
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
