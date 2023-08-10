import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CBreadcrumb,
  CBreadcrumbItem,
  CFormTextarea,
  CRow,
  CFormSwitch,
} from '@coreui/react'
import { regions_data } from '@/api/admin_user/config/resources/regions'
import { campaigns_data } from '@/api/admin_user/config/resources/campaigns'
import { Toast } from '@admin_user_components/UI/Toast/Toast'
import JoditEditor from 'jodit-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { useStores } from '@/context/storeContext'
import { observer } from 'mobx-react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Form = observer((props) => {
  const authStore = useStores()
  const [regionsData, setRegionsData] = useState([])
  const desc_editor_en = useRef(null)
  const desc_editor_nl = useRef(null)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const navigate = useNavigate()
  const [fetchingRegionsByCountry, setFetchingRegionsByCountry] = useState(false)

  const authToken = authStore((state) => state.token)
  const [serverError, setServerError] = useState('')
  const { t } = useTranslation()

  const [selectedAdditionalCategories, setSelectedAdditionalCategories] = useState([])

  const [loadingCategory, setLoadingCategory] = useState({})

  const [categoryResponses, setCategoryResponses] = useState({})

  const CATEGORY = {
    0: 'experiences',
    1: 'categories',
    2: 'guests',
    3: 'amenities',
  }
  const defaultAdditionalCategorySets = props.campaign_to_update
    ? Object.entries(props.campaign_to_update.category || {}).map(([key, value], index) => {
        const categoryKey = key.replace(/-\d+$/, '')
        const mappedCategory = Object.keys(CATEGORY).find(
          (category) => CATEGORY[category] === categoryKey,
        )
        return {
          id: index,
          category: mappedCategory || '',
          value: value,
        }
      })
    : [{ id: 0, category: '', value: '' }]

  const [additionalCategorySets, setAdditionalCategorySets] = useState(
    defaultAdditionalCategorySets,
  )

  const addMoreCategory = () => {
    setAdditionalCategorySets((prevSets) => [...prevSets, { id: prevSets.length, category: '' }])
  }

  const handleAdditionalCategoryChange = async (index, event) => {
    const newCategorySets = [...additionalCategorySets]
    newCategorySets[index].category = event.target.value
    newCategorySets[index].value = ''
    setAdditionalCategorySets(newCategorySets)

    // Use the latest state values here
    const updatedSelectedCategories = newCategorySets.map((set) => set.category)
    setSelectedAdditionalCategories(updatedSelectedCategories)
    try {
      const updatedCategory = updatedSelectedCategories[index]
      if (updatedCategory && !categoryResponses[updatedSelectedCategories[index]]) {
        setLoadingCategory((prevLoading) => ({
          ...prevLoading,
          [updatedCategory]: true,
        }))
        const response = await campaigns_data(
          'get',
          `campaigns/options`,
          null,
          { category: CATEGORY[updatedCategory] },
          authToken,
        )

        setCategoryResponses((prevCategoryResponses) => {
          const updatedCategoryResponses = { ...prevCategoryResponses }
          updatedCategoryResponses[updatedCategory] = response.data
          return updatedCategoryResponses
        })

        setLoadingCategory((prevLoading) => ({
          ...prevLoading,
          [updatedCategory]: false,
        }))
      }
    } catch (error) {
      console.error('Error fetching records:', error)
      setLoadingCategory((prevLoading) => ({
        ...prevLoading,
        [updatedCategory]: false,
      }))
    }
  }

  const defaultValues = {
    campaign: {
      title_nl: props.campaign_to_update?.title_nl || '',
      title_en: props.campaign_to_update?.title_en || '',
      description_nl: props.campaign_to_update?.description_nl || '',
      description_en: props.campaign_to_update?.description_en || '',
      country_id: props.campaign_to_update?.country_id || '',
      region_id: props.campaign_to_update?.region_id || '',
      min_price: props.campaign_to_update?.min_price || '',
      max_price: props.campaign_to_update?.max_price || '',
      from: props.campaign_to_update?.from || '',
      to: props.campaign_to_update?.to || '',

      collection: props.campaign_to_update?.collection || false,
      footer: props.campaign_to_update?.footer || false,
      top_menu: props.campaign_to_update?.top_menu || false,
      homepage: props.campaign_to_update?.homepage || false,
      popular_homepage: props.campaign_to_update?.popular_homepage || false,
      popular_search: props.campaign_to_update?.popular_search || false,
      category: props.campaign_to_update?.category || {},
    },
  }

  const validationSchema = Yup.object().shape({
    campaign: Yup.object().shape({
      title_en: Yup.string().required('*Title EN is Required'),
      title_nl: Yup.string().required('*Title NL is Required'),
    }),
  })

  const serverErrorHandler = (error) => {
    setServerError('An error occurred. Please try again: ' + error.toString())
  }

  useEffect(() => {
    const updatedCategoryValues = {}
    additionalCategorySets.forEach((set, index) => {
      const selectedCategoryKey = selectedAdditionalCategories[index]
      if (selectedCategoryKey && set.value) {
        const uniqueCategoryKey = `${CATEGORY[selectedCategoryKey]}-${index + 1}`
        updatedCategoryValues[uniqueCategoryKey] = set.value
      }
    })

    formik.setValues({
      ...formik.values,
      campaign: {
        ...formik.values.campaign,
        category: {
          ...formik.values.campaign.category,
          ...updatedCategoryValues,
        },
      },
    })
  }, [additionalCategorySets, selectedAdditionalCategories])

  const fetchRegionsByCountry = async (countryId) => {
    try {
      if (countryId) {
        setFetchingRegionsByCountry(true)
        const response = await regions_data(
          'get',
          `countries/${countryId}/regions`,
          null,
          {},
          authToken,
        )
        setRegionsData(response.data)
        setFetchingRegionsByCountry(false)
      }
    } catch (error) {
      console.error('Error fetching regions:', error)
      setFetchingRegionsByCountry(false)
    }
  }

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value
    formik.handleChange(event) // Handle the formik change event for the country select
    fetchRegionsByCountry(selectedCountryId) // Fetch the regions based on the selected country
  }

  const handleToastHide = () => {
    setShowToast(false)
  }

  useEffect(() => {
    const fetchRegionsForEdit = async () => {
      if (props.campaign_to_update?.country_id) {
        fetchRegionsByCountry(props.campaign_to_update.country_id)
      }
    }

    if (props.campaign_to_update?.category) {
      // Fetch options for each selected category when editing
      Object.entries(props.campaign_to_update.category).forEach(([categoryKey, value], index) => {
        const mappedCategory = Object.keys(CATEGORY).find(
          (category) => CATEGORY[category] === categoryKey.replace(/-\d+$/, ''),
        )
        if (mappedCategory) {
          handleAdditionalCategoryChange(index, { target: { value: mappedCategory } })
        }
      })
    }
    fetchRegionsForEdit()
  }, [props.campaign_to_update])

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await formik.validateForm()
      if (formik.isValid) {
        if (props.campaign_to_update) {
          try {
            const extractedData = await campaigns_data(
              'put',
              `campaigns/${props.campaign_to_update.id}`,
              values,
              {},
              authToken,
            )
            setShowToast(true)
            setErrorType('success')
            setError(t('record_updated_successfully'))
            setTimeout(() => {
              navigate(`/${i18next.language}/admin-user/campaigns`)
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        } else {
          try {
            const extractedData = await campaigns_data('post', 'campaigns', values, {}, authToken)
            setShowToast(true)
            setErrorType('success')
            setError(t('record_created_successfully'))
            setTimeout(() => {
              navigate(`/${i18next.language}/admin-user/campaigns`)
            }, 1000)
          } catch (error) {
            serverErrorHandler(error)
          }
        }
      }
    },
  })

  const handleRemoveCategory = (indexToRemove) => {
    let newCategorySets = {}
    setAdditionalCategorySets((prevCategorySets) => {
      newCategorySets = [...prevCategorySets]
      newCategorySets.splice(indexToRemove, 1)
      return newCategorySets
    })

    formik.setValues((prevValues) => {
      setSelectedAdditionalCategories((prevSelectedCategories) => {
        const newSelectedCategories = [...prevSelectedCategories]
        newSelectedCategories.splice(indexToRemove, 1)

        return newSelectedCategories
      })
      return {
        ...prevValues,
        campaign: {
          ...prevValues.campaign,
          category: newCategorySets,
        },
      }
    })
  }

  return (
    <div className="display">
      {serverError && <div className="server-error-message">{serverError}</div>}

      <CBreadcrumb>
        <CBreadcrumbItem>
          <Link to={`/${i18next.language}/admin-user/campaigns`}>{t('campaigns')}</Link>
        </CBreadcrumbItem>
        {props.campaign_to_update ? (
          <CBreadcrumbItem active>{t('edit')}</CBreadcrumbItem>
        ) : (
          <CBreadcrumbItem active>{t('new')}</CBreadcrumbItem>
        )}
      </CBreadcrumb>
      <div className="toast-container">
        {showToast && <Toast error={error} onExited={handleToastHide} type={errorType} />}
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('title')} (EN) </CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputtitle"
                    value={formik.values.campaign.title_en || ''}
                    onChange={formik.handleChange}
                    name="campaign.title_en"
                  />

                  {formik.touched.campaign?.title_en && formik.errors.campaign?.title_en && (
                    <div className="formik-errors">{formik.errors.campaign?.title_en}</div>
                  )}
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('title')} (NL)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="inputName"
                    value={formik.values.campaign.title_nl || ''}
                    onChange={formik.handleChange}
                    name="campaign.title_nl"
                  />
                  {formik.touched.campaign?.title_nl && formik.errors.campaign?.title_nl && (
                    <div className="formik-errors">{formik.errors.campaign?.title_nl}</div>
                  )}
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="Desc">{t('description')} (NL) </CFormLabel>
                  <JoditEditor
                    ref={desc_editor_nl}
                    tabIndex={1}
                    onBlur={() => {
                      const value = desc_editor_nl.current.value
                      formik.setFieldValue('campaign.description_nl', value)
                    }}
                    value={formik.values.campaign.description_nl}
                    onChange={(value) => {
                      formik.setFieldValue('campaign.description_nl', value)
                    }}
                  />
                </CCol>

                <CCol xs={12}>
                  <CFormLabel htmlFor="Desc">{t('description')} (EN) </CFormLabel>
                  <JoditEditor
                    ref={desc_editor_en}
                    tabIndex={1}
                    onBlur={() => {
                      const value = desc_editor_en.current.value
                      formik.setFieldValue('campaign.description_en', value)
                    }}
                    value={formik.values.campaign.description_en}
                    onChange={(value) => {
                      formik.setFieldValue('campaign.description_en', value)
                    }}
                  />
                </CCol>

                {additionalCategorySets.map((set, index) => (
                  <div key={index} className="row">
                    <CCol md={6}>
                      <CFormLabel htmlFor={`selectPublish4_${set.id}`}>{t('category')}</CFormLabel>
                      <CFormSelect
                        onChange={(event) => handleAdditionalCategoryChange(index, event)}
                        value={set.category}
                      >
                        <option value="">Select</option>
                        {Object.entries(CATEGORY).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>

                    {/* ... Subsequent Dropdown field ... */}
                    <CCol md={6}>
                      <CFormLabel htmlFor={`selectPublish4_${set.id}`}>
                        {CATEGORY[additionalCategorySets[index].category]
                          ? CATEGORY[additionalCategorySets[index].category]
                          : 'Please select a category first'}
                      </CFormLabel>

                      {index > 0 && (
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="remove-icon"
                          onClick={() => handleRemoveCategory(index)}
                        />
                      )}

                      <CFormSelect
                        disabled={
                          !formik.values.campaign.category ||
                          loadingCategory[selectedAdditionalCategories[index]]
                        }
                        value={
                          set.value !== undefined
                            ? set.value
                            : props.campaign_to_update
                            ? Object.values(props.campaign_to_update?.category)[index]
                            : ''
                        }
                        onChange={(event) => {
                          const selectedValue = event.target.value
                          const newCategorySets = [...additionalCategorySets]
                          newCategorySets[index].value = selectedValue
                          setAdditionalCategorySets(newCategorySets)
                        }}
                      >
                        {loadingCategory[selectedAdditionalCategories[index]] ? (
                          // Show "Loading" when fetching is in progress
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select</option>
                            {categoryResponses[selectedAdditionalCategories[index]]?.length > 0 ? (
                              categoryResponses[selectedAdditionalCategories[index]].map(
                                ({ id, name }) => (
                                  <option key={id} value={id}>
                                    {name}
                                  </option>
                                ),
                              )
                            ) : (
                              <option value="">No options available</option>
                            )}
                          </>
                        )}
                      </CFormSelect>
                    </CCol>
                  </div>
                ))}

                <CCol xs={12}>
                  <div className="button-container">
                    <CButton type="button" className="category-button" onClick={addMoreCategory}>
                      {t('add_more_category')}
                    </CButton>
                  </div>
                </CCol>

                <div className="col-md-12">
                  <div style={{ border: '1px solid' }}></div>{' '}
                  <p>{t('campaigns_trans.for_url_generation')}</p>
                </div>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('campaigns_trans.min_price')} </CFormLabel>
                  <CFormInput
                    type="number"
                    id="inputName"
                    value={
                      formik.values.campaign.min_price !== undefined
                        ? formik.values.campaign.min_price
                        : 1
                    }
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value)
                      if (!isNaN(inputValue) && inputValue >= 0) {
                        formik.handleChange(e)
                      }
                    }}
                    name="campaign.min_price"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('campaigns_trans.max_price')}</CFormLabel>
                  <CFormInput
                    type="number"
                    id="inputName"
                    value={
                      formik.values.campaign.max_price !== undefined
                        ? formik.values.campaign.max_price
                        : 3000
                    }
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value)
                      if (!isNaN(inputValue) && inputValue >= 0) {
                        formik.handleChange(e)
                      }
                    }}
                    name="campaign.max_price"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="country4">{t('country')}</CFormLabel>
                  <CFormSelect
                    id="country_id"
                    value={formik.values.campaign.country_id || ''}
                    onChange={handleCountryChange}
                    onBlur={formik.handleBlur}
                    name="campaign.country_id"
                  >
                    {[{ id: '', name: 'Select' }, ...props.countries].map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="selectPublish4">{t('region')}</CFormLabel>
                  <CFormSelect
                    id="region_id"
                    value={formik.values.campaign.region_id || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="campaign.region_id"
                    disabled={!formik.values.campaign.country_id} // Disable the select field if no country is selected
                  >
                    {formik.values.campaign.country_id ? (
                      fetchingRegionsByCountry ? (
                        // Show "Loading" when fetching is in progress
                        <option value="">Loading...</option>
                      ) : regionsData.length > 0 ? (
                        <>
                          <option value="">Select</option>
                          {regionsData.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option value="">No regions available for this country</option>
                      )
                    ) : (
                      <option value="">Please Select a Country First</option>
                    )}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('from')}</CFormLabel>
                  <CFormInput
                    type={props.campaign_to_update ? 'datetime' : 'datetime-local'}
                    id="inputFrom"
                    value={formik.values.campaign.from || ''}
                    onChange={formik.handleChange}
                    name="campaign.from"
                    onBlur={() => {
                      if (
                        formik.values.campaign.to &&
                        formik.values.campaign.to > formik.values.campaign.from
                      ) {
                        formik.setFieldTouched('campaign.to', true)
                      } else {
                        formik.setFieldValue('campaign.to', '')
                        formik.setFieldTouched('campaign.to', false)
                      }
                    }}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="inputName">{t('to')}</CFormLabel>
                  <CFormInput
                    type={props.campaign_to_update ? 'datetime' : 'datetime-local'}
                    id="input_to"
                    value={formik.values.campaign.to || ''}
                    onChange={formik.handleChange}
                    name="campaign.to"
                    min={formik.values.campaign.from || new Date().toISOString().slice(0, 16)}
                  />
                </CCol>

                <div className="col-md-12">
                  <div style={{ border: '1px solid' }}></div>
                </div>

                <CRow>
                  <CCol md={2}>
                    <CFormSwitch
                      className="form"
                      size="lg"
                      id="popular_homepage"
                      checked={formik.values.campaign.popular_homepage || false}
                      onChange={(e) => {
                        formik.setFieldValue('campaign.popular_homepage', e.target.checked)
                      }}
                      name="popular_homepage"
                    />
                    <CFormLabel>{t('campaigns_trans.auto_complete')}</CFormLabel>
                  </CCol>

                  <CCol md={2}>
                    <CFormSwitch
                      className="form"
                      size="lg"
                      id="collection"
                      checked={formik.values.campaign.collection || false}
                      onChange={(e) => {
                        formik.setFieldValue('campaign.collection', e.target.checked)
                      }}
                      name="collection"
                    />
                    <CFormLabel>{t('campaigns_trans.collection')}</CFormLabel>
                  </CCol>

                  <CCol md={2}>
                    <CFormSwitch
                      className="form"
                      size="lg"
                      id="popular_search"
                      checked={formik.values.campaign.popular_search || false}
                      onChange={(e) => {
                        formik.setFieldValue('campaign.popular_search', e.target.checked)
                      }}
                      name="popular_search"
                    />
                    <CFormLabel>{t('campaigns_trans.type')}</CFormLabel>
                  </CCol>

                  <CCol md={2}>
                    <CFormSwitch
                      className="form"
                      size="lg"
                      checked={formik.values.campaign.footer || false}
                      onChange={(e) => {
                        formik.setFieldValue('campaign.footer', e.target.checked)
                      }}
                      name="footer"
                    />
                    <CFormLabel>{t('campaigns_trans.footer')}</CFormLabel>
                  </CCol>

                  <CCol md={2}>
                    <CFormSwitch
                      className="form"
                      size="lg"
                      data-on-color="success"
                      data-off-color="danger"
                      data-on-text="YES"
                      data-off-text="NO"
                      color="success"
                      checked={formik.values.campaign.top_menu || false}
                      onChange={(e) => {
                        formik.setFieldValue('campaign.top_menu', e.target.checked)
                      }}
                      name="top_menu"
                    />
                    <CFormLabel>{t('campaigns_trans.top_menu')}</CFormLabel>
                  </CCol>

                  <CCol md={2}>
                    <CFormSwitch
                      className="form"
                      size="lg"
                      data-on-color="success"
                      data-off-color="danger"
                      data-on-text="YES"
                      data-off-text="NO"
                      color="success"
                      checked={formik.values.campaign.homepage || false}
                      onChange={(e) => {
                        formik.setFieldValue('campaign.homepage', e.target.checked)
                      }}
                      name="homepage"
                    />
                    <CFormLabel>{t('campaigns_trans.homepage')}</CFormLabel>
                  </CCol>
                </CRow>

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
