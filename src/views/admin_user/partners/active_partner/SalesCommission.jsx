import React from 'react'
import { CSpinner, CPopover, CRow, CCard, CCardTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/UI/DataTable'
import { Link } from 'react-router-dom'
import i18next from 'i18next'

const SalesCommission = ({
  salesPartners,
  salesTotalRecords,
  salesLoading,
  salesPerPageNumber,
  salesSearchQuery,
  handleSalesSearchInputChange,
  salesSearchQueryHandler,
  onSalesPageChangeHandler,
  onSalesPerPageChangeHandler,
  handleDelete,
}) => {
  const { t } = useTranslation()

  const salesColumns = [
    { header: t('business_name'), key: 'business_name', td: (row) => row.business_name ?? '' },
    { header: t('country'), key: 'country_name', td: (row) => row.country_name ?? '' },
    { header: t('region'), key: 'region_name', td: (row) => row.region_name ?? '' },
    {
      header: t('details'),
      td: (row) => (
        <>
          <CPopover
            title={t('owner_details')}
            content={
              <div>
                <p>
                  <b>Name:</b> {row.full_name}
                </p>
                <p>
                  <b>Email:</b> {row.email}
                </p>
                <p>
                  <b>Business Name:</b> {row.business_name}
                </p>
              </div>
            }
            trigger="focus"
            placement="right"
          >
            <Link>{t('details')}</Link>
          </CPopover>
        </>
      ),
    },
    {
      header: t('contract'),
      key: 'email_boolean',
      td: (row) => {
        return (
          <span className={`badge ${row.email_boolean ? 'badge bg-success' : 'badge bg-danger'}`}>
            {row.email_boolean ? 'True' : 'False'}
          </span>
        )
      },
    },
    { header: t('Language'), key: 'language', td: (row) => row.language ?? '' },
    {
      header: t('mantain_availability'),
      key: 'updating_availability',
      td: (row) => {
        return (
          <span
            className={`badge ${
              row.updating_availability ? 'badge bg-success' : 'badge bg-danger'
            }`}
          >
            {row.updating_availability ? 'Yes' : 'Nope'}
          </span>
        )
      },
    },
    {
      header: t('automated_availability'),
      key: 'automated_availability',
      td: (row) => {
        return (
          <span
            className={`badge ${
              row.automated_availability ? 'badge bg-success' : 'badge bg-danger'
            }`}
          >
            {row.automated_availability ? 'True' : 'False'}
          </span>
        )
      },
    },
    { header: t('contract_date'), key: 'contract_date', td: (row) => '2022-06-22' },
    {
      header: 'Actions',
      td: (row) => (
        <>
          <Link
            to={`/${i18next.language}/admin-user/edit`}
            state={{ record: row }}
            className="custom-link"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <FontAwesomeIcon onClick={() => handleDelete(row.id)} icon={faTrash} />
        </>
      ),
    },
  ]

  return (
    <CRow className="mt-2">
      <CCard>
        <CCardTitle className="mt-4">{t('sales_commission')}</CCardTitle>
        <hr />
        <div className="custom-search-container ">
          <input
            type="text"
            value={salesSearchQuery}
            onChange={handleSalesSearchInputChange}
            placeholder="Search..."
            className="custom-search-input"
          />
          <button className="create-button" onClick={salesSearchQueryHandler}>
            {t('search')}
          </button>
        </div>

        {salesPartners.length > 0 ? (
          <DataTable
            data={salesPartners}
            columns={salesColumns}
            totalRecords={salesTotalRecords}
            onPageChange={onSalesPageChangeHandler}
            onPerPageChange={onSalesPerPageChangeHandler}
            perPageNumber={salesPerPageNumber}
            loading={salesLoading}
          />
        ) : (
          <div>
            {salesLoading ? <CSpinner color="secondary" variant="grow" /> : 'No records found'}
          </div>
        )}
      </CCard>
    </CRow>
  )
}

export default React.memo(SalesCommission)
