import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CBreadcrumb,
  CBreadcrumbItem,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { place_categories_data } from '@/api/config/resources/place_categories'
import { regions_data } from '@/api/config/resources/regions'
import { countries_data } from '@/api/config/resources/countries'
import JoditEditor from 'jodit-react'
import { places_data } from '@/api/config/resources/places'
import { Toast } from '@/components/UI/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Form = (props) => {
  const [placeCategoriesData, setPlaceCategoriesData] = useState([])
  const [regionsData, setRegionsData] = useState([])
  const [countriesData, setCountriesData] = useState([])
  const short_desc_editor = useRef(null)
  const desc_editor = useRef(null)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')

  const defaultValues = {
    place: {
      name: props.place_to_update?.name || '',
      publish: props.place_to_update?.publish || '',
      place_category_id: props.place_to_update?.place_category_id || '',
      region_id: props.place_to_update?.region_id || '',
      country_id: props.place_to_update?.country_id || '',
      header_dropdown: props.place_to_update?.header_dropdown || '',
      short_desc_nav: props.place_to_update?.short_desc_nav || '',
      short_desc: props.place_to_update?.short_desc || '',
      description: props.place_to_update?.description || '',
      spotlight: props.place_to_update?.spotlight || '',
      longitude: props.place_to_update?.longitude || '',
      slug: props.place_to_update?.slug || '',
      latitude: props.place_to_update?.latitude || '',
    },
    // images_attributes: [{ image: '' }],
  }

  const validationSchema = Yup.object().shape({
    place: Yup.object().shape({
      region_id: Yup.number().required('*Region is Required'),
      country_id: Yup.number().required('*Country is required'),
      place_category_id: Yup.number().required('*Place Category is required'),
    }),
  })

  const [formField, setFormField] = useState(defaultValues)

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('values', values)

      await formik.validateForm()
      if (formik.isValid) {
        if (props.place_to_update) {
          try {
            const extractedData = await places_data(
              'put',
              `places/${props.place_to_update.id}`,
              values,
            )
            setShowToast(true)
            setErrorType('success')
            setError('Record Updated Successfully')
          } catch (error) {
            console.error('FORM_ERROR', error)
          }
        } else {
          try {
            const extractedData = await places_data('post', 'places', values)
            console.log('success', extractedData)
            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
          } catch (error) {
            console.error('FORM_ERROR', error)
          }
        }
      }
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placeCategories, regions, countries] = await Promise.all([
          place_categories_data('get', 'place_categories'),
          regions_data('get', 'regions'),
          countries_data('get', 'countries'),
        ])

        setPlaceCategoriesData(placeCategories)
        setRegionsData(regions)
        setCountriesData(countries)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const handleToastHide = () => {
    setShowToast(false)
  }

  return (
    <div className="display">
      <CBreadcrumb>
        <CBreadcrumbItem href="#/place">Place</CBreadcrumbItem>
        <CBreadcrumbItem active>New Place</CBreadcrumbItem>
      </CBreadcrumb>
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Create New Place </strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputName"
                    value={formik.values.place.name}
                    onChange={formik.handleChange}
                    name="place.name"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">Publish</CFormLabel>
                  <select
                    id="publish"
                    className="form-control"
                    value={formik.values.place.publish}
                    onChange={formik.handleChange}
                    name="place.publish"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">Place Category</CFormLabel>
                  <CFormSelect
                    id="place_category_id"
                    value={formik.values.place.place_category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="place.place_category_id"
                    className={
                      formik.touched.place?.place_category_id &&
                      formik.errors.place?.place_category_id
                        ? 'input-error'
                        : 'form-control'
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...placeCategoriesData].map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </CFormSelect>

                  {formik.touched.place?.place_category_id &&
                    formik.errors.place?.place_category_id && (
                      <div className="formik-errors">{formik.errors.place.place_category_id}</div>
                    )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">Region</CFormLabel>
                  <CFormSelect
                    id="region_id"
                    value={formik.values.place.region_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="place.region_id"
                    className={
                      formik.touched.place?.region_id && formik.errors.place?.region_id
                        ? 'input-error'
                        : ''
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...regionsData].map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {formik.touched.place?.region_id && formik.errors.place?.region_id && (
                    <div className="formik-errors">{formik.errors.place.region_id}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="country4">Country</CFormLabel>
                  <CFormSelect
                    id="country_id"
                    value={formik.values.place.country_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="place.country_id"
                    className={
                      formik.touched.place?.country_id && formik.errors.place?.country_id
                        ? 'input-error'
                        : ''
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...countriesData].map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </CFormSelect>

                  {formik.touched.place?.country_id && formik.errors.place?.country_id && (
                    <div className="formik-errors">{formik.errors.place.country_id}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">Header dropdown</CFormLabel>
                  <select
                    id="header_dropdown"
                    className="form-control"
                    value={formik.values.place.header_dropdown}
                    onChange={formik.handleChange}
                    name="place.header_dropdown"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </CCol>

                <CCol xs={12}>
                  <CFormCheck
                    type="checkbox"
                    id="gridCheck"
                    label="Spotlight"
                    checked={formik.values.place.spotlight}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('place.spotlight', event.target.checked)
                    }}
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="shortDesc">Short description nav</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputShortDescNav"
                    value={formik.values.place.short_desc_nav}
                    onChange={formik.handleChange}
                    name="place.short_desc_nav"
                    placeholder="short description nav"
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="shortDesc">Short description</CFormLabel>
                  <JoditEditor
                    ref={short_desc_editor}
                    tabIndex={1}
                    onBlur={() => {
                      const value = short_desc_editor.current.value
                      formik.setFieldValue('place.short_desc', value)
                    }}
                    value={formik.values.place.short_desc}
                    onChange={(value) => {
                      formik.setFieldValue('place.short_desc', value)
                    }}
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="Desc">Description </CFormLabel>
                  <JoditEditor
                    ref={desc_editor}
                    tabIndex={1}
                    onBlur={() => {
                      const value = desc_editor.current.value
                      formik.setFieldValue('place.description', value)
                    }}
                    value={formik.values.place.description}
                    onChange={(value) => {
                      formik.setFieldValue('place.description', value)
                    }}
                  />
                </CCol>

                <CRow>
                  <CCol md={6}>
                    <CFormLabel htmlFor="inputSlug">Slug</CFormLabel>
                    <CFormTextarea
                      id="exampleFormControlTextarea1"
                      rows="3"
                      type="text"
                      value={formik.values.place.slug}
                      onChange={formik.handleChange}
                      name="place.slug"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CFormLabel htmlFor="selectPublish4">Geo Location</CFormLabel>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="inputLongitude"
                      value={formik.values.place.longitude}
                      onChange={formik.handleChange}
                      placeholder="Longitude"
                      name="place.longitude"
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="inputLatitude"
                      value={formik.values.place.latitude}
                      onChange={formik.handleChange}
                      placeholder="Latitude"
                      name="place.latitude"
                    />
                  </CCol>
                </CRow>

                <CCol xs={12}>
                  <CButton
                    type="submit"
                    className="create-button formik-btn"
                    disabled={formik.isSubmitting}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Form
