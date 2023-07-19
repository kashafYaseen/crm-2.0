import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import './../../scss/_custom.scss'
import { Link } from 'react-router-dom'
import { countries_data } from '../../api/config/resources/countries'
import { DataTables } from '../../components/UI/dataTables'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const Countries = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const extractedData = await countries_data('GET', 'countries')
        setCountries(extractedData)
      } catch (error) {
        throw error
      }
    }

    fetchCountries()
  }, [])

  const [searchQuery, setSearchQuery] = useState('')

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Disable', key: 'disable', td: (row) => row.disable ?? 'N/A' },
    { header: 'Content', key: 'content', td: (row) => row.content ?? 'N/A' },

    {
      header: 'Actions',
      td: (row) => (
        <>
          <Link to="/country-form" state={{ record: row }}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        </>
      ),
    },
  ]

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredData = countries.filter((item) => {
    const searchData = Object.values(item).join('').toLowerCase()
    return searchData.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="display">
      <h2 className="mb-3">Countries</h2>
      {countries.length > 0 ? (
        <div>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search..."
              className="custom-search-input"
            />
            <Link to="/country-form">
              <button className="create-button">Create</button>
            </Link>
          </div>
          <DataTables data={filteredData} columns={columns} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Countries
