import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import './../../scss/_custom.scss'
import { Link } from 'react-router-dom'
import { regions_data } from '../../api/config/resources/regions'
import { DataTables } from '../../components/UI/dataTables'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const Regions = () => {
  const [regions, setRegions] = useState([])

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const extractedData = await regions_data('GET', 'regions')
        setRegions(extractedData)
      } catch (error) {
        throw error
      }
    }

    fetchRegions()
  }, [])

  const [searchQuery, setSearchQuery] = useState('')

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Country', key: 'region_country', td: (row) => row.region_country ?? 'N/A' },
    { header: 'Content', key: 'content', td: (row) => row.content ?? 'N/A' },
    {
      header: 'Actions',
      td: (row) => (
        <>
          <Link to="/region-form" state={{ record: row }}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        </>
      ),
    },
  ]

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredData = regions.filter((item) => {
    const searchData = Object.values(item).join('').toLowerCase()
    return searchData.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="display">
      <h2 className="mb-3">Regions</h2>
      {regions.length > 0 ? (
        <div>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search..."
              className="custom-search-input"
            />
            <Link to="/region-form">
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

export default Regions
