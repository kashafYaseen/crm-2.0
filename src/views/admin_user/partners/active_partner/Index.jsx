import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { Link } from 'react-router-dom'
import { Toast } from '@admin_user_components/UI/Toast'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import SalesCommission from './SalesCommission'
import CommissionArrival from './CommissionArrival'
import { partners_data } from '@/api/admin_user/config/resources/partners'
import { partners_commission } from '@/api/admin_user/config/resources/activePartnersCommissions'

const ActivePartners = observer(() => {
  const authStore = useStores()
  const [partners, setPartners] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const [salesPartners, setSalesPartners] = useState([])
  const [salesTotalRecords, setSalesTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [salesPerPageNumber, setSalesPerPageNumber] = useState(10)
  const [salesSearchQuery, setSalesSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)
  const [salesLoading, setSalesLoading] = useState(true)
  const authToken = authStore((state) => state.token)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const { t } = useTranslation()

  const fetchSalesPartners = async (pageNumber) => {
    setSalesLoading(true)
    try {
      const { data, salesTotalRecords } = await partners_data(
        'GET',
        'owners?active=true',
        null,
        {
          page: pageNumber,
          per_page: salesPerPageNumber,
          query: salesSearchQuery,
        },
        authToken,
      )

      setSalesPartners(data)
      setSalesTotalRecords(salesTotalRecords)
      setSalesLoading(false)
    } catch (error) {
      setSalesLoading(false)
      throw error
    }
  }

  const fetchPartners = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await partners_commission(
        'GET',
        'owners/owners_commissions',
        null,
        {
          page: pageNumber,
          per_page: perPageNumber,
          query: searchQuery,
        },
        authToken,
      )

      setPartners(data)
      setTotalRecords(totalRecords)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  useEffect(() => {
    fetchSalesPartners()
  }, [salesPerPageNumber])

  useEffect(() => {
    fetchPartners()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const deleteOwner = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?')
    if (confirmDelete) {
      try {
        const response = await partners_data('DELETE', `owners/${id}`, null, {}, authToken)
        setShowToast(true)
        setErrorType('success')
        setError(t('record_deleted_successfully'))
        fetchSalesPartners()
      } catch (error) {
        console.error('Error deleting the record', error)
      }
    }
  }

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleSalesSearchInputChange = (event) => {
    setSalesSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetchPartners()
  }

  const salesSearchQueryHandler = async () => {
    fetchSalesPartners()
  }

  const onPageChangeHandler = (value) => {
    fetchPartners(value)
  }

  const onSalesPageChangeHandler = (value) => {
    fetchSalesPartners(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  const onSalesPerPageChangeHandler = (value) => {
    setSalesPerPageNumber(value)
  }

  return (
    <div className="display">
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <div className="create-button-div">
        <Link to={`/${i18next.language}/admin-user/new`}>
          <button className="create-button">{t('create_new_house_owner')}</button>
        </Link>
        <Link>
          <button className="send-email-button">{t('send_email_for_price_update')}</button>
        </Link>
      </div>

      <SalesCommission
        salesPartners={salesPartners}
        salesTotalRecords={salesTotalRecords}
        salesLoading={salesLoading}
        salesPerPageNumber={salesPerPageNumber}
        salesSearchQuery={salesSearchQuery}
        handleSalesSearchInputChange={handleSalesSearchInputChange}
        salesSearchQueryHandler={salesSearchQueryHandler}
        onSalesPageChangeHandler={onSalesPageChangeHandler}
        onSalesPerPageChangeHandler={onSalesPerPageChangeHandler}
        deleteOwner={deleteOwner}
      />

      <CommissionArrival
        partners={partners}
        totalRecords={totalRecords}
        loading={loading}
        perPageNumber={perPageNumber}
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        searchQueryHandler={searchQueryHandler}
        onPageChangeHandler={onPageChangeHandler}
        onPerPageChangeHandler={onPerPageChangeHandler}
        deleteOwner={deleteOwner}
      />
    </div>
  )
})

export default ActivePartners
