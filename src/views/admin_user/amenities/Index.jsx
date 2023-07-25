import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import '@/scss/_custom.scss'
import { DataTable } from '@/components/admin_user/UI/DataTable'
import { Toast } from '@/components/UI/Toast'
import { amenities_data } from '@/api/admin_user/config/resources/amenities'
import { Modal, ModalHeader, ModalBody, Badge } from 'reactstrap'
import Form from './Form'
import { CSpinner } from '@coreui/react'

const Index = () => {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errorType, setErrorType] = useState()
  const [error, setError] = useState()
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const [amenityCategories, setAmenityCategories] = useState([])

  const [modal, setModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_amenities_data()
  }

  const deleteAmenity = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?')
    if (confirmDelete) {
      try {
        const response = await amenities_data('DELETE', `amenities/${id}`)
        setShowToast(true)
        setErrorType('success')
        setError('Record Deleted Successfully')
        fetch_amenities_data()
      } catch (error) {
        console.error('Error Deleting Amenity', error)
      }
    }
  }

  const openEditModal = (record) => {
    setSelectedRecord(record)
    handleCreateNewAmenity()
  }

  const openNewModel = () => {
    handleCreateNewAmenity()
    setSelectedRecord(null)
  }

  const handleCreateNewAmenity = async () => {
    const response = await amenities_data('get', 'amenities/new')
    setAmenityCategories(response.data)
    setModal(true)
  }

  const columns = [
    { header: 'Name', key: 'name', td: (row) => row.name ?? 'N/A' },
    { header: 'Category', key: 'amenity_category', td: (row) => row.amenity_category ?? 'N/A' },
    { header: 'Show on filter', key: 'filter_enabled', td: (row) => row.filter_enabled ?? 'N/A' },
    { header: 'Hot', key: 'hot', td: (row) => row.hot ?? 'N/A' },
    { header: 'Icon', key: 'icon', td: (row) => row.icon ?? 'N/A' },

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

  const fetch_amenities_data = async (pageNumber) => {
    setLoading(true)

    try {
      const { data, totalRecords } = await amenities_data('get', 'amenities', null, {
        page: pageNumber,
        per_page: perPageNumber,
        query: searchQuery,
      })

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
        <ModalHeader toggle={() => setModal(!modal)}>Amenities</ModalHeader>
        <ModalBody>
          <Form
            amenity_to_update={selectedRecord}
            onSubmitCallback={handleFormSubmit}
            amenityCategories={amenityCategories}
          />
        </ModalBody>
      </Modal>

      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <h2 className="mb-3">Amenities</h2>
      <div className="create-button-div">
        <button id="createNewRecord" className="create-button" onClick={openNewModel}>
          Create New Amenity
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
