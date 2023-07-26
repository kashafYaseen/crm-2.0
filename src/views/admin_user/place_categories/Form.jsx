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
  CRow,
} from '@coreui/react'

import { Toast } from '@admin_user_components/UI/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { place_categories_data } from '@/api/admin_user/config/resources/place_categories'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'

const Form = observer((props) => {
  const authStore = useStores()
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')
  const authToken = authStore((state) => state.token)

  const initialValues = {
    place_category: {
      name_en: props.place_category_to_update?.name_en || '',
      name_nl: props.place_category_to_update?.name_nl || '',
      color_code: props.place_category_to_update?.color_code || '',
    },
  }

  const validationSchema = Yup.object().shape({
    place_category: Yup.object().shape({
      name_en: Yup.string().required('*Name is required'),
      name_nl: Yup.string().required('*Name is required'),
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
        if (props.place_category_to_update) {
          try {
            const extractedData = place_categories_data(
              'put',
              `place_categories/${props.place_category_to_update.id}`,
              values,
              null,
              authToken,
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
            const extractedData = await place_categories_data(
              'post',
              'place_categories',
              values,
              null,
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
            props.onSubmitCallback()
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
                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">Name (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEN"
                    value={formik.values.place_category.name_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="place_category.name_en"
                    className={
                      formik.errors.place_category?.name_en &&
                      formik.touched.place_category?.name_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.place_category?.name_en &&
                    formik.errors.place_category?.name_en && (
                      <div className="formik-errors">{formik.errors.place_category?.name_en}</div>
                    )}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">Color Code</CFormLabel>

                  <CFormInput
                    type="text"
                    id="input_color_code"
                    value={formik.values.place_category.color_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="place_category.color_code"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameNL">Name (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNL"
                    value={formik.values.place_category.name_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="place_category.name_nl"
                    className={
                      formik.errors.place_category?.name_nl &&
                      formik.touched.place_category?.name_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.place_category?.name_nl &&
                    formik.errors.place_category?.name_nl && (
                      <div className="formik-errors">{formik.errors.place_category?.name_nl}</div>
                    )}
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
})

export default Form
