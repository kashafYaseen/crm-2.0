import React, { useState, useEffect } from 'react'
import { regions_data } from '@/api/admin_user/config/resources/regions'
import { CSpinner } from '@coreui/react'
import Form from './Form'
import { useLocation } from 'react-router-dom'
import { useStores } from '@/context/storeContext'

const NewRegion = () => {
  const location = useLocation()
  const region_to_update = location.state && location.state.record
  const [countriesData, setCountriesData] = useState([])
  const authStore = useStores()
  const authToken = authStore((state) => state.token)

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await regions_data(
          'get',
          `regions/${region_to_update.id}/edit`,
          null,
          {},
          authToken,
        )
        setCountriesData(response.data)
      } catch (error) {
        console.error('Error fetching Countries', error)
      }
    }
    handleCreateNewRecord()
  }, [])

  return (
    <div>
      {countriesData.length > 0 ? (
        <Form region_data={region_to_update} countries={countriesData} />
      ) : (
        <CSpinner color="secondary" variant="grow" />
      )}
    </div>
  )
}

export default NewRegion
