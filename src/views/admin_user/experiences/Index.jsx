import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import '@/scss/_custom.scss'
import { DataTable } from '@/components/admin_user/UI/DataTable'
import { Toast } from '@admin_user_components/UI/Toast'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Form from './Form'
import { CModal, CModalFooter, CModalBody, CButton, CSpinner } from '@coreui/react'
import { experiences_data } from '@/api/admin_user/config/resources/experiences'
import { useStores } from '@/context/storeContext'
import { useTranslation } from 'react-i18next'

const Index = () => {
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
  const [deleteExperienceId, setDeleteExperienceId] = useState('')

  const [modal, setModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const { t } = useTranslation()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_experiences_data()
  }

  const handleDelete = (id) => {
    setVisible(true)
    setDeleteExperienceId(id)
  }

  const deleteExperience = async (id) => {
    if (visible) {
      try {
        const response = await experiences_data('DELETE', `experiences/${id}`, null, {}, authToken)
        setVisible(false)
        setShowToast(true)
        setAlertType('success')
        setAlert(t('record_deleted_successfully'))
        fetch_experiences_data()
      } catch (error) {
        console.error('Error Deleting Experience Category', error)
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
    { header: t('experience_trans.guests'), key: 'guests', td: (row) => row.guests ?? 'N/A' },
    { header: t('experience_trans.priority'), key: 'priority', td: (row) => row.priority ?? 'N/A' },
    {
      header: t('publish'),
      key: 'publish',
      td: (row) => {
        return (
          <span className={`badge ${row.publish ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.publish ? 'Yes' : 'No'}
          </span>
        )
      },
    },

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

  const fetch_experiences_data = async (pageNumber) => {
    setLoading(true)

    try {
      const { data, totalRecords } = await experiences_data(
        'get',
        'experiences',
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
    fetch_experiences_data()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const onPageChangeHandler = (value) => {
    fetch_experiences_data(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  const handleFormSubmit = async () => {
    await fetch_experiences_data()
    setModal(false)
    setSelectedRecord(null)
  }

  return (
    <div className="display">
      <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>{t('experiences')}</ModalHeader>
        <ModalBody>
          <Form experience_to_update={selectedRecord} onSubmitCallback={handleFormSubmit} />
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
            <CButton
              className="confirm-button"
              onClick={() => deleteExperience(deleteExperienceId)}
            >
              Delete
            </CButton>
          </CModalFooter>
        </div>
      </CModal>

      <h2 className="mb-3">{t('experiences')}</h2>
      <div className="create-button-div">
        <button
          className="create-button"
          onClick={() => {
            setModal(true)
            setSelectedRecord(null)
          }}
        >
          {t('create_new_experience')}
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
        <div>{loading ? <CSpinner color="secondary" variant="grow" /> : t('no_record_found')}</div>
      )}
    </div>
  )
}

export default Index
