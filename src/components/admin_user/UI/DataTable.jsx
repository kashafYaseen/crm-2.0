import React, { useState } from 'react'
import ReactFlexyTable from 'react-flexy-table'
import Pagination from '@mui/material/Pagination'
import 'react-flexy-table/dist/index.css'
import '@/scss/_custom.scss'
import { usePagination } from '@/hooks/pagination'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import { CSpinner } from '@coreui/react'
import { useTranslation } from 'react-i18next'

export const DataTable = ({
  data,
  columns,
  totalRecords,
  onPageChange,
  onPerPageChange,
  perPageNumber,
  loading,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(perPageNumber)

  const [totalPages, startPageIndex, endPageIndex, currentPageIndex, displayPage] = usePagination(
    rowsPerPage,
    totalRecords,
  )

  const onChangeHandler = (event, value) => {
    displayPage(value)
    onPageChange(value)
  }

  const pageSizeChangeHandler = (event) => {
    setRowsPerPage(event.target.value)
    onPerPageChange(event.target.value)
  }
  const { t } = useTranslation()

  return (
    <React.Fragment key="data-tables">
      <Grid container alignItems="center" className="row-per-page">
        <InputLabel htmlFor="rows-per-page-label" className="rows-per-page-label">
          {t('entries_per_page')}
        </InputLabel>

        <Select
          value={rowsPerPage}
          onChange={pageSizeChangeHandler}
          label="Rows Per Page"
          variant="outlined"
          inputProps={{
            name: 'rows-per-page',
            id: 'rows-per-page-label',
          }}
          className="row-per-page-selector"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </Grid>

      {loading ? (
        <div>
          <CSpinner color="secondary" variant="grow" />
        </div>
      ) : (
        <ReactFlexyTable
          data={data}
          sortable
          pageSize={rowsPerPage}
          columns={columns}
          showPagination={false}
          className="custom-table table table-striped table-bordered hide-tfoot"
        />
      )}

      <div className="pagination">
        <Pagination
          variant="outlined"
          shape="rounded"
          color="primary"
          count={totalPages}
          showFirstButton
          showLastButton
          onChange={onChangeHandler}
        />
      </div>
    </React.Fragment>
  )
}
