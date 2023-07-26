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
  CFormTextarea,
  CFormSelect,
  CFormCheck,
} from '@coreui/react'

import { Toast } from '@/components/UI/Toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '@/scss/_custom.scss'
import { experiences_data } from '@/api/admin_user/config/resources/experiences'

const Form = (props) => {
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')

  const initialValues = {
    experience: {
      name_en: props.experience_to_update?.name_en || '',
      name_nl: props.experience_to_update?.name_nl || '',
      guests: props.experience_to_update?.guests || '',
      short_desc: props.experience_to_update?.short_desc || '',
      priority: props.experience_to_update?.priority || '',
      publish: props.experience_to_update?.publish || '',
    },
  }

  const validationSchema = Yup.object().shape({
    experience: Yup.object().shape({
      name_en: Yup.string().required('*Name is required'),
      name_nl: Yup.string().required('*Name is required'),
      guests: Yup.number().integer().required('*Please type a number'),
    }),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        if (props.experience_to_update) {
          try {
            const extractedData = experiences_data(
              'put',
              `experiences/${props.experience_to_update.id}`,
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
            console.error(error)
          }
        } else {
          try {
            const extractedData = await experiences_data('post', 'experiences', values)
            setShowToast(true)
            setErrorType('success')
            setError('Record Created Successfully')
            setTimeout(() => {
              setShowToast(false)
              props.onSubmitCallback()
            }, 2000)
          } catch (error) {
            console.error(error)
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
                    value={formik.values.experience.name_en}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="experience.name_en"
                    className={
                      formik.errors.experience?.name_en && formik.touched.experience?.name_en
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.experience?.name_en && formik.errors.experience?.name_en && (
                    <div className="formik-errors">{formik.errors.experience?.name_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputNameNL">Name (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputNameNL"
                    value={formik.values.experience.name_nl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="experience.name_nl"
                    className={
                      formik.errors.experience?.name_nl && formik.touched.experience?.name_nl
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.experience?.name_nl && formik.errors.experience?.name_nl && (
                    <div className="formik-errors">{formik.errors.experience?.name_nl}</div>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="select_guests">Number of Guests</CFormLabel>
                  <CFormInput
                    type="text"
                    id="input_guests"
                    value={formik.values.experience.guests}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="experience.guests"
                  />
                  {formik.touched.experience?.guests && formik.errors.experience?.guests && (
                    <div className="formik-errors">{formik.errors.experience?.guests}</div>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="priority">Priority</CFormLabel>
                  <CFormSelect
                    id="priority"
                    className="form-control"
                    value={formik.values.experience.priority}
                    onChange={formik.handleChange}
                    name="experience.priority"
                  >
                    <option value="">Select</option>
                    <option value="lowest">Lowest</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="highest">Highest</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="shortDesc">Description</CFormLabel>
                  <CFormTextarea
                    id="short_desc"
                    rows="3"
                    type="text"
                    value={formik.values.experience.short_desc}
                    onChange={formik.handleChange}
                    name="experience.short_desc"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormCheck
                    type="checkbox"
                    id="gridCheck"
                    label="publish"
                    checked={formik.values.experience.publish}
                    onChange={(event) => {
                      formik.handleChange(event)
                      formik.setFieldValue('experience.publish', event.target.checked)
                    }}
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
