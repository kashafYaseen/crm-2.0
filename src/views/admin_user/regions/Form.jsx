import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormSwitch,
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
import { regions_data } from '@/api/admin_user/config/resources/regions'
import { Toast } from '@admin_user_components/UI/Toast/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import JoditEditor from 'jodit-react'
import { useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'

const Form = observer((props) => {
  const authStore = useStores()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')
  const authToken = authStore((state) => state.token)
  const content_en_editor = useRef(null)
  const content_nl_editor = useRef(null)

  const initialValues = {
    region: {
      name_en: props.region_data?.name_en || '',
      name_nl: props.region_data?.name_nl || '',
      slug_en: props.region_data?.slug_en || '',
      slug_nl: props.region_data?.slug_nl || '',
      content_en: props.region_data?.content_en || '',
      content_nl: props.region_data?.content_nl || '',
      title_en: props.region_data?.title_en || '',
      title_nl: props.region_data?.title_nl || '',
      meta_title_en: props.region_data?.meta_title_en || '',
      meta_title_nl: props.region_data?.meta_title_nl || '',
      short_desc: props.region_data?.short_desc || '',
      published: props.region_data?.published || '',
      country_id: props.region_data?.country_id || '',
      villas_desc: props.region_data?.villas_desc || '',
      apartment_desc: props.region_data?.apartment_desc || '',
      bb_desc: props.region_data?.bb_desc || '',
    },
  }

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
    region: Yup.object().shape({
      name_en: Yup.string().required('*Name is required'),
      name_nl: Yup.string().required('*Name is required'),
      country_id: Yup.string().required('*Country is required'),
    }),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        if (props.region_data) {
          try {
            const extractedData = await regions_data(
              'put',
              `regions/${props.region_data.id}`,
              values,
              {},
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError('Record Updated Successfully')
            setTimeout(() => {
              navigate('/admin-user/regions')
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await regions_data('post', 'regions', values, {}, authToken)

            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
            setTimeout(() => {
              navigate('/admin-user/regions')
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
          <Link to="/admin-user/regions">Region</Link>
        </CBreadcrumbItem>
        {props.region_data ? (
          <CBreadcrumbItem active>Edit Region</CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem active>New Region</CBreadcrumbItem>
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
              <strong>New Region</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputCountryId">Country</CFormLabel>
                  <CFormSelect
                    id="country_id"
                    value={formik.values.region.country_id}
                    onChange={formik.handleChange}
                    name="region.country_id"
                    className={
                      formik.touched.region?.country_id && formik.errors.region?.country_id
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
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputPublished">Publish</CFormLabel>
                  <CFormSwitch
                    size="lg"
                    id="inputPublish"
                    onChange={formik.handleChange}
                    name="region.published"
                    className={
                      formik.errors.region?.published && formik.touched.region?.published
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.published && formik.errors.region?.published && (
                    <div className="formik-errors">{formik.errors.region?.published}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameEn">Name en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEn"
                    value={formik.values.region.name_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.name_en"
                    className={
                      formik.errors.region?.name_en && formik.touched.region?.name_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.name_en && formik.errors.region?.name_en && (
                    <div className="formik-errors">{formik.errors.region?.name_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameNl">Name nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNl"
                    value={formik.values.region.name_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.name_nl"
                    className={
                      formik.errors.region?.name_nl && formik.touched.region?.name_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.name_nl && formik.errors.region?.name_nl && (
                    <div className="formik-errors">{formik.errors.region?.name_nl}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputTitleEn">Title en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputTitleEn"
                    value={formik.values.region.title_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.title_en"
                    className={
                      formik.errors.region?.title_en && formik.touched.region?.title_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.title_en && formik.errors.region?.title_en && (
                    <div className="formik-errors">{formik.errors.region?.title_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputTitleNl">Title nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputTitleNl"
                    value={formik.values.region.title_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.title_nl"
                    className={
                      formik.errors.region?.title_nl && formik.touched.region?.title_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.title_nl && formik.errors.region?.title_nl && (
                    <div className="formik-errors">{formik.errors.region?.title_nl}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputMetaTitleEn">Meta Title en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputMetaTitleEn"
                    value={formik.values.region.meta_title_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.meta_title_en"
                    className={
                      formik.errors.region?.meta_title_en && formik.touched.region?.meta_title_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.meta_title_en && formik.errors.region?.meta_title_en && (
                    <div className="formik-errors">{formik.errors.region?.meta_title_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputMetaTitleNl">Meta Title nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputMetaTitleNl"
                    value={formik.values.region.meta_title_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.meta_title_nl"
                    className={
                      formik.errors.region?.meta_title_nl && formik.touched.region?.meta_title_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.meta_title_nl && formik.errors.region?.meta_title_nl && (
                    <div className="formik-errors">{formik.errors.region?.meta_title_nl}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputContentEn">Content en</CFormLabel>
                  <JoditEditor
                    ref={content_en_editor}
                    id="inputContentEn"
                    tabIndex={1}
                    value={formik.values.region.content_en}
                    onChange={(value) => {
                      formik.setFieldValue('region.content_en', value)
                    }}
                    onBlur={() => {
                      const value = content_en_editor.current.value
                      formik.setFieldValue('region.content_en', value)
                    }}
                    className={
                      formik.errors.region?.content_en && formik.touched.region?.content_en
                        ? 'input-error'
                        : ''
                    }
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputContentNl">Content nl</CFormLabel>
                  <JoditEditor
                    ref={content_nl_editor}
                    id="inputContentNl"
                    tabIndex={1}
                    value={formik.values.region.content_nl}
                    onChange={(value) => {
                      formik.setFieldValue('region.content_nl', value)
                    }}
                    onBlur={() => {
                      const value = content_nl_editor.current.value
                      formik.setFieldValue('region.content_nl', value)
                    }}
                    className={
                      formik.errors.region?.content_nl && formik.touched.region?.content_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormLabel htmlFor="inputMetaDescription">Meta Description</CFormLabel>
                  <JoditEditor
                    id="inputMetaDescription"
                    tabIndex={1}
                    name="region.meta_description"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputShortDesc">Short desc</CFormLabel>
                  <CFormTextarea
                    type="text"
                    id="inputShortDesc"
                    tabIndex={1}
                    value={formik.values.region.short_desc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.short_desc"
                    className={
                      formik.errors.region?.short_desc && formik.touched.region?.short_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.short_desc && formik.errors.region?.short_desc && (
                    <div className="formik-errors">{formik.errors.region?.short_desc}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputVillasDesc">Villas desc</CFormLabel>
                  <CFormTextarea
                    type="text"
                    id="inputVillasDesc"
                    tabIndex={1}
                    value={formik.values.region.villas_desc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.villas_desc"
                    className={
                      formik.errors.region?.villas_desc && formik.touched.region?.villas_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.villas_desc && formik.errors.region?.villas_desc && (
                    <div className="formik-errors">{formik.errors.region?.villas_desc}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputApartmentDesc">Apartment desc</CFormLabel>
                  <CFormTextarea
                    type="text"
                    id="inputApartmentDesc"
                    tabIndex={1}
                    value={formik.values.region.apartment_desc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.apartment_desc"
                    className={
                      formik.errors.region?.apartment_desc && formik.touched.region?.apartment_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.apartment_desc &&
                    formik.errors.region?.apartment_desc && (
                      <div className="formik-errors">{formik.errors.region?.apartment_desc}</div>
                    )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputBbDesc">Bb desc</CFormLabel>
                  <CFormTextarea
                    type="text"
                    id="inputBbDesc"
                    tabIndex={1}
                    value={formik.values.region.bb_desc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.bb_desc"
                    className={
                      formik.errors.region?.bb_desc && formik.touched.region?.bb_desc
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.bb_desc && formik.errors.region?.bb_desc && (
                    <div className="formik-errors">{formik.errors.region?.bb_desc}</div>
                  )}
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormInput type="file" id="inputImage" name="region.image" />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlugEn">Slug en</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputSlugEn"
                    value={formik.values.region.slug_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.slug_en"
                    className={
                      formik.errors.region?.slug_en && formik.touched.region?.slug_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.slug_en && formik.errors.region?.slug_en && (
                    <div className="formik-errors">{formik.errors.region?.slug_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputSlugNl">Slug nl</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputSlugNl"
                    value={formik.values.region.slug_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="region.slug_nl"
                    className={
                      formik.errors.region?.slug_nl && formik.touched.region?.slug_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.region?.slug_nl && formik.errors.region?.slug_nl && (
                    <div className="formik-errors">{formik.errors.region?.slug_nl}</div>
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
})

export default Form
