import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CCardImage,
  CRow,
} from '@coreui/react'

import { Toast } from '@/components/UI/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import ownerLogo from '@/assets/images/ownerLogo.png'
import { accept_invite_data } from '@/api/business_owner/config/resources/invitations'
import { useNavigate } from 'react-router-dom'
import i18next from 'i18next'

const Form = observer((props) => {
  const authStore = useStores()
  const [showToast, setShowToast] = useState(false)
  const [alert, setAlert] = useState('')
  const [alertType, setAlertType] = useState('')
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const initialValues = {
    owner: {
      first_name: props?.first_name || '',
      last_name: props?.last_name || '',
      email: props?.email || '',
      password: props?.password || '',
      password_confirmation: props?.password_confirmation || '',
    },
  }

  const validationSchema = Yup.object().shape({
    owner: Yup.object().shape({
      email: Yup.string().required('*Email is required'),
      password: Yup.string().required('*Password is required'),
      password_confirmation: Yup.string().required('*Password is required'),
    }),
  })

  const serverErrorHandler = (error) => {
    if (error.response && error.response.data) {
      const nameError = error.response.data
      if (nameError) {
        setShowToast(true)
        setAlertType('danger')
        setAlert(nameError.error)
      }
    } else {
      setShowToast(true)
      setAlertType('danger')
      setAlert('Something went wrong')
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        try {
          const { auth_token, token_expires_at } = await accept_invite_data(
            'put',
            `invitations/${values.owner.email}`,
            values,
          )
          if (auth_token && token_expires_at) {
            authStore.getState().setToken(auth_token, token_expires_at)
            authStore.getState().startTimeTracker()
            setShowToast(true)
            setAlertType('success')
            setAlert('Login Successfully')
            setTimeout(() => {
              navigate(`/${i18next.language}/business-owner/dashboard`)
            }, 2000)
          } else {
            setShowToast(true)
            setAlertType('danger')
            setAlert('Something went wrong')
          }
        } catch (error) {
          serverErrorHandler(error)
        }
      }
    },
  })

  const handleToastHide = () => {
    setShowToast(false)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="toast-container">
        {showToast && <Toast error={alert} onExited={handleToastHide} type={alertType} />}
      </div>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCardGroup>
            <CCard className="text-white bg-color py-5">
              <CCardBody className="text-center">
                <div className="mt-5">
                  <h2>Start your journey with us</h2>
                </div>
                <div className="mt-5">
                  <p>
                    Welcome to Nice2stay! We are a premier travel platform dedicated to showcasing
                    exceptional vacation accommodations. By registering your villa or hotel with us,
                    you'll join our handpicked collection of unique and luxurious properties. Our
                    passion for extraordinary stays and personalized service ensures that your
                    property will be showcased to discerning travelers seeking unforgettable
                    experiences. Join us in offering exclusive and authentic getaways to our global
                    audience of travelers.
                  </p>
                </div>
              </CCardBody>
            </CCard>

            <CCard className="p-4">
              <CCardHeader>
                <CCardImage className="logo" src={ownerLogo} />
                <strong className="title">Business Owner Invitation Form</strong>
              </CCardHeader>

              <CCardBody>
                <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                  <CCol md={12}>
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
                  <CCol md={12}>
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
                      <div className="formik-errors">{formik.errors.owner?.first_name}</div>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
                    <CFormInput
                      type="text"
                      id="inputEmail"
                      value={formik.values.owner.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="owner.email"
                      className={
                        formik.errors.owner?.email && formik.touched.owner?.email
                          ? 'input-error'
                          : ''
                      }
                    />
                    {formik.touched.owner?.email && formik.errors.owner?.email && (
                      <div className="formik-errors">{formik.errors.owner?.email}</div>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="inputPassword">Password</CFormLabel>
                    <CFormInput
                      type="text"
                      id="inputPassword"
                      value={formik.values.owner.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="owner.password"
                      className={
                        formik.errors.owner?.password && formik.touched.owner?.password
                          ? 'input-error'
                          : ''
                      }
                    />
                    {formik.touched.owner?.password && formik.errors.owner?.password && (
                      <div className="formik-errors">{formik.errors.owner?.password}</div>
                    )}
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="inputPasswordConfirmation">
                      Password Confirmation
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="inputPasswordConfirmation"
                      value={formik.values.owner.password_confirmation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="owner.password_confirmation"
                      className={
                        formik.errors.owner?.password_confirmation &&
                        formik.touched.owner?.password_confirmation
                          ? 'input-error'
                          : ''
                      }
                    />
                    {formik.touched.owner?.password_confirmation &&
                      formik.errors.owner?.password_confirmation && (
                        <div className="formik-errors">
                          {formik.errors.owner?.password_confirmation}
                        </div>
                      )}
                  </CCol>

                  <CCol xs={12}>
                    <CButton type="submit" className="submit-button">
                      Submit
                    </CButton>
                  </CCol>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </div>
  )
})

export default Form
