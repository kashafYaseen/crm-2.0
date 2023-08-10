import React, { useEffect, useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import '@/scss/_custom.scss'
import { Toast } from '@admin_user_components/UI/Toast'
import { campaigns_data } from '@/api/admin_user/config/resources/campaigns'
import { DataTable } from '@admin_user_components/UI/DataTable'
import { useStores } from '@/context/storeContext'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Index = () => {
  const authStore = useStores()

  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errorType, setErrorType] = useState()
  const [error, setError] = useState()
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPageNumber, setPerPageNumber] = useState(10)
  const [loading, setLoading] = useState(true)
  const authToken = authStore((state) => state.token)
  const { t } = useTranslation()

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const searchQueryHandler = async () => {
    fetch_campaigns_data()
  }

  const deleteCampaign = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?')
    if (confirmDelete) {
      try {
        const response = await campaigns_data('DELETE', `campaigns/${id}`, null, {}, authToken)
        fetch_campaigns_data()
        setShowToast(true)
        setErrorType('success')
        setError(t('record_deleted_successfully'))
      } catch (error) {
        console.error('Error Deleting Campaign:', error)
      }
    }
  }

  const columns = [
    { header: t('title'), key: 'title', td: (row) => row.title ?? 'N/A' },
    { header: t('country'), key: 'country', td: (row) => row.country ?? 'N/A' },
    { header: t('region'), key: 'region', td: (row) => row.region ?? 'N/A' },
    { header: t('campaigns_trans.url'), key: 'url', td: (row) => row.url ?? 'N/A' },
    {
      header: t('campaigns_trans.auto_complete'),
      key: 'popular_homepage',
      td: (row) => {
        return (
          <span
            className={`badge ${row.popular_homepage ? 'badge bg-success' : 'badge bg-danger'}`}
          >
            {row.popular_homepage ? 'True' : 'False'}
          </span>
        )
      },
    },
    {
      header: t('campaigns_trans.collection'),
      key: 'collection',
      td: (row) => {
        return (
          <span className={`badge ${row.collection ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.collection ? 'True' : 'False'}
          </span>
        )
      },
    },
    {
      header: t('campaigns_trans.footer'),
      key: 'footer',
      td: (row) => {
        return (
          <span className={`badge ${row.footer ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.footer ? 'True' : 'False'}
          </span>
        )
      },
    },
    {
      header: t('campaigns_trans.top_menu'),
      key: 'top_menu',
      td: (row) => {
        return (
          <span className={`badge ${row.top_menu ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.top_menu ? 'True' : 'False'}
          </span>
        )
      },
    },
    {
      header: t('campaigns_trans.homepage'),
      key: 'homepage',
      td: (row) => {
        return (
          <span className={`badge ${row.homepage ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.homepage ? 'True' : 'False'}
          </span>
        )
      },
    },

    {
      header: t('actions'),
      td: (row) => (
        <>
          <Link to={`/${i18next.language}/admin-user/campaigns/edit`} state={{ record: row }}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <FontAwesomeIcon onClick={() => deleteCampaign(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  const fetch_campaigns_data = async (pageNumber) => {
    setLoading(true)
    try {
      const { data, totalRecords } = await campaigns_data(
        'get',
        'campaigns',
        null,
        {
          page: pageNumber,
          per_page: perPageNumber,
          query: searchQuery,
        },
        authToken,
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
    fetch_campaigns_data()
  }, [perPageNumber])

  const handleToastHide = () => {
    setShowToast(false)
  }

  const onPageChangeHandler = (value) => {
    fetch_campaigns_data(value)
  }

  const onPerPageChangeHandler = (value) => {
    setPerPageNumber(value)
  }

  return (
    <div className="display">
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>

      <h2 className="mb-3">{t('campaigns')}</h2>

      <div className="create-button-div">
        <Link to={`/${i18next.language}/admin-user/campaigns/new`}>
          <button className="create-button">{t('create_new_campaign')}</button>
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
