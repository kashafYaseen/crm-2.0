import React from 'react'
import { CSpinner, CRow, CCard, CCardTitle } from '@coreui/react'
import { DataTable } from '@admin_user_components/UI/DataTable'
import { Link } from 'react-router-dom'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const CommissionArrival = ({
  partners,
  totalRecords,
  loading,
  perPageNumber,
  searchQuery,
  handleSearchInputChange,
  searchQueryHandler,
  onPageChangeHandler,
  onPerPageChangeHandler,
  deleteOwner,
}) => {
  const { t } = useTranslation()
  const commissionArrivalColumns = [
    { header: t('business_name'), key: 'business_name', td: (row) => row.business_name ?? '' },
    { header: t('country'), key: 'country_name', td: (row) => row.country_name ?? '' },
    { header: t('region'), key: 'region_name', td: (row) => row.region_name ?? '' },
    { header: t('contract_date'), key: 'contract_date', td: (row) => '2022-06-27' },
    {
      header: new Date().getFullYear() - 7,
      keys: 'commission_previous_7_year',
      td: (row) => row.commission_previous_7_year ?? '',
    },
    {
      header: new Date().getFullYear() - 6,
      keys: 'commission_previous_6_year',
      td: (row) => row.commission_previous_6_year ?? '',
    },
    {
      header: new Date().getFullYear() - 5,
      keys: 'commission_previous_5_year',
      td: (row) => row.commission_previous_5_year ?? '',
    },
    {
      header: new Date().getFullYear() - 4,
      keys: 'commission_previous_4_year',
      td: (row) => row.commission_previous_4_year ?? '',
    },
    {
      header: new Date().getFullYear() - 3,
      keys: 'commission_previous_3_year',
      td: (row) => row.commission_previous_3_year ?? '',
    },
    {
      header: new Date().getFullYear() - 2,
      keys: 'commission_previous_2_year',
      td: (row) => row.commission_previous_2_year ?? '',
    },
    {
      header: new Date().getFullYear() - 1,
      keys: 'commission_previous_1_year',
      td: (row) => row.commission_previous_1_year ?? '',
    },
    {
      header: new Date().getFullYear(),
      keys: 'commission_current_year',
      td: (row) => row.commission_current_year ?? '',
    },
    {
      header: new Date().getFullYear() + 1,
      keys: 'commission_next_1_year',
      td: (row) => row.commission_next_1_year ?? '',
    },
  ]

  return (
    <CRow className="mt-5">
      <CCard>
        <CCardTitle className="mt-4">{t('commission_arrival_per_partner')}</CCardTitle>
        <hr />
        <div className="custom-search-container ">
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

        {partners.length > 0 ? (
          <DataTable
            data={partners}
            columns={commissionArrivalColumns}
            totalRecords={totalRecords}
            onPageChange={onPageChangeHandler}
            onPerPageChange={onPerPageChangeHandler}
            perPageNumber={perPageNumber}
            loading={loading}
          />
        ) : (
          <div>{loading ? <CSpinner color="secondary" variant="grow" /> : 'No records found'}</div>
        )}
      </CCard>
    </CRow>
  )
}

export default React.memo(CommissionArrival)
