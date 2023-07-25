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
import { regions_data } from '@/api/admin_user/config/resources/regions'
import { places_data } from '@/api/admin_user/config/resources/places'
import { Toast } from '@admin_user_components/UI/Toast/Toast'
import JoditEditor from 'jodit-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

const Form = (props) => {
  const [regionsData, setRegionsData] = useState([])
  const short_desc_editor = useRef(null)
  const desc_editor_en = useRef(null)
  const desc_editor_nl = useRef(null)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const navigate = useNavigate()

  const defaultValues = {
    place: {
      name_nl: props.place_to_update?.name_nl || '',
      name_en: props.place_to_update?.name_en || '',
      address: props.place_to_update?.address || '',
      publish: props.place_to_update?.publish || '',
      place_category_id: props.place_to_update?.place_category_id || '',
      region_id: props.place_to_update?.region_id || '',
      country_id: props.place_to_update?.country_id || '',
      header_dropdown: props.place_to_update?.header_dropdown || '',
      short_desc_nav: props.place_to_update?.short_desc_nav || '',
      short_desc: props.place_to_update?.short_desc || '',
      description_nl: props.place_to_update?.description_nl || '',
      description_en: props.place_to_update?.description_en || '',

      spotlight: props.place_to_update?.spotlight || '',
      longitude: props.place_to_update?.longitude || '',
      slug_en: props.place_to_update?.slug_en || '',
      slug_nl: props.place_to_update?.slug_nl || '',

      latitude: props.place_to_update?.latitude || '',
    },
  }

  const validationSchema = Yup.object().shape({
    place: Yup.object().shape({
      region_id: Yup.number().required('*Region is Required'),
      country_id: Yup.number().required('*Country is required'),
      place_category_id: Yup.number().required('*Place Category is required'),
    }),
  })

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
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
            setTimeout(() => {
              navigate('/admin-user/places')
            }, 1000)
          } catch (error) {
            console.error('FORM_ERROR', error)
          }
        } else {
          try {
            const extractedData = await places_data('post', 'places', values)
            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
            setTimeout(() => {
              navigate('/admin-user/places')
            }, 1000)
          } catch (error) {
            console.error('FORM_ERROR', error)
          }
        }
      }
    },
  })

  const handleToastHide = () => {
    setShowToast(false)
  }

  const fetchRegionsByCountry = async (countryId) => {
    try {
      if (countryId) {
        const response = await regions_data('get', `countries/${countryId}/regions_by_country`)
        setRegionsData(response)
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value
    formik.handleChange(event) // Handle the formik change event for the country select
    fetchRegionsByCountry(selectedCountryId) // Fetch the regions based on the selected country
  }

  useEffect(() => {
    const fetchRegionsForEdit = async () => {
      if (props.place_to_update?.country_id) {
        fetchRegionsByCountry(props.place_to_update.country_id)
      }
    }

    fetchRegionsForEdit()
  }, [props.place_to_update])

  return (
    <div className="display">
      <CBreadcrumb>
        <CBreadcrumbItem href="/admin-user/places">Place</CBreadcrumbItem>
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
                  <CFormLabel htmlFor="inputName">Name (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputName"
                    value={formik.values.place.name_nl}
                    onChange={formik.handleChange}
                    name="place.name_nl"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">Name (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputName"
                    value={formik.values.place.name_en}
                    onChange={formik.handleChange}
                    name="place.name_en"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">Publish</CFormLabel>
                  <CFormSelect
                    id="publish"
                    className="form-control"
                    value={formik.values.place.publish}
                    onChange={formik.handleChange}
                    name="place.publish"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </CFormSelect>
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
                    {[{ id: '', name: 'Select' }, ...props.placeCategories].map((category) => (
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
                  <CFormLabel htmlFor="country4">Country</CFormLabel>
                  <CFormSelect
                    id="country_id"
                    value={formik.values.place.country_id}
                    onChange={handleCountryChange}
                    onBlur={formik.handleBlur}
                    name="place.country_id"
                    className={
                      formik.touched.place?.country_id && formik.errors.place?.country_id
                        ? 'input-error'
                        : ''
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...props.countries].map((country) => (
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
                  <CFormLabel htmlFor="selectPublish4">Region</CFormLabel>
                  {formik.values.place.country_id ? (
                    regionsData.length > 0 ? (
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
                    ) : (
                      <div>No regions available for this country</div>
                    )
                  ) : (
                    <div>Please Select a Country First</div>
                  )}
                  {formik.touched.place?.region_id && formik.errors.place?.region_id && (
                    <div className="formik-errors">{formik.errors.place.region_id}</div>
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

                <CCol md={6}>
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
                  <CFormLabel htmlFor="inputSlug">Address</CFormLabel>
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows="3"
                    type="text"
                    value={formik.values.place.address}
                    onChange={formik.handleChange}
                    name="place.address"
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

                <CCol md={6}>
                  <CFormLabel htmlFor="Desc">Description (NL) </CFormLabel>
                  <JoditEditor
                    ref={desc_editor_nl}
                    tabIndex={1}
                    onBlur={() => {
                      const value = desc_editor_nl.current.value
                      formik.setFieldValue('place.description_nl', value)
                    }}
                    value={formik.values.place.description_nl}
                    onChange={(value) => {
                      formik.setFieldValue('place.description_nl', value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="Desc">Description (EN) </CFormLabel>
                  <JoditEditor
                    ref={desc_editor_en}
                    tabIndex={1}
                    onBlur={() => {
                      const value = desc_editor_en.current.value
                      formik.setFieldValue('place.description_en', value)
                    }}
                    value={formik.values.place.description_en}
                    onChange={(value) => {
                      formik.setFieldValue('place.description_en', value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlug">Slug (NL)</CFormLabel>
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows="3"
                    type="text"
                    value={formik.values.place.slug_nl}
                    onChange={formik.handleChange}
                    name="place.slug_nl"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlug">Slug (EN)</CFormLabel>
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows="3"
                    type="text"
                    value={formik.values.place.slug_en}
                    onChange={formik.handleChange}
                    name="place.slug_en"
                  />
                </CCol>

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
