import React, { useState, useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import Form from './Form'
import { useLocation } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { partners_data } from '@/api/admin_user/config/resources/partners'

const NewRegion = () => {
  const location = useLocation()
  const partner_to_update = location.state && location.state.record
  const [adminData, setAdminData] = useState([])
  const authStore = useStores()
  const authToken = authStore((state) => state.token)

  useEffect(() => {
    const handleCreateNewRecord = async () => {
      try {
        const response = await partners_data('get', 'owners/new', null, {}, authToken)
        setAdminData(response.data)
      } catch (error) {
        console.error('Error fetching Admin Users', error)
      }
    }
    handleCreateNewRecord()
  }, [])

  return (
    <div>
      {adminData.length > 0 ? (
        <Form owner_data={partner_to_update} admins={adminData} />
      ) : (
        <CSpinner color="secondary" variant="grow" />
      )}
    </div>
  )
}

export default NewRegion
