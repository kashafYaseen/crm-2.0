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

import { Toast } from '@/components/UI/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { amenity_categories_data } from '@/api/admin_user/config/resources/amenityCategories'
import { useStores } from '@/context/storeContext'
import { useTranslation } from 'react-i18next'
import { Alert } from 'reactstrap'

const Form = (props) => {
  const [showToast, setShowToast] = useState(false)
  const [alert, setAlert] = useState('')
  const [alertType, setAlertType] = useState('')
  const [serverError, setServerError] = useState('')
  const authStore = useStores()
  const authToken = authStore((state) => state.token)
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)

  const initialValues = {
    amenity_category: {
      name_en: props.amenity_category_to_update?.name_en || '',
      name_nl: props.amenity_category_to_update?.name_nl || '',
    },
  }

  const validationSchema = Yup.object().shape({
    amenity_category: Yup.object().shape({
      name_en: Yup.string().required(t('name_is_required')),
      name_nl: Yup.string().required(t('name_is_required')),
    }),
  })

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
            setAlertType('success')
            setAlert(t('record_updated_successfully'))
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
            setAlertType('success')
            setAlert(t('record_created_successfully'))
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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
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
}

export default Form
