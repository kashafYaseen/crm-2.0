import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import '@/scss/style.scss'
import LoginAdminUser from '@admin_user_views/sessions/Login'
import LoginBusinessOwner from '@business_owner_views/sessions/Login'
import Page404 from '@/viewsTemp/pages/page404/Page404'
import { useStores } from '@/context/storeContext'
import { CSpinner } from '@coreui/react'
import AdminDefaultLayout from '@/layout/admin_user/DefaultLayout'
import initializeI18n from './initializeI18n'
import i18next from 'i18next'
import OwnerDefaultLayout from '@/layout/business_owner/DefaultLayout'
import InvitationForm from '@business_owner_views/invitations/Form'

const App = () => {
  const authStore = useStores()
  const isLoggedIn = authStore((state) => state.token)
  const [locale, setLocale] = useState(i18next.language)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    initializeI18n()
  }, [])

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLocale(lng)

      if (isLoggedIn) {
        const currentPath = location.pathname
        const newPath = `/${lng}${currentPath.substring(currentPath.indexOf('/admin-user'))}`
        navigate(newPath, { replace: true })
      }
    }

    i18next.on('languageChanged', handleLanguageChange)

    return () => {
      i18next.off('languageChanged', handleLanguageChange)
    }
  }, [isLoggedIn, location.pathname])

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        <Route
          path={`/${locale}/admin-user-login`}
          element={
            !isLoggedIn ? (
              <LoginAdminUser />
            ) : (
              <Navigate to={`/${locale}/admin-user/dashboard`} replace={true} />
            )
          }
        />

        <Route
          path={`/${locale}/business-owner-login`}
          element={
            !isLoggedIn ? (
              <LoginBusinessOwner />
            ) : (
              <Navigate to={`/${locale}/business-owner/dashboard`} replace={true} />
            )
          }
        />

        <Route
          path={`/${locale}/admin-user/*`}
          element={
            !isLoggedIn ? (
              <Navigate replace={true} to={`/${locale}/admin-user-login`} />
            ) : (
              <AdminDefaultLayout />
            )
          }
        />

        <Route
          path={`/${locale}/business-owner/*`}
          element={
            !isLoggedIn ? (
              <Navigate replace={true} to={`/${locale}/business-owner-login`} />
            ) : (
              <OwnerDefaultLayout />
            )
          }
        />

        <Route path={`/${locale}/business-owner/invitation-form`} element={<InvitationForm />} />

        {/* Catch-all route for admin and owner pages */}
        <Route
          path="*"
          element={location.pathname.startsWith(`/${locale}/admin-user/*`) && <Page404 />}
        />

        <Route
          path="*"
          element={location.pathname.startsWith(`/${locale}/business-owner/*`) && <Page404 />}
        />
      </Routes>
    </Suspense>
  )
}

export default App
