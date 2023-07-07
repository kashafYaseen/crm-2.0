import React, { useState } from 'react'
import 'react-flexy-table/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import './../../scss/_custom.scss'
import { DataTables } from '@/components/UI/dataTables'

const Lodgings = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Hotel A', location: 'City X', price: '$100' },
    { id: 2, name: 'Hotel B', location: 'City Y', price: '$150' },
    { id: 3, name: 'Hotel C', location: 'City Z', price: '$120' },
    { id: 4, name: 'Hotel D', location: 'City W', price: '$120' },
    { id: 5, name: 'Hotel E', location: 'City W', price: '$120' },
    { id: 6, name: 'Hotel F', location: 'City W', price: '$120' },
  ])

  const [selectedOptions, setSelectedOptions] = useState([])

  const additionalCols = [
    {
      header: 'Actions',
      td: () => (
        <>
          <FontAwesomeIcon icon={faEdit} />
          <FontAwesomeIcon icon={faTrash} />
        </>
      ),
    },
  ]

  const options = data.map((item) => ({ value: item.id, label: item.name }))

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected)
  }

  const filteredData =
    selectedOptions.length > 0
      ? data.filter((item) => selectedOptions.find((option) => option.value === item.id))
      : data

  return (
    <div>
      <h2 className="mb-3">Lodgings</h2>
      <div className="row justify-content-end">
        <div className="col-12 col-md-4 mb-3">
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={options}
            onChange={handleSelectChange}
            value={selectedOptions}
            menuPlacement="auto"
          />
        </div>
      </div>
      <div>
        <DataTables data={filteredData} additionalCols={additionalCols} />
      </div>
    </div>
  )
}

export default Lodgings
