import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import '@/scss/_custom.scss'
import { Toast } from '@admin_user_components/UI/Toast'
import { places_data } from '@/api/admin_user/config/resources/places'
import { DataTable } from '@admin_user_components/UI/DataTable'
import SessionStore from 'mobx-session'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'

const Index = observer(() => {
  if (SessionStore.initialized) {
    const authStore = useStores()
    const [data, setData] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [errorType, setErrorType] = useState()
    const [error, setError] = useState()
    const [totalPlacesRecords, setTotalPlacesRecords] = useState(0)
    const [perPageNumber, setPerPageNumber] = useState(10)
    const [loading, setLoading] = useState(true)

    const handleSearchInputChange = (event) => {
      setSearchQuery(event.target.value)
    }

    const searchQueryHandler = async () => {
      fetch_places_data()
    }

    const deletePlace = async (id) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this record?')
      if (confirmDelete) {
        try {
          const response = await places_data(
            'DELETE',
            `places/${id}`,
            null,
            null,
            authStore.user.auth_token,
          )
          fetch_places_data()
          setShowToast(true)
          setErrorType('success')
          setError('Record Deleted Successfully')
        } catch (error) {
          console.error('Error Deleting place:', error)
        }
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
            <Link to="/admin-user/places/edit-place" state={{ record: row }}>
              <FontAwesomeIcon icon={faEdit} />
            </Link>
            <FontAwesomeIcon onClick={() => deletePlace(row.id)} icon={faTrash} />
          </>
        ),
      },
    ]

    const fetch_places_data = async (pageNumber) => {
      setLoading(true)
      try {
        const { data, totalRecords } = await places_data(
          'get',
          'places',
          null,
          {
            page: pageNumber,
            per_page: perPageNumber,
            query: searchQuery,
          },
          authStore.user.auth_token,
        )

        setData(data)
        setTotalPlacesRecords(totalRecords)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    useEffect(() => {
      fetch_places_data()
    }, [perPageNumber])

    const handleToastHide = () => {
      setShowToast(false)
    }

    const onPageChangeHandler = (value) => {
      fetch_places_data(value)
    }

    const onPerPageChangeHandler = (value) => {
      setPerPageNumber(value)
    }

    return (
      <div className="display">
        {SessionStore.hasSession ? (
          <>
            <div className="toast-container">
              {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
            </div>

            <h2 className="mb-3">Places</h2>

            <div className="create-button-div">
              <Link to="/admin-user/places/new-place">
                <button className="create-button">Create New Place</button>
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

            {data.length > 0 ? (
              <DataTable
                data={data}
                columns={columns}
                totalPlacesRecords={totalPlacesRecords}
                onPageChange={onPageChangeHandler}
                onPerPageChange={onPerPageChangeHandler}
                perPageNumber={perPageNumber}
                loading={loading}
              />
            ) : (
              <div>
                {loading ? <CSpinner color="secondary" variant="grow" /> : 'No records found'}
              </div>
            )}
          </>
        ) : (
          <p>You are not authorized to access this page</p>
        )}
      </div>
    )
  }
})
export default Index
