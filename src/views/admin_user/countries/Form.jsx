import React, { useState, useEffect, useRef } from 'react'
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
import { countries_data } from '@/api/admin_user/config/resources/countries'
import { Toast } from '@admin_user_components/UI/Toast/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import JoditEditor from 'jodit-react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Form = observer((props) => {
  const authStore = useStores()
  const location = useLocation()
  const navigate = useNavigate()
  const country_data = location.state && location.state.record
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')
  const authToken = authStore((state) => state.token)
  const content_en_editor = useRef(null)
  const content_nl_editor = useRef(null)
  const { t } = useTranslation()

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
      name_en: Yup.string().required(t('name_is_required')),
      name_nl: Yup.string().required(t('name_is_required')),
    }),
  })

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
              {},
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError(t('record_updated_successfully'))
            setTimeout(() => {
              navigate(`/${i18next.language}/admin-user/countries`)
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await countries_data('post', 'countries', values, {}, authToken)

            setShowToast(true)
            setErrorType('success')
            setError(t('record_created_successfully'))
            setTimeout(() => {
              navigate(`/${i18next.language}/admin-user/countries`)
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
        <CBreadcrumbItem>
          <Link to={`/${i18next.language}/admin-user/countries`}>{t('country')}</Link>
        </CBreadcrumbItem>
        {country_data ? (
          <CBreadcrumbItem active>
            {' '}
            {t('edit')} {t('country')}
          </CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem active>{t('create_new_country')}</CBreadcrumbItem>
        )}
      </CBreadcrumb>
      {serverError && <div className="server-error-message">{serverError}</div>}

      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{t('create_new_country')}</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameEn">{t('name')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEn"
                    value={formik.values.country.name_en}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputNameNl">{t('name')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNl"
                    value={formik.values.country.name_nl}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputTitleEn">{t('title')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputTitleEn"
                    value={formik.values.country.title_en}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputTitleNl">{t('title')} (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputTitleNl"
                    value={formik.values.country.title_nl}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputMetaTitleEn">{t('meta_title')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputMetaTitleEn"
                    value={formik.values.country.meta_title_en}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputMetaTitleNl">{t('meta_title')} (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputMetaTitleNl"
                    value={formik.values.country.meta_title_nl}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputContentEn">{t('content')} (EN)</CFormLabel>
                  <JoditEditor
                    ref={content_en_editor}
                    id="inputContentEn"
                    tabIndex={1}
                    value={formik.values.country.content_en}
                    onChange={(value) => {
                      formik.setFieldValue('country.content_en', value)
                    }}
                    onBlur={() => {
                      const value = content_en_editor.current.value
                      formik.setFieldValue('country.content_en', value)
                    }}
                    className={
                      formik.errors.country?.content_en && formik.touched.country?.content_en
                        ? 'input-error'
                        : ''
                    }
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputContentNl">{t('content')} (NL)</CFormLabel>
                  <JoditEditor
                    ref={content_nl_editor}
                    id="inputContentNl"
                    tabIndex={1}
                    value={formik.values.country.content_nl}
                    onChange={(value) => {
                      formik.setFieldValue('country.content_en', value)
                    }}
                    onBlur={() => {
                      const value = content_nl_editor.current.value
                      formik.setFieldValue('country.content_nl', value)
                    }}
                    className={
                      formik.errors.country?.content_nl && formik.touched.country?.content_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormLabel htmlFor="inputMetaDescription">{t('meta_description')}</CFormLabel>
                  <JoditEditor
                    id="inputMetaDescription"
                    tabIndex={1}
                    name="country.meta_description"
                  />
                </CCol>

                <CCol md={12}>
                  <CFormLabel htmlFor="selectDisable">{t('disable')}</CFormLabel>
                  <CFormSelect
                    id="disable"
                    name="country.disable"
                    aria-label="Default select example"
                    value={formik.values.country.disable}
                    onChange={formik.handleChange}
                  >
                    <option>Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputVillasDesc">{t('villas_desc')}</CFormLabel>
                  <CFormTextarea
                    id="inputVillasDesc"
                    tabIndex={1}
                    value={formik.values.country.villas_desc}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputApartmentDesc">{t('apartment_desc')}</CFormLabel>
                  <CFormTextarea
                    id="inputApartmentDesc"
                    tabIndex={1}
                    value={formik.values.country.apartment_desc}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputBbDesc">{t('bb_desc')}</CFormLabel>
                  <CFormTextarea
                    id="inputBbDesc"
                    tabIndex={1}
                    value={formik.values.country.bb_desc}
                    onChange={formik.handleChange}
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
                    label={t('dropdown')}
                    name="country.dropdown"
                    checked={formik.values.country.dropdown}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('country.dropdown', event.target.checked)
                    }}
                  />
                  <CFormCheck
                    id="inputSidebar"
                    name="country.sidebar"
                    label={t('sidebar')}
                    checked={formik.values.country.sidebar}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('country.sidebar', event.target.checked)
                    }}
                  />
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormInput type="file" id="inputImage" name="country.image" />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlugEn">{t('slug')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputSlugEn"
                    value={formik.values.country.slug_en}
                    onChange={formik.handleChange}
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
                  <CFormLabel htmlFor="inputSlugNl">{t('slug')} (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputSlugNl"
                    value={formik.values.country.slug_nl}
                    onChange={formik.handleChange}
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
                  <div className="button-container">
                    <CButton type="submit" className="create-form-button formik-btn">
                      {t('submit')}
                    </CButton>
                  </div>
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
