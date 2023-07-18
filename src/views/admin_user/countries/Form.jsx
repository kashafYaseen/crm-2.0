import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormCheck,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CRow,
  CBreadcrumb,
  CBreadcrumbItem,
} from '@coreui/react'
import { countries_data } from '../../../api/admin_user/config/resources/countries'
import { Toast } from '../../../components/admin_user/UI/Toast/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../../../scss/_custom.scss'
import JoditEditor from 'jodit-react'
import { useLocation, useNavigate } from 'react-router-dom'

const Form = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const country_data = location.state && location.state.record
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')

  const initialValues = {
    country: {
      name_en: country_data?.name_en || '',
      name_nl: country_data?.name_nl || '',
      slug_en: country_data?.slug_en || '',
      slug_nl: country_data?.slug_nl || '',
      content_en: country_data?.content_en || '',
      content_nl: country_data?.content_nl || '',
      title_en: country_data?.title_en || '',
      title_nl: country_data?.title_nl || '',
      meta_title_en: country_data?.meta_title_en || '',
      meta_title_nl: country_data?.meta_title_nl || '',
      disable: country_data?.disable || '',
      villas_desc: country_data?.villas_desc || '',
      apartment_desc: country_data?.apartment_desc || '',
      bb_desc: country_data?.bb_desc || '',
      dropdown: country_data?.dropdown || '',
      sidebar: country_data?.sidebar || '',
    },
  }

  useEffect(() => {
    return () => {
      // Clear the timeout if the component unmounts before the timeout is triggered
      clearTimeout()
    }
  }, [])

  const serverErrorHandler = (error) => {
    if (error.response && error.response.data && error.response.data.errors) {
      const nameError = error.response.data.errors.name
      if (nameError && nameError.length > 0) {
        setServerError('Naam ' + nameError[0])
        formik.resetForm()
      }
    } else {
      setServerError('An error occurred. Please try again: ' + error.toString())
      formik.resetForm()
    }
    setShowToast(true)
    setErrorType('danger')
    setError('Something went wrong')
  }

  const validationSchema = Yup.object().shape({
    country: Yup.object().shape({
      name_en: Yup.string().required('*Name is required'),
      name_nl: Yup.string().required('*Name is required'),
    }),
  })

  const handleInputChange = (event) => {
    if (event.target && event.target.value !== undefined) {
      const inputValue = event.target.value ?? ''
      const inputType = event.target.type ?? ''

      const hasNonNumericCharacters = /^[a-zA-Z\s]+$/.test(inputValue)

      // If the input is a text field and contains any numeric characters, prevent it from being set in the state
      if (inputType === 'text' && !hasNonNumericCharacters) {
        return
      }

      // If the input is a number field and contains any non-numeric characters, prevent it from being set in the state
      if (inputType === 'number' && !hasNonNumericCharacters) {
        return
      }
    }
    // If the input passes the validation, update the state
    formik.handleChange(event)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        if (country_data) {
          try {
            const extractedData = await countries_data(
              'put',
              `countries/${country_data.id}`,
              values,
            )
            setShowToast(true)
            setErrorType('success')
            setError('Record Updated Successfully')
            setTimeout(() => {
              navigate('/countries')
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await countries_data('post', 'countries', values)

            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
            setTimeout(() => {
              navigate('/countries')
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

  return (
    <div className="display">
      <CBreadcrumb>
        <CBreadcrumbItem href="/admin-user/countries">Country</CBreadcrumbItem>
        <CBreadcrumbItem active>New Country</CBreadcrumbItem>
      </CBreadcrumb>
      {serverError && <div className="server-error-message">{serverError}</div>}

      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>New Country </strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameEn">Name en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEn"
                    value={formik.values.country.name_en}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.name_en"
                    className={
                      formik.errors.country?.name_en && formik.touched.country?.name_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.name_en && formik.errors.country?.name_en && (
                    <div className="formik-errors">{formik.errors.country?.name_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameNl">Name nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNl"
                    value={formik.values.country.name_nl}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.name_nl"
                    className={
                      formik.errors.country?.name_nl && formik.touched.country?.name_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.name_nl && formik.errors.country?.name_nl && (
                    <div className="formik-errors">{formik.errors.country?.name_nl}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputTitleEn">Title en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputTitleEn"
                    value={formik.values.country.title_en}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.title_en"
                    className={
                      formik.errors.country?.title_en && formik.touched.country?.title_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.title_en && formik.errors.country?.title_en && (
                    <div className="formik-errors">{formik.errors.country?.title_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputTitleNl">Title nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputTitleNl"
                    value={formik.values.country.title_nl}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.title_nl"
                    className={
                      formik.errors.country?.title_nl && formik.touched.country?.title_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.title_nl && formik.errors.country?.title_nl && (
                    <div className="formik-errors">{formik.errors.country?.title_nl}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputMetaTitleEn">Meta Title en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputMetaTitleEn"
                    value={formik.values.country.meta_title_en}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.meta_title_en"
                    className={
                      formik.errors.country?.meta_title_en && formik.touched.country?.meta_title_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.meta_title_en &&
                    formik.errors.country?.meta_title_en && (
                      <div className="formik-errors">{formik.errors.country?.meta_title_en}</div>
                    )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputMetaTitleNl">Meta Title nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputMetaTitleNl"
                    value={formik.values.country.meta_title_nl}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.meta_title_nl"
                    className={
                      formik.errors.country?.meta_title_nl && formik.touched.country?.meta_title_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.meta_title_nl &&
                    formik.errors.country?.meta_title_nl && (
                      <div className="formik-errors">{formik.errors.country?.meta_title_nl}</div>
                    )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputContentEn">Content en</CFormLabel>
                  <JoditEditor
                    id="inputContentEn"
                    tabIndex={1}
                    value={formik.values.country.content_en}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.content_en"
                    className={
                      formik.errors.country?.content_en && formik.touched.country?.content_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.content_en && formik.errors.country?.content_en && (
                    <div className="formik-errors">{formik.errors.country?.content_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputContentNl">Content nl</CFormLabel>
                  <JoditEditor
                    id="inputContentNl"
                    tabIndex={1}
                    value={formik.values.country.content_nl}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.content_nl"
                    className={
                      formik.errors.country?.content_nl && formik.touched.country?.content_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.content_nl && formik.errors.country?.content_nl && (
                    <div className="formik-errors">{formik.errors.country?.content_nl}</div>
                  )}
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormLabel htmlFor="inputMetaDescription">Meta Description</CFormLabel>
                  <JoditEditor
                    id="inputMetaDescription"
                    tabIndex={1}
                    name="country.meta_description"
                  />
                </CCol>

                <CCol md={12}>
                  <CFormLabel htmlFor="selectDisable">Disable</CFormLabel>
                  <CFormSelect
                    id="inputDisable"
                    name="country.disable"
                    aria-label="Default select example"
                    value={formik.values.country.disable}
                    onChange={handleInputChange}
                    className={
                      formik.errors.country?.disable && formik.touched.country?.disable
                        ? 'input-error'
                        : ''
                    }
                  >
                    <option>Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                    {formik.touched.country?.disable && formik.errors.country?.disable && (
                      <div className="formik-errors">{formik.errors.country?.disable}</div>
                    )}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputVillasDesc">Villas desc</CFormLabel>
                  <CFormTextarea
                    id="inputVillasDesc"
                    tabIndex={1}
                    value={formik.values.country.villas_desc}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.villas_desc"
                    className={
                      formik.errors.country?.villas_desc && formik.touched.country?.villas_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.villas_desc && formik.errors.country?.villas_desc && (
                    <div className="formik-errors">{formik.errors.country?.villas_desc}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputApartmentDesc">Apartment desc</CFormLabel>
                  <CFormTextarea
                    id="inputApartmentDesc"
                    tabIndex={1}
                    value={formik.values.country.apartment_desc}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.apartment_desc"
                    className={
                      formik.errors.country?.apartment_desc &&
                      formik.touched.country?.apartment_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.apartment_desc &&
                    formik.errors.country?.apartment_desc && (
                      <div className="formik-errors">{formik.errors.country?.apartment_desc}</div>
                    )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputBbDesc">Bb desc</CFormLabel>
                  <CFormTextarea
                    id="inputBbDesc"
                    tabIndex={1}
                    value={formik.values.country.bb_desc}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.bb_desc"
                    className={
                      formik.errors.country?.bb_desc && formik.touched.country?.bb_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.bb_desc && formik.errors.country?.bb_desc && (
                    <div className="formik-errors">{formik.errors.country?.bb_desc}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormCheck
                    id="inputDropdown"
                    label="Dropdown"
                    name="country.dropdown"
                    defaultChecked={formik.values.country.dropdown}
                    onChange={handleInputChange}
                    className={
                      formik.errors.country?.dropdown && formik.touched.country?.dropdown
                        ? 'input-error'
                        : ''
                    }
                  />
                  <CFormCheck
                    id="inputSidebar"
                    name="country.sidebar"
                    label="Sidebar"
                    defaultChecked={formik.values.country.sidebar}
                    onChange={handleInputChange}
                    className={
                      formik.errors.country?.dropdown && formik.touched.country?.dropdown
                        ? 'input-error'
                        : ''
                    }
                  />
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormInput type="file" id="inputImage" name="country.image" />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlugEn">Slug en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputSlugEn"
                    value={formik.values.country.slug_en}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.slug_en"
                    className={
                      formik.errors.country?.slug_en && formik.touched.country?.slug_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.slug_en && formik.errors.country?.slug_en && (
                    <div className="formik-errors">{formik.errors.country?.slug_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlugNl">Slug nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputSlugNl"
                    value={formik.values.country.slug_nl}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    name="country.slug_nl"
                    className={
                      formik.errors.country?.slug_nl && formik.touched.country?.slug_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.country?.slug_nl && formik.errors.country?.slug_nl && (
                    <div className="formik-errors">{formik.errors.country?.slug_nl}</div>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CButton color="dark" type="submit" className="create-button">
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
