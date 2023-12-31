import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { Link } from 'react-router-dom'
import { Toast } from '@/components/UI/Toast'

import { CSpinner, CButton, CCardHeader, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Partners = observer(() => {
  const authStore = useStores()
  const [partners, setPartners] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const authToken = authStore((state) => state.token)
  const [showToast, setShowToast] = useState(false)
  const [alert, setAlert] = useState('')
  const [alertType, setAlertType] = useState('')

  const { t } = useTranslation()

  const handleToastHide = () => {
    setShowToast(false)
  }

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {}

  return (
    <div className="display">
      <div className="toast-container">
        {showToast && <Toast error={alert} onExited={handleToastHide} type={alertType} />}
      </div>
      <CRow>
        <CCol md={3}>
          <CCard>
            <CCardHeader>{t('quicklinks')}</CCardHeader>
            <CCardBody>
              <Link>
                <button className="create-button">{t('new_todo_for_partner')}</button>
              </Link>
              <Link>
                <button className="create-button">{t('new_todo_for_accommodation')}</button>
              </Link>
              <Link to={`/${i18next.language}/admin-user/new`}>
                <button className="create-button">{t('create_new_partner/prospect')}</button>
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardHeader>{t('statistics')}</CCardHeader>
            <CCardBody>
              <p>
                Number of prospects: 29 <br />
                Number of negotiations: 0 <br />
                Not Interested: 18 <br />
                Agreement: 19
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
})

export default Partners
