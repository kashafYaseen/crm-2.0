import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { Link } from 'react-router-dom'
import { countries_data } from '@/api/admin_user/config/resources/countries'
import { DataTable } from '@admin_user_components/UI/DataTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { CSpinner } from '@coreui/react'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Countries = observer(() => {
  const [countries, setCountries] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const authStore = useStores()
  const authToken = authStore((state) => state.token)
  const { t } = useTranslation()

  const fetchCountries = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await countries_data(
        'GET',
        'countries',
        null,
        {
          page: pageNumber || 1,
          per_page: perPageNumber,
          query: searchQuery,
        },
        authToken,
      )

      setCountries(data)
      setTotalRecords(totalRecords)
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
    { header: 'Disable', key: 'disable', td: (row) => (row.disable ? 'True' : 'False') },
    {
      header: 'Content',
      key: 'content',
      td: (row) => <div dangerouslySetInnerHTML={{ __html: row.content ?? 'N/A' }} />,
    },
    {
      header: t('actions'),
      td: (row) => (
        <>
          <Link
            to={`/${i18next.language}/admin-user/countries/edit`}
            state={{ record: row }}
            className="custom-link"
          >
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
      <h2 className="mb-3">{t('Countries')}</h2>
      <div className="create-button-div">
        <Link to={`/${i18next.language}/admin-user/countries/new`}>
          <button className="create-button">{t('create_new_country')}</button>
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
          {t('search')}
        </button>
      </div>

      {countries.length > 0 ? (
        <DataTable
          data={countries}
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
})

export default Countries
