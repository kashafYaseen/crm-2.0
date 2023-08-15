import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { Link } from 'react-router-dom'
import { Toast } from '@admin_user_components/UI/Toast'

import { DataTable } from '@admin_user_components/UI/DataTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import {
  CSpinner,
  CCardTitle,
  CPopover,
  CButton,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import { partners_data } from '@/api/admin_user/config/resources/partners'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const InactivePartners = observer(() => {
  const authStore = useStores()
  const [partners, setPartners] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const authToken = authStore((state) => state.token)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const { t } = useTranslation()

  const fetchPartners = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await partners_data(
        'GET',
        'owners?active=false',
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
        fetchPartners()
      } catch (error) {
        console.error('Error deleting the record', error)
      }
    }
  }

  const [searchQuery, setSearchQuery] = useState('')

  const columns = [
    { header: t('business_name'), key: 'business_name', td: (row) => row.business_name ?? '' },
    {
      header: t('details'),
      td: (row) => (
        <>
          <CPopover
            title={t('owner_details')}
            content={
              <div>
                <p>
                  <b>Name:</b> {row.full_name}
                </p>
                <p>
                  <b>Email:</b> {row.email}
                </p>
                <p>
                  <b>Business Name:</b> {row.business_name}
                </p>
              </div>
            }
            trigger="focus"
            placement="right"
          >
            <Link>{t('details')}</Link>
          </CPopover>
        </>
      ),
    },
    {
      header: t('contract'),
      key: 'email_boolean',
      td: (row) => {
        return (
          <span className={`badge ${row.email_boolean ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.email_boolean ? 'True' : 'False'}
          </span>
        )
      },
    },
    { header: t('email_translation'), key: 'email', td: (row) => row.email ?? '' },
    {
      header: t('interest'),
      key: 'not_interested',
      td: (row) => {
        return (
          <span className={`badge ${row.not_interested ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.not_interested ? 'Yes' : 'No'}
          </span>
        )
      },
    },
    {
      header: t('actions'),
      td: (row) => (
        <>
          <Link
            to={`/${i18next.language}/admin-user/edit`}
            state={{ record: row }}
            className="custom-link"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <FontAwesomeIcon onClick={() => deleteOwner(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetchPartners()
  }

  const onPageChangeHandler = (value) => {
    fetchPartners(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
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
      <CRow className="mt-2">
        <CCard>
          <CCardTitle className="mt-4">{t('sales_commission')}</CCardTitle>
          <hr />
          <div className="custom-search-container ">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search..."
              className="custom-search-input"
            />
            <button className="create-button" onClick={searchQueryHandler}>
              Search
            </button>
          </div>

          {partners.length > 0 ? (
            <DataTable
              data={partners}
              columns={columns}
              totalRecords={totalRecords}
              onPageChange={onPageChangeHandler}
              onPerPageChange={onPerPageChangeHandler}
              perPageNumber={perPageNumber}
              loading={loading}
            />
          ) : (
            <div>
              {loading ? <CSpinner color="secondary" variant="grow" /> : 'No records found'}
            </div>
          )}
        </CCard>
      </CRow>
    </div>
  )
})

export default InactivePartners
