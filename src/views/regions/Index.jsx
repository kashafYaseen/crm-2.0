import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import './../../scss/_custom.scss'
import { Link } from 'react-router-dom'
import { regions_data } from '../../api/config/resources/regions'
import { DataTable } from '@/components/UI/DataTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { CSpinner } from '@coreui/react'

const Regions = () => {
  const [regions, setRegions] = useState([])
  const [totalPlacesRecords, setTotalPlacesRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)

  const fetchRegions = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await regions_data('GET', 'regions', null, {
        page: pageNumber,
        per_page: perPageNumber,
        query: searchQuery,
      })

      setRegions(data)
      setTotalPlacesRecords(totalRecords)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  useEffect(() => {
    fetchRegions()
  }, [perPageNumber])

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

  const searchQueryHandler = async () => {
    fetchRegions()
  }

  const onPageChangeHandler = (value) => {
    fetchRegions(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  return (
    <div className="display">
      <h2 className="mb-3">Regions</h2>
      <div className="create-button-div">
        <Link to="/region-form">
          <button className="create-button">Create</button>
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
          Search
        </button>
      </div>

      {regions.length > 0 ? (
        <DataTable
          data={regions}
          columns={columns}
          totalPlacesRecords={totalPlacesRecords}
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

export default Regions
