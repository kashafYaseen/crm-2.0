import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CRow,
  CFormSwitch,
  CBreadcrumb,
  CBreadcrumbItem,
} from '@coreui/react'
import { Toast } from '@/components/UI/Toast/Toast'
import { useFormik } from 'formik'
import { Alert } from 'reactstrap'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import { partners_data } from '@/api/admin_user/config/resources/partners'
import { regions_data } from '@/api/admin_user/config/resources/regions'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Form = observer((props) => {
  const authStore = useStores()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [alert, setAlert] = useState('')
  const [alertType, setAlertType] = useState('')
  const [serverError, setServerError] = useState('')
  const authToken = authStore((state) => state.token)
  const [fetchingRegionsByCountry, setFetchingRegionsByCountry] = useState(false)
  const [regionsData, setRegionsData] = useState([])
  const [visible, setVisible] = useState(true)

  const { t } = useTranslation()

  const initialValues = {
    owner: {
      admin_user_id: props.owner_data?.admin_user_id || '',
      first_name: props.owner_data?.first_name || '',
      last_name: props.owner_data?.last_name || '',
      email: props.owner_data?.email || '',
      language: props.owner_data?.language || '',
      country_id: props.owner_data?.country_id || '',
      region_id: props.owner_data?.region_id || '',
      email_boolean: props.owner_data?.email_boolean || '',
      not_interested: props.owner_data?.not_interested || '',
      updating_availability: props.owner_data?.updating_availability || '',
      automated_availability: props.owner_data?.automated_availability || '',
      business_name: props.owner_data?.business_name || '',
      account_id: props.owner_data?.account_id || '',
    },
  }

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value
    formik.handleChange(event) // Handle the formik change event for the country select
    fetchRegionsByCountry(selectedCountryId) // Fetch the regions based on the selected country
  }

  useEffect(() => {
    const fetchRegionsForEdit = async () => {
      if (props.owner_data?.country_id) {
        fetchRegionsByCountry(props.owner_data.country_id)
      }
    }

    fetchRegionsForEdit
  }, [props.owner_data])

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

  const serverErrorHandler = (error) => {
    if (error.response && error.response.data && error.response.data.errors) {
      const nameError = error.response.data.errors.name
      if (nameError && nameError.length > 0) {
        setVisible(true)
        setServerError('Naam ' + nameError[0])
      }
    } else {
      setVisible(true)
      setServerError('An error occurred. Please try again: ' + error.toString())
    }
  }

  const validationSchema = Yup.object().shape({
    owner: Yup.object().shape({
      country_id: Yup.string().required('*Country is required'),
      email: Yup.string().required('*Email is required'),
    }),
  })

  const handleBreadcrumbClick = (event) => {
    event.preventDefault()
    window.history.back()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        if (props.owner_data) {
          try {
            const extractedData = await partners_data(
              'put',
              `owners/${props.owner_data.id}`,
              values,
              {},
              authToken,
            )
            setShowToast(true)
            setAlertType('success')
            setAlert('Record Updated Successfully')
            setTimeout(() => {
              window.history.back()
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await partners_data('post', 'owners', values, {}, authToken)

            setShowToast(true)
            setAlertType('success')
            setAlert('Record Created Successfully')
            setTimeout(() => {
              window.history.back()
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

  const onDismiss = () => {
    setVisible(false)
  }

  return (
    <div className="display">
      {serverError && (
        <Alert color="danger" isOpen={visible} toggle={onDismiss}>
          <div className="server-error-message">{serverError}</div>
        </Alert>
      )}
      <CBreadcrumb>
        <CBreadcrumbItem>
          <Link onClick={handleBreadcrumbClick}>{t('partners')}</Link>
        </CBreadcrumbItem>
        {props.owner_data ? (
          <CBreadcrumbItem active>{t('edit')}</CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem active>{t('new')}</CBreadcrumbItem>
        )}
      </CBreadcrumb>

      <div className="toast-container">
        {showToast && <Toast error={alert} onExited={handleToastHide} type={alertType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormCheck
                    id="inputEmailBoolean"
                    name="owner.email_boolean"
                    label={t('contract')}
                    checked={formik.values.owner.email_boolean}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('owner.email_boolean', event.target.checked)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormCheck
                    id="inputNotInterested"
                    name="owner.not_interested"
                    label={t('not_interested')}
                    checked={formik.values.owner.not_interested}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('owner.not_interested', event.target.checked)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormCheck
                    id="inputUpdatingAvailability"
                    name="owner.updating_availability"
                    label={t('updating_availability')}
                    checked={formik.values.owner.updating_availability}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('owner.updating_availability', event.target.checked)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormCheck
                    id="inputAutomatedAvailability"
                    name="owner.automated_availability"
                    label={t('automated_availability')}
                    checked={formik.values.owner.automated_availability}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('owner.automated_availability', event.target.checked)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputCountryId">{t('country')}</CFormLabel>
                  <CFormSelect
                    id="country_id"
                    value={formik.values.owner.country_id}
                    onChange={handleCountryChange}
                    name="owner.country_id"
                    className={
                      formik.touched.owner?.country_id && formik.errors.owner?.country_id
                        ? 'input-error'
                        : 'form-control'
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...props.countries].map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {formik.touched.owner?.country_id && formik.errors.owner?.country_id && (
                    <div className="formik-errors">{formik.errors.owner?.country_id}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputRegionId">{t('region')}</CFormLabel>
                  <CFormSelect
                    id="region_id"
                    value={formik.values.owner.region_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.region_id"
                    className={
                      formik.touched.owner?.region_id && formik.errors.owner?.region_id
                        ? 'input-error'
                        : ''
                    }
                    disabled={!formik.values.owner.country_id} // Disable the select field if no country is selected
                  >
                    {formik.values.owner.country_id ? (
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
                  {formik.touched.owner?.region_id && formik.errors.owner?.region_id && (
                    <div className="formik-errors">{formik.errors.owner.region_id}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputAdminUserId">{t('visited_by')}</CFormLabel>
                  <CFormSelect
                    id="admin_user_id"
                    value={formik.values.owner.admin_user_id}
                    onChange={formik.handleChange}
                    name="owner.admin_user_id"
                    className={
                      formik.touched.owner?.admin_user_id && formik.errors.owner?.admin_user_id
                        ? 'input-error'
                        : 'form-control'
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...props.admins].map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.full_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputEmail">{t('email_translation')}</CFormLabel>
                  <CFormInput
                    type="email"
                    id="inputEmail"
                    value={formik.values.owner.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.email"
                    className={
                      formik.errors.owner?.email && formik.touched.owner?.email ? 'input-error' : ''
                    }
                  />
                  {formik.touched.owner?.email && formik.errors.owner?.email && (
                    <div className="formik-errors">{formik.errors.owner?.email}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputFirstName">{t('first_name')}</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputFirstName"
                    value={formik.values.owner.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.first_name"
                    className={
                      formik.errors.owner?.first_name && formik.touched.owner?.first_name
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.owner?.first_name && formik.errors.owner?.first_name && (
                    <div className="formik-errors">{formik.errors.owner?.first_name}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputLastName">{t('last_name')}</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputLastName"
                    value={formik.values.owner.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.last_name"
                    className={
                      formik.errors.owner?.last_name && formik.touched.owner?.last_name
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.owner?.last_name && formik.errors.owner?.last_name && (
                    <div className="formik-errors">{formik.errors.owner?.last_name}</div>
                  )}
                </CCol>
                <CCol md={12}>
                  <CFormLabel htmlFor="inputLanguage">{t('language')}</CFormLabel>
                  <CFormSelect
                    id="inputLanguage"
                    className="form-control"
                    value={formik.values.owner.language}
                    onChange={formik.handleChange}
                    name="owner.language"
                  >
                    <option value="">Select</option>
                    <option value="en">en</option>
                    <option value="nl">nl</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputBusinessName">{t('business_name')}</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputBusinessName"
                    value={formik.values.owner.business_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.business_name"
                    className={
                      formik.errors.owner?.business_name && formik.touched.owner?.business_name
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.owner?.business_name && formik.errors.owner?.business_name && (
                    <div className="formik-errors">{formik.errors.owner?.business_name}</div>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputAccountId">{t('account_id')}</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputAccountId"
                    value={formik.values.owner.account_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.account_id"
                    className={
                      formik.errors.owner?.account_id && formik.touched.owner?.account_id
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.owner?.account_id && formik.errors.owner?.account_id && (
                    <div className="formik-errors">{formik.errors.owner?.account_id}</div>
                  )}
                </CCol>
                <CCol xs={12}>
                  <CButton color="dark" type="submit" className="create-button">
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
