import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import './../../scss/_custom.scss'
import { DataTables } from '@/components/UI/dataTables'
import { Toast } from '@/components/UI/Toast'
import { place_categories_data } from '@/api/config/resources/place_categories'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Form from './Form'

const Index = () => {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errorType, setErrorType] = useState()
  const [error, setError] = useState()

  const [modal, setModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredData = data.filter((item) => {
    const searchData = Object.values(item).join('').toLowerCase()
    return searchData.includes(searchQuery.toLowerCase())
  })

  const deletePlace = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?')
    if (confirmDelete) {
      try {
        const response = await place_categories_data('DELETE', `place_categories/${id}`)
        setShowToast(true)
        setErrorType('success')
        setError('Record Deleted Successfully')
        fetch_place_categories_data()
      } catch (error) {
        console.error('Error updating place:', error)
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
          <FontAwesomeIcon onClick={() => deletePlace(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  const fetch_place_categories_data = async () => {
    try {
      const extractedData = await place_categories_data('get', 'place_categories')
      setData(extractedData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetch_place_categories_data()
  }, [])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const handleFormSubmit = async () => {
    await fetch_place_categories_data()
    setModal(false)
    setSelectedRecord(null)
  }

  return (
    <div className="display">
      <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>Place Category</ModalHeader>
        <ModalBody>
          <Form place_category_to_update={selectedRecord} onSubmitCallback={handleFormSubmit} />
        </ModalBody>
      </Modal>

      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <h2 className="mb-3">Place Categories</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search..."
          className="custom-search-input"
        />

        <button
          className="create-button"
          onClick={() => {
            setModal(true)
            setSelectedRecord(null)
          }}
        >
          Create
        </button>
      </div>
      {data.length > 0 ? <DataTables data={filteredData} columns={columns} /> : <p>Loading...</p>}
    </div>
  )
}

export default Index
