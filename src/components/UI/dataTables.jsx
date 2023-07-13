import React from 'react'
import ReactFlexyTable from 'react-flexy-table'
import 'react-flexy-table/dist/index.css'
import './../../scss/_custom.scss'

export const DataTables = ({ data, columns }) => {
  return (
    <div>
      <ReactFlexyTable
        data={data}
        sortable
        columns={columns}
        className="custom-table table table-striped table-bordered"
      />
    </div>
  )
}
