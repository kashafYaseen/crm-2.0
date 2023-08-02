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
import { useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Form = observer((props) => {
  const authStore = useStores()
  const [regionsData, setRegionsData] = useState([])
  const short_desc_editor = useRef(null)
  const desc_editor_en = useRef(null)
  const desc_editor_nl = useRef(null)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const navigate = useNavigate()
  const [fetchingRegionsByCountry, setFetchingRegionsByCountry] = useState(false)
  const authToken = authStore((state) => state.token)
  const [serverError, setServerError] = useState('')
  const { t } = useTranslation()

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

  const serverErrorHandler = (error) => {
    setServerError('An error occurred. Please try again: ' + error.toString())
    formik.resetForm()
  }

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
              {},
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError(t('record_updated_successfully'))
            setTimeout(() => {
              navigate(`/${i18next.language}/admin-user/places`)
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await places_data('post', 'places', values, {}, authToken)
            setShowToast(true)
            setErrorType('success')
            setError(t('record_created_successfully'))
            setTimeout(() => {
              navigate(`/${i18next.language}/admin-user/places`)
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
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
        setFetchingRegionsByCountry(true)
        const response = await regions_data(
          'get',
          `countries/${countryId}/regions`,
          null,
          {},
          authToken,
        )
        setRegionsData(response.data)
        setFetchingRegionsByCountry(false)
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
      setFetchingRegionsByCountry(false)
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
      {serverError && <div className="server-error-message">{serverError}</div>}

      <CBreadcrumb>
        <CBreadcrumbItem>
          <Link to={`/${i18next.language}/admin-user/places`}>{t('place')}</Link>
        </CBreadcrumbItem>
        {props.place_to_update ? (
          <CBreadcrumbItem active>
            {t('edit')} {t('place')}
          </CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem active>{t('create_new_place')}</CBreadcrumbItem>
        )}
      </CBreadcrumb>
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{t('create_new_place')} </strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('name')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputName"
                    value={formik.values.place.name_nl}
                    onChange={formik.handleChange}
                    name="place.name_nl"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('name')} (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputName"
                    value={formik.values.place.name_en}
                    onChange={formik.handleChange}
                    name="place.name_en"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">{t('publish')}</CFormLabel>
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
                  <CFormLabel htmlFor="selectPublish4">{t('Place Category')}</CFormLabel>
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
                  <CFormLabel htmlFor="country4">{t('country')}</CFormLabel>
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
                  <CFormLabel htmlFor="selectPublish4">{t('region')}</CFormLabel>
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
                    disabled={!formik.values.place.country_id} // Disable the select field if no country is selected
                  >
                    {formik.values.place.country_id ? (
                      fetchingRegionsByCountry ? (
                        // Show "Loading" when fetching is in progress
                        <option value="">Loading...</option>
                      ) : regionsData.length > 0 ? (
                        <>
                          <option value="">Select</option>
                          {regionsData.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option value="">No regions available for this country</option>
                      )
                    ) : (
                      <option value="">Please Select a Country First</option>
                    )}
                  </CFormSelect>
                  {formik.touched.place?.region_id && formik.errors.place?.region_id && (
                    <div className="formik-errors">{formik.errors.place.region_id}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">
                    {t('header')} {t('dropdown')}
                  </CFormLabel>
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
                    label={t('spotlight')}
                    checked={formik.values.place.spotlight}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('place.spotlight', event.target.checked)
                    }}
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="inputSlug">{t('address')}</CFormLabel>
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
                  <CFormLabel htmlFor="shortDesc">{t('short_description_nav')}</CFormLabel>
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
                  <CFormLabel htmlFor="shortDesc">{t('short_description')}</CFormLabel>
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
                  <CFormLabel htmlFor="Desc">{t('description')} (NL) </CFormLabel>
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
                  <CFormLabel htmlFor="Desc">{t('description')} (EN) </CFormLabel>
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
                  <CFormLabel htmlFor="inputSlug">{t('slug')} (NL)</CFormLabel>
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
                  <CFormLabel htmlFor="inputSlug">{t('slug')} (EN)</CFormLabel>
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
                  <CFormLabel htmlFor="selectPublish4">{t('geo_location')}</CFormLabel>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="inputLongitude"
                      value={formik.values.place.longitude}
                      onChange={formik.handleChange}
                      placeholder={t('longitude')}
                      name="place.longitude"
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="inputLatitude"
                      value={formik.values.place.latitude}
                      onChange={formik.handleChange}
                      placeholder={t('latitude')}
                      name="place.latitude"
                    />
                  </CCol>
                </CRow>

                <CCol xs={12}>
                  <CButton type="submit" className="create-button formik-btn">
                    {t('submit')}
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
})

export default Form
