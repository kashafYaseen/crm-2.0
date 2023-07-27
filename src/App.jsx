import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '@/scss/style.scss'
import LoginAdminUser from '@admin_user_views/sessions/Login'
import Page404 from '@/viewsTemp/pages/page404/Page404'
import { useStores } from '@/context/storeContext'
import { CSpinner } from '@coreui/react'
import AdminDefaultLayout from '@/layout/admin_user/DefaultLayout'

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
            path="/admin-user/*"
            element={
              !isLoggedIn ? <Navigate replace to={'/admin-user-login'} /> : <AdminDefaultLayout />
            }
          />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
