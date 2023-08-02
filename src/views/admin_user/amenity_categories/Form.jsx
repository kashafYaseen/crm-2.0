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
import { amenity_categories_data } from '@/api/admin_user/config/resources/amenityCategories'
import { useStores } from '@/context/storeContext'
import { useTranslation } from 'react-i18next'

const Form = (props) => {
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')
  const authStore = useStores()
  const authToken = authStore((state) => state.token)
  const { t } = useTranslation()

  const initialValues = {
    amenity_category: {
      name_en: props.amenity_category_to_update?.name_en || '',
      name_nl: props.amenity_category_to_update?.name_nl || '',
    },
  }

  const validationSchema = Yup.object().shape({
    amenity_category: Yup.object().shape({
      name_en: Yup.string().required('*Name (EN) is required'),
      name_nl: Yup.string().required('*Name (NL) is required'),
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
        if (props.amenity_category_to_update) {
          try {
            const extractedData = amenity_categories_data(
              'put',
              `amenity_categories/${props.amenity_category_to_update.id}`,
              values,
              {},
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError(t('record_updated_successfully'))
            setTimeout(() => {
              setShowToast(false)
              props.onSubmitCallback()
            }, 2000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await amenity_categories_data(
              'post',
              'amenity_categories',
              values,
              {},
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError(t('record_created_successfully'))
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
            {props.amenity_category_to_update ? (
              <CCardHeader>
                <strong>
                  {t('edit')} {t('amenity_category')}
                </strong>
              </CCardHeader>
            ) : (
              <CCardHeader>
                <strong> {t('create_new_amenity_category')}</strong>
              </CCardHeader>
            )}
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol xs={12}>
                  <CFormLabel htmlFor="inputName">{t('name')} (EN)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameEN"
                    value={formik.values.amenity_category.name_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="amenity_category.name_en"
                    className={
                      formik.errors.amenity_category?.name_en &&
                      formik.touched.amenity_category?.name_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.amenity_category?.name_en &&
                    formik.errors.amenity_category?.name_en && (
                      <div className="formik-errors">{formik.errors.amenity_category?.name_en}</div>
                    )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="inputNameNL">{t('name')} (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNL"
                    value={formik.values.amenity_category.name_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="amenity_category.name_nl"
                    className={
                      formik.errors.amenity_category?.name_nl &&
                      formik.touched.amenity_category?.name_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.amenity_category?.name_nl &&
                    formik.errors.amenity_category?.name_nl && (
                      <div className="formik-errors">{formik.errors.amenity_category?.name_nl}</div>
                    )}
                </CCol>

                <CCol xs={12}>
                  <CButton type="submit" className="create-button">
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
}

export default Form
