import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { Link } from 'react-router-dom'
import { Toast } from '@admin_user_components/UI/Toast'

import { DataTable } from '@admin_user_components/UI/DataTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { CSpinner, CButton } from '@coreui/react'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import { partners_data } from '@/api/admin_user/config/resources/partners'

const Partners = observer(() => {
  const authStore = useStores()
  const [partners, setPartners] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const authToken = authStore((state) => state.token)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')

  const fetchPartners = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await partners_data(
        'GET',
        'owners',
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

  const handleResendInvite = async (id) => {
    try {
      const res = await partners_data('GET', `owners/${id}/resend_invitation`, null, {}, authToken)
      setShowToast(true)
      setErrorType('success')
      setError(res)
    } catch (error) {
      setShowToast(true)
      setErrorType('danger')
      setError(error)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const [searchQuery, setSearchQuery] = useState('')

  const columns = [
    { header: 'Name', key: 'full_name', td: (row) => row.full_name ?? '' },
    { header: 'Email', key: 'email', td: (row) => row.email ?? '' },
    { header: 'Visited By', key: 'admin_user', td: (row) => row.admin_user ?? '' },
    { header: 'Pre-Payment', key: 'pre_payment', td: (row) => row.pre_payment ?? '' },
    { header: 'Final-Payment', key: 'final_payment', td: (row) => row.final_payment ?? '' },
    {
      header: 'Invitation Status',
      key: 'invitation_accepted_at',
      td: (row) =>
        row.invitation_accepted_at ? (
          'Accepted'
        ) : (
          <>
            <CButton onClick={() => handleResendInvite(row.id)} size="sm" color="secondary">
              Resend Invite
            </CButton>
          </>
        ),
    },
    {
      header: 'Actions',
      td: (row) => (
        <>
          <Link
            to="/admin-user/partners/edit-partner"
            state={{ record: row }}
            className="custom-link"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
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
      <h2 className="mb-3">Partners</h2>
      <div className="create-button-div">
        <Link to="/admin-user/new-partner">
          <button className="create-button">Create New Partner</button>
        </Link>
      </div>

      <div className="search-container">
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
        <div>{loading ? <CSpinner color="secondary" variant="grow" /> : 'No records found'}</div>
      )}
    </div>
  )
})

export default Partners
