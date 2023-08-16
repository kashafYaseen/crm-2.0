import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Form from './Form'
import { CModal, CModalFooter, CModalBody, CButton, CSpinner } from '@coreui/react'
import '@/scss/_custom.scss'
import { DataTable } from '@admin_user_components/UI/DataTable'
import { Toast } from '@admin_user_components/UI/Toast'
import { amenity_categories_data } from '@/api/admin_user/config/resources/amenityCategories'
import { useStores } from '@/context/storeContext'
import { useTranslation } from 'react-i18next'

const Index = () => {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errorType, setErrorType] = useState()
  const [error, setError] = useState()
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const authStore = useStores()
  const authToken = authStore((state) => state.token)
  const [visible, setVisible] = useState(false)
  const [deleteAmenityCategoryId, setDeleteAmenityCategoryId] = useState('')

  const { t } = useTranslation()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_amenity_categories_data()
  }

  const handleDelete = (id) => {
    setVisible(true)
    setDeleteAmenityCategoryId(id)
  }

  const deleteAmenity = async (id) => {
    if (visible) {
      try {
        const response = await amenity_categories_data(
          'DELETE',
          `amenity_categories/${id}`,
          null,
          {},
          authToken,
        )
        setVisible(false)
        setShowToast(true)
        setErrorType('success')
        setError(t('record_deleted_successfully'))
        fetch_amenity_categories_data()
      } catch (error) {
        console.error('Error Deleting Amenity Category', error)
        setVisible(false)
      }
    }
  }

  const openEditModal = (record) => {
    setSelectedRecord(record)
    setModal(true)
  }

  const columns = [
    { header: t('name'), key: 'name', td: (row) => row.name ?? 'N/A' },
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

  const fetch_amenity_categories_data = async (pageNumber) => {
    setLoading(true)

    try {
      const { data, totalRecords } = await amenity_categories_data(
        'get',
        'amenity_categories',
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
    fetch_amenity_categories_data()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const onPageChangeHandler = (value) => {
    fetch_amenity_categories_data(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  const handleFormSubmit = async () => {
    await fetch_amenity_categories_data()
    setModal(false)
    setSelectedRecord(null)
  }

  return (
    <div className="display">
      <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>{t('Amenity Categories')}</ModalHeader>
        <ModalBody>
          <Form amenity_category_to_update={selectedRecord} onSubmitCallback={handleFormSubmit} />
        </ModalBody>
      </Modal>

      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>

      <CModal alignment="top" visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>Are you sure you want to delete this record !!</CModalBody>
        <div className="delete-modal-container">
          <CModalFooter>
            <CButton color="secondary" className="close-button" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton
              className="confirm-button"
              onClick={() => deleteAmenity(deleteAmenityCategoryId)}
            >
              Delete
            </CButton>
          </CModalFooter>
        </div>
      </CModal>

      <h2 className="mb-3">{t('Amenity Categories')}</h2>
      <div className="create-button-div">
        <button
          className="create-button"
          onClick={() => {
            setModal(true)
            setSelectedRecord(null)
          }}
        >
          {t('create_new_amenity_category')}
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
