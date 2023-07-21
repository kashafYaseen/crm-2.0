import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { Link } from 'react-router-dom'
import { countries_data } from '@/api/admin_user/config/resources/countries'
import { DataTable } from '@admin_user_components/UI/DataTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { CSpinner } from '@coreui/react'

const Countries = () => {
  const [countries, setCountries] = useState([])
  const [totalPlacesRecords, setTotalPlacesRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)

  const fetchCountries = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await countries_data('GET', 'countries', null, {
        page: pageNumber,
        per_page: perPageNumber,
        query: searchQuery,
      })

      setCountries(data)
      setTotalPlacesRecords(totalRecords)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [perPageNumber])

  const [searchQuery, setSearchQuery] = useState('')

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Disable', key: 'disable', td: (row) => row.disable ?? 'N/A' },
    { header: 'Content', key: 'content', td: (row) => row.content ?? 'N/A' },

    {
      header: 'Actions',
      td: (row) => (
        <>
          <Link to="/admin-user/countries/country-form" state={{ record: row }}>
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
    fetchCountries()
  }

  const onPageChangeHandler = (value) => {
    fetchCountries(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  return (
    <div className="display">
      <h2 className="mb-3">Countries</h2>
      <div className="create-button-div">
        <Link to="/admin-user/countries/country-form">
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

      {countries.length > 0 ? (
        <DataTable
          data={countries}
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

export default Countries