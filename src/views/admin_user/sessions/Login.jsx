import React, { Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardImage,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { login_data } from '@/api/admin_user/config/resources/sessions'
import { Toast } from '@admin_user_components/UI/Toast/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import adminLogin from '@/assets/images/adminLogin.jpeg'
import adminLogo from '@/assets/images/adminLogo.png'
import { useStores } from '@/context/storeContext'
import { useTranslation } from 'react-i18next'
import initializeI18n from '@/initializeI18n'

const Login = () => {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const authStore = useStores()
  const { t } = useTranslation()

  useEffect(() => {
    initializeI18n()

    return () => {
      // Clear the timeout if the component unmounts before the timeout is triggered
      clearTimeout()
    }
  }, [])

  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('*Username required'),
    password: Yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        try {
          const res = await login_data('post', 'sessions', values)
          if (res) {
            authStore.getState().setToken(res.auth_token, res.token_expires_at)
            authStore.getState().startTimeTracker()
            setErrorType('success')
            setError('Login Successfully')
            navigate('/admin-user/dashboard')
          }
        } catch (error) {
          setShowToast(true)
          setErrorType('danger')
          setError('Invalid Credentials')
        }
      }
    },
  })

  const handleToastHide = () => {
    setShowToast(false)
  }

  return (
    <Suspense fallback="Loading translations...">
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <div className="toast-container">
          {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
        </div>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol>
              <CCardGroup>
                <CCard>
                  <CRow className="g-0">
                    <CCol md={7}>
                      <CCardImage
                        style={{ height: '100%', width: '100%', objectFit: 'fit' }}
                        src={adminLogin}
                      />
                    </CCol>
                    <CCol md={5}>
                      <CCardBody className="p-4">
                        <CForm onSubmit={formik.handleSubmit}>
                          <div className="logo-container">
                            <img src={adminLogo} className="rounded-logo" />
                          </div>
                          <h1 className="custom-h1">{t('admin_login')}</h1>
                          <p className="text-medium-emphasis">{t('sign_in_to_your_account')}</p>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder={t('username')}
                              type="text"
                              id="inputEmail"
                              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="email"
                              className={
                                formik.errors?.email && formik.touched?.email ? 'input-error' : ''
                              }
                            />
                          </CInputGroup>
                          <div>
                            {formik.touched?.email && formik.errors?.email && (
                              <div className="formik-errors">{formik.errors?.email}</div>
                            )}
                          </div>
                          <CInputGroup className="mb-4 mt-4">
                            <CInputGroupText>
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder={t('password')}
                              type="password"
                              id="inputPassword"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="password"
                              className={
                                formik.errors?.password && formik.touched?.password
                                  ? 'input-error'
                                  : ''
                              }
                            />
                          </CInputGroup>
                          <div>
                            {formik.touched?.password && formik.errors?.password && (
                              <div className="formik-errors">{formik.errors?.password}</div>
                            )}
                          </div>
                          <CRow className="mt-5">
                            <CCol xs={6}>
                              <CButton color="primary" type="submit" className="px-4">
                                {t('login')}
                              </CButton>
                            </CCol>
                            <CCol xs={6} className="text-right">
                              <Link>{t('forgot_password')}</Link>
                            </CCol>
                          </CRow>
                        </CForm>
                      </CCardBody>
                    </CCol>
                  </CRow>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </Suspense>
  )
}

export default Login
