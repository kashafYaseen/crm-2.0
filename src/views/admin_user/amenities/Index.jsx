import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import '@/scss/_custom.scss'
import { DataTable } from '@/components/admin_user/UI/DataTable'
import { Toast } from '@/components/admin_user/UI/Toast'
import { amenities_data } from '@/api/admin_user/config/resources/amenities'
import { Modal, ModalHeader, ModalBody, Badge } from 'reactstrap'
import Form from './Form'
import { CModal, CModalFooter, CModalBody, CButton, CSpinner } from '@coreui/react'
import { useStores } from '@/context/storeContext'
import { useTranslation } from 'react-i18next'

const Index = () => {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [alertType, setAlertType] = useState()
  const [alert, setAlert] = useState()
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const [amenityCategories, setAmenityCategories] = useState([])

  const [visible, setVisible] = useState(false)
  const [deleteAmenityId, setDeleteAmenityId] = useState('')

  const [modal, setModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const authStore = useStores()
  const authToken = authStore((state) => state.token)
  const { t } = useTranslation()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_amenities_data()
  }

  const handleDelete = (id) => {
    setVisible(true)
    setDeleteAmenityId(id)
  }

  const deleteAmenity = async (id) => {
    if (visible) {
      try {
        const response = await amenities_data('DELETE', `amenities/${id}`, null, {}, authToken)
        setVisible(false)
        setShowToast(true)
        setAlertType('success')
        setAlert(t('record_deleted_successfully'))
        fetch_amenities_data()
      } catch (error) {
        console.error('Error Deleting Amenity', error)
        setVisible(false)
      }
    }
  }

  const openEditModal = (record) => {
    setSelectedRecord(record)
    handleCreateNewAmenity(`${record.id}/edit`)
  }

  const openNewModel = () => {
    handleCreateNewAmenity('new')
    setSelectedRecord(null)
  }

  const handleCreateNewAmenity = async (endpoint) => {
    const response = await amenities_data('get', `amenities/${endpoint}`, null, {}, authToken)
    setAmenityCategories(response.data)
    setModal(true)
  }

  const columns = [
    { header: t('name'), key: 'name', td: (row) => row.name ?? 'N/A' },
    {
      header: t('category'),
      key: 'amenity_category',
      td: (row) => row.amenity_category ?? 'N/A',
    },
    {
      header: t('amenity.show_on_filter'),
      key: 'filter_enabled',
      td: (row) => row.filter_enabled ?? 'N/A',
    },
    { header: t('amenity.hot'), key: 'hot', td: (row) => row.hot ?? 'N/A' },
    { header: t('icon'), key: 'icon', td: (row) => row.icon ?? 'N/A' },

    {
      header: t('actions'),
      td: (row) => (
        <>
          <FontAwesomeIcon onClick={() => openEditModal(row)} icon={faEdit} />
          <FontAwesomeIcon onClick={() => handleDelete(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  const fetch_amenities_data = async (pageNumber) => {
    setLoading(true)

    try {
      const { data, totalRecords } = await amenities_data(
        'get',
        'amenities',
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
    fetch_amenities_data()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const onPageChangeHandler = (value) => {
    fetch_amenities_data(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  const handleFormSubmit = async () => {
    await fetch_amenities_data()
    setModal(false)
    setSelectedRecord(null)
  }

  return (
    <div className="display">
      <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>{t('amenities')}</ModalHeader>
        <ModalBody>
          <Form
            amenity_to_update={selectedRecord}
            onSubmitCallback={handleFormSubmit}
            amenityCategories={amenityCategories}
          />
        </ModalBody>
      </Modal>

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
            <CButton className="confirm-button" onClick={() => deleteAmenity(deleteAmenityId)}>
              Delete
            </CButton>
          </CModalFooter>
        </div>
      </CModal>

      <h2 className="mb-3">{t('amenities')}</h2>
      <div className="create-button-div">
        <button id="createNewRecord" className="create-button" onClick={openNewModel}>
          {t('create_new_amenity')}
        </button>
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
}

export default Index
