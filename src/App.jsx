import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '@/scss/style.scss'
import LoginAdminUser from '@admin_user_views/sessions/Login'
import LoginBusinessOwner from '@business_owner_views/sessions/Login'
import Page404 from '@/viewsTemp/pages/page404/Page404'
import { useStores } from '@/context/storeContext'
import { CSpinner } from '@coreui/react'
import AdminDefaultLayout from '@/layout/admin_user/DefaultLayout'
import OwnerDefaultLayout from '@/layout/business_owner/DefaultLayout'
import InvitationForm from '@business_owner_views/invitations/Form'

const App = () => {
  const authStore = useStores()
  const isLoggedIn = authStore((state) => state.token)
  return (
    <BrowserRouter>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          <Route
            path="/admin-user-login"
            element={
              !isLoggedIn ? <LoginAdminUser /> : <Navigate replace to={'/admin-user/dashboard'} />
            }
          />
          <Route
            path="/business-owner-login"
            element={
              !isLoggedIn ? (
                <LoginBusinessOwner />
              ) : (
                <Navigate replace to={'/business-owner/dashboard'} />
              )
            }
          />

          <Route
            path="/admin-user/*"
            element={
              !isLoggedIn ? <Navigate replace to={'/admin-user-login'} /> : <AdminDefaultLayout />
            }
          />
          <Route
            path="/business-owner/*"
            element={
              !isLoggedIn ? (
                <Navigate replace to={'/business-owner-login'} />
              ) : (
                <OwnerDefaultLayout />
              )
            }
          />

          <Route path="/business-owner/invitation-form" element={<InvitationForm />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
