import { useTranslation, initReactI18next } from 'react-i18next'

const Dashboard = () => {
  const { t } = useTranslation()

  return (
    <div className="d-flex flex-column align-items-start">
      <h1>{t('pdf_document.invoice_title')}</h1>
    </div>
  )
}

export default Dashboard
