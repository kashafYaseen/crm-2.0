import React from 'react'
import Form from './Form'
import { useLocation } from 'react-router-dom'

const EditRegion = () => {
  const location = useLocation()
  const country_to_update = location.state && location.state.record
  return (
    <div>
      <Form country_to_update={country_to_update} />
    </div>
  )
}

export default EditRegion
