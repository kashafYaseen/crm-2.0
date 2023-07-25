import React, { useState } from 'react'
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
  CFormTextarea,
  CRow,
} from '@coreui/react'

import { Toast } from '@admin_user_components/UI/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { amenities_data } from '@/api/admin_user/config/resources/amenities'

const Form = (props) => {
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')
  const initialValues = {
    amenity: {
      name_en: props.amenity_to_update?.name_en || '',
      name_nl: props.amenity_to_update?.name_nl || '',
      amenity_category_id: props.amenity_to_update?.amenity_category_id || '',
      icon: props.amenity_to_update?.icon || '',
      filter_enabled: props.amenity_to_update?.filter_enabled || '',
      hot: props.amenity_to_update?.hot || '',
      slug_nl: props.amenity_to_update?.slug_nl || '',
      slug_en: props.amenity_to_update?.slug_en || '',
    },
  }

  const validationSchema = Yup.object().shape({
    amenity: Yup.object().shape({
      name_nl: Yup.string().required('*Name is required'),
      amenity_category_id: Yup.string().required('*Amenity Category is required'),
    }),
  })

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
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        if (props.amenity_to_update) {
          try {
            const extractedData = amenities_data(
              'put',
              `amenities/${props.amenity_to_update.id}`,
              values,
            )
            setShowToast(true)
            setErrorType('success')
            setError('Record Updated Successfully')
            setTimeout(() => {
              setShowToast(false)
              props.onSubmitCallback()
            }, 2000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await amenities_data('post', 'amenities', values)
            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')

            setTimeout(() => {
              setShowToast(false)
              props.onSubmitCallback()
            }, 2000)
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
      {serverError && <div className="server-error-message">{serverError}</div>}
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Create New Place Category </strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol xs={12}>
                  <CFormLabel htmlFor="inputName">Name (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEN"
                    value={formik.values.amenity.name_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="amenity.name_en"
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="inputNameNL">Name (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNL"
                    value={formik.values.amenity.name_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="amenity.name_nl"
                    className={
                      formik.errors.amenity?.name_nl && formik.touched.amenity?.name_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.amenity?.name_nl && formik.errors.amenity?.name_nl && (
                    <div className="formik-errors">{formik.errors.amenity?.name_nl}</div>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="selectPublish4">Amenity Category</CFormLabel>
                  <CFormSelect
                    id="amenity_category_id"
                    value={formik.values.amenity.amenity_category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="amenity.amenity_category_id"
                    className={
                      formik.touched.amenity?.amenity_category_id &&
                      formik.errors.amenity?.amenity_category_id
                        ? 'input-error'
                        : ''
                    }
                  >
                    {[{ id: '', name: 'Select' }, ...props.amenityCategories].map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {formik.touched.amenity?.amenity_category_id &&
                    formik.errors.amenity?.amenity_category_id && (
                      <div className="formik-errors">
                        {formik.errors.amenity.amenity_category_id}
                      </div>
                    )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="inputName">Icon</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEN"
                    value={formik.values.amenity.icon}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="amenity.icon"
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="selectSearchFilter">Add to search filters</CFormLabel>
                  <CFormSelect
                    id="filter_enabled"
                    className="form-control"
                    value={formik.values.amenity.filter_enabled}
                    onChange={formik.handleChange}
                    name="amenity.filter_enabled"
                  >
                    <option value="">Select</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="selectHot">Hot</CFormLabel>
                  <CFormSelect
                    id="hot"
                    className="form-control"
                    value={formik.values.amenity.hot}
                    onChange={formik.handleChange}
                    name="amenity.hot"
                  >
                    <option value="">Select</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="inputSlug">Slug (NL)</CFormLabel>
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows="3"
                    type="text"
                    value={formik.values.amenity.slug_nl}
                    onChange={formik.handleChange}
                    name="amenity.slug_nl"
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="inputSlug">Slug (EN)</CFormLabel>
                  <CFormTextarea
                    id="exampleFormControlTextarea1"
                    rows="3"
                    type="text"
                    value={formik.values.amenity.slug_en}
                    onChange={formik.handleChange}
                    name="amenity.slug_en"
                  />
                </CCol>

                <CCol xs={12}>
                  <CButton type="submit" className="create-button">
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
