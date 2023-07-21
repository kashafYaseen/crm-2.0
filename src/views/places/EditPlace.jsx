import React from 'react'
import { useLocation } from 'react-router-dom'

import Form from './Form'

const NewPlace = () => {
  const location = useLocation()
  const place_to_update = location.state && location.state.record
  return <Form place_to_update={place_to_update} />
}

export default NewPlace
