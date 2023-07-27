import React, { useState, useEffect } from 'react'
import { places_data } from '@/api/admin_user/config/resources/places'
import { CSpinner } from '@coreui/react'
import Form from './Form'
import { useLocation } from 'react-router-dom'
import { useStores } from '@/context/storeContext'

const NewPlace = () => {
  const location = useLocation()
  const place_to_update = location.state && location.state.record
  const [PlaceCategories, setPlaceCategories] = useState([])
  const [countriesData, setCountriesData] = useState([])
  const authStore = useStores()
  const authToken = authStore((state) => state.token)

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await places_data('get', 'places/new', null, {}, authToken)
        setPlaceCategories(response.place_categories)
        setCountriesData(response.countries)
      } catch (error) {
        console.error('Error fetching place categories:', error)
        setPlaceCategories([])
      }
    }
    handleCreateNewRecord()
  }, [])

  return (
    <div>
      {PlaceCategories.length > 0 ? (
        <Form
          placeCategories={PlaceCategories}
          place_to_update={place_to_update}
          countries={countriesData}
        />
      ) : (
        <CSpinner color="secondary" variant="grow" />
      )}
    </div>
  )
}

export default NewPlace
