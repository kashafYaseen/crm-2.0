import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { CModal, CModalFooter, CModalBody, CButton, CSpinner } from '@coreui/react'
import '@/scss/_custom.scss'
import { Toast } from '@/components/UI/Toast'
import { places_data } from '@/api/admin_user/config/resources/places'
import { DataTable } from '@/components/UI/DataTable'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Index = observer(() => {
  const authStore = useStores()
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [alertType, setAlertType] = useState()
  const [alert, setAlert] = useState()
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const authToken = authStore((state) => state.token)
  const [visible, setVisible] = useState(false)
  const [deletePlaceId, setDeletePlaceId] = useState('')

  const { t } = useTranslation()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_places_data()
  }

  const handleDelete = (id) => {
    setVisible(true)
    setDeletePlaceId(id)
  }

  const deletePlace = async (id) => {
    if (visible) {
      try {
        const response = await places_data('DELETE', `places/${id}`, null, {}, authToken)
        fetch_places_data()
        setVisible(false)
        setShowToast(true)
        setAlertType('success')
        setAlert(t('record_deleted_successfully'))
      } catch (error) {
        console.error('Error Deleting place:', error)
        setVisible(false)
      }
    }
  }

  const columns = [
    { header: t('name'), key: 'name', td: (row) => row.name ?? 'N/A' },
    { header: t('address'), key: 'address', td: (row) => row.address ?? 'N/A' },
    { header: t('category'), key: 'category', td: (row) => row.category ?? 'N/A' },
    { header: t('region'), key: 'region', td: (row) => row.region ?? 'N/A' },
    { header: t('country'), key: 'country', td: (row) => row.country ?? 'N/A' },

    {
      header: t('actions'),
      td: (row) => (
        <>
          <Link
            to={`/${i18next.language}/admin-user/places/edit`}
            state={{ record: row }}
            className="custom-link"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <FontAwesomeIcon onClick={() => handleDelete(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  const fetch_places_data = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await places_data(
        'get',
        'places',
        null,
        {
          page: pageNumber || 1,
          per_page: perPageNumber,
          query: searchQuery,
        },
        authToken,
      )

      setData(data)
      setTotalRecords(totalRecords)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch_places_data()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const onPageChangeHandler = (value) => {
    fetch_places_data(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  return (
    <div className="display">
      <div className="toast-container">
        {showToast && <Toast error={alert} onExited={handleToastHide} type={alertType} />}
      </div>
      <CModal alignment="top" visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>Are you sure you want to delete this record !!</CModalBody>
        <div className="delete-modal-container">
          <CModalFooter>
            <CButton color="secondary" className="close-button" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton className="confirm-button" onClick={() => deletePlace(deletePlaceId)}>
              Delete
            </CButton>
          </CModalFooter>
        </div>
      </CModal>

      <h2 className="mb-3">{t('Places')}</h2>
      <div className="create-button-div">
        <Link to={`/${i18next.language}/admin-user/places/new`}>
          <button className="create-button">{t('create_new_place')}</button>
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
          {t('search')}
        </button>
      </div>

      {data.length > 0 ? (
        <DataTable
          data={data}
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
export default Index
