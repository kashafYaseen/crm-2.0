import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Form from './Form'
import { CSpinner } from '@coreui/react'
import '@/scss/_custom.scss'
import { DataTable } from '@admin_user_components/UI/DataTable'
import { Toast } from '@admin_user_components/UI/Toast'
import { amenity_categories_data } from '@/api/admin_user/config/resources/amenityCategories'

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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_amenity_categories_data()
  }

  const deleteAmenity = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?')
    if (confirmDelete) {
      try {
        const response = await amenity_categories_data('DELETE', `amenity_categories/${id}`)
        setShowToast(true)
        setErrorType('success')
        setError('Record Deleted Successfully')
        fetch_amenity_categories_data()
      } catch (error) {
        console.error('Error Deleting Amenity Category', error)
      }
    }
  }

  const openEditModal = (record) => {
    setSelectedRecord(record)
    setModal(true)
  }

  const columns = [
    { header: 'Name', key: 'name', td: (row) => row.name ?? 'N/A' },
    {
      header: 'Actions',
      td: (row) => (
        <>
          <FontAwesomeIcon onClick={() => openEditModal(row)} icon={faEdit} />
          <FontAwesomeIcon onClick={() => deleteAmenity(row.id)} icon={faTrash} />
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
          page: pageNumber,
          per_page: perPageNumber,
          query: searchQuery,
        },
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
        <ModalHeader toggle={() => setModal(!modal)}>Amenity Category</ModalHeader>
        <ModalBody>
          <Form amenity_category_to_update={selectedRecord} onSubmitCallback={handleFormSubmit} />
        </ModalBody>
      </Modal>

      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <h2 className="mb-3">Amenity Categories</h2>
      <div className="create-button-div">
        <button
          className="create-button"
          onClick={() => {
            setModal(true)
            setSelectedRecord(null)
          }}
        >
          Create New Amenity Category
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
          Search
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
