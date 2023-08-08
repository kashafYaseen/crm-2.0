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
  CRow,
  CBreadcrumb,
  CBreadcrumbItem,
} from '@coreui/react'
import { Toast } from '@admin_user_components/UI/Toast/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import { partners_data } from '@/api/admin_user/config/resources/partners'

const Form = observer((props) => {
  const authStore = useStores()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [serverError, setServerError] = useState('')
  const authToken = authStore((state) => state.token)

  const initialValues = {
    owner: {
      admin_user_id: props.owner_data?.admin_user_id || '',
      first_name: props.owner_data?.first_name || '',
      last_name: props.owner_data?.last_name || '',
      email: props.owner_data?.email || '',
      pre_payment: props.owner_data?.pre_payment || '',
      final_payment: props.owner_data?.final_payment || '',
    },
  }

  useEffect(() => {
    return () => {
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
    owner: Yup.object().shape({
      email: Yup.string().required('*Email is required'),
    }),
  })

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
            setErrorType('success')
            setError('Record Updated Successfully')
            setTimeout(() => {
              navigate('/admin-user/partners')
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await partners_data('post', 'owners', values, {}, authToken)

            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
            setTimeout(() => {
              navigate('/admin-user/partners')
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
          <Link to="/admin-user/partners">Partner</Link>
        </CBreadcrumbItem>
        {props.owner_data ? (
          <CBreadcrumbItem active>Edit Partner</CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem active>New Partner</CBreadcrumbItem>
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
              <strong>New Partner</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputAdminUserId">Visited By</CFormLabel>
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
                        {admin.first_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
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
                  <CFormLabel htmlFor="inputFirstName">First Name</CFormLabel>
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
                  <CFormLabel htmlFor="inputLastName">Last Name</CFormLabel>
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

                <CCol md={6}>
                  <CFormLabel htmlFor="inputPrePayment">Pre Payment</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputPrePayment"
                    value={formik.values.owner.pre_payment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.pre_payment"
                    className={
                      formik.errors.owner?.pre_payment && formik.touched.owner?.pre_payment
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.owner?.pre_payment && formik.errors.owner?.pre_payment && (
                    <div className="formik-errors">{formik.errors.owner?.pre_payment}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputFinalPayment">Final Payment</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputFinalPayment"
                    value={formik.values.owner.final_payment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="owner.final_payment"
                    className={
                      formik.errors.owner?.final_payment && formik.touched.owner?.final_payment
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.owner?.final_payment && formik.errors.owner?.final_payment && (
                    <div className="formik-errors">{formik.errors.owner?.final_payment}</div>
                  )}
                </CCol>

                {/* This attribute is not saving at backend temporarily */}
                <CCol md={12}>
                  <CFormLabel htmlFor="inputImage">Image</CFormLabel>
                  <CFormInput type="file" id="inputImage" name="region.image" />
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
