import React, { useEffect, useState } from 'react'
import ReactFlexyTable from 'react-flexy-table'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './../../scss/_custom.scss'
import { places_data } from '@/api/config/resources/places'
import { DataTables } from '@/components/UI/dataTables'
import { Toast } from '@/components/UI/Toast'

const Index = () => {
  const [data, setData] = useState([])
  // const [selectedRecord, setSelectedRecord] = useState()
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errorType, setErrorType] = useState()
  const [error, setError] = useState()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredData = data.filter((item) => {
    const searchData = Object.values(item).join('').toLowerCase()
    return searchData.includes(searchQuery.toLowerCase())
  })

  const deletePlace = async (id) => {
    try {
      const response = await places_data('DELETE', `places/${id}`)
      fetch_places_data()
      setShowToast(true)
      setErrorType('danger')
      setError('Record Deleted Successfully')
    } catch (error) {
      console.error('Error updating place:', error)
    }
  }

  const columns = [
    { header: 'Name', key: 'name', td: (row) => row.name ?? 'N/A' },
    { header: 'Address', key: 'address', td: (row) => row.address ?? 'N/A' },
    { header: 'Category', key: 'category', td: (row) => row.category ?? 'N/A' },
    { header: 'Region', key: 'region', td: (row) => row.region ?? 'N/A' },
    { header: 'Country', key: 'country', td: (row) => row.country ?? 'N/A' },

    {
      header: 'Actions',
      td: (row) => (
        <>
          <Link to="/edit-place" state={{ record: row }}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <FontAwesomeIcon onClick={() => deletePlace(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  const fetch_places_data = async () => {
    try {
      const extractedData = await places_data('get', 'places')
      setData(extractedData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetch_places_data()
  }, [])

  const handleToastHide = () => {
    setShowToast(false)
  }

  return (
    <div className="display">
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>

      <h2 className="mb-3">Places</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search..."
          className="custom-search-input"
        />
        <Link to="/new-place">
          <button className="create-button">Create</button>
        </Link>
      </div>
      {data.length > 0 ? <DataTables data={filteredData} columns={columns} /> : <p>Loading...</p>}
    </div>
  )
}

export default Index
