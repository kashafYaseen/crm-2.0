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
import { Toast } from '@/components/UI/Toast/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import JoditEditor from 'jodit-react'
import { useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Alert } from 'reactstrap'

const Form = observer((props) => {
  const authStore = useStores()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [alert, setAlert] = useState('')
  const [alertType, setAlertType] = useState('')
  const [serverError, setServerError] = useState('')
  const authToken = authStore((state) => state.token)
  const content_en_editor = useRef(null)
  const content_nl_editor = useRef(null)
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)

  const initialValues = {
    country: {
      name_en: props.country_to_update?.name_en || '',
      name_nl: props.country_to_update?.name_nl || '',
      slug_en: props.country_to_update?.slug_en || '',
      slug_nl: props.country_to_update?.slug_nl || '',
      content_en: props.country_to_update?.content_en || '',
      content_nl: props.country_to_update?.content_nl || '',
      title_en: props.country_to_update?.title_en || '',
      title_nl: props.country_to_update?.title_nl || '',
      meta_title_en: props.country_to_update?.meta_title_en || '',
      meta_title_nl: props.country_to_update?.meta_title_nl || '',
      disable: props.country_to_update?.disable || '',
      villas_desc: props.country_to_update?.villas_desc || '',
      apartment_desc: props.country_to_update?.apartment_desc || '',
      bb_desc: props.country_to_update?.bb_desc || '',
      dropdown: props.country_to_update?.dropdown || '',
      sidebar: props.country_to_update?.sidebar || '',
    },
  }

  useEffect(() => {
    return () => {
      // Clear the timeout if the component unmounts before the timeout is triggered
      clearTimeout()
    }
  }, [])

  const serverErrorHandler = (error) => {
    setVisible(true)
    setServerError('An error occurred. Please try again: ' + error.toString())
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
        if (props.country_to_update) {
          try {
            const extractedData = await countries_data(
              'put',
              `countries/${props.country_to_update.id}`,
              values,
              {},
              authToken,
            )
            setShowToast(true)
            setAlertType('success')
            setAlert(t('record_updated_successfully'))
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
            setAlertType('success')
            setAlert(t('record_created_successfully'))
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
          <Link to={`/${i18next.language}/admin-user/countries`}>{t('country')}</Link>
        </CBreadcrumbItem>
        {props.country_to_update ? (
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
