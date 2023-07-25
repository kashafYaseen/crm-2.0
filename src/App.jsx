import React, { Component, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@/scss/style.scss'
import AdminUserRoutes from '@/routes/adminUserRoutes'
import BusinessOwnerRoutes from '@/routes/businessOwnerRoutes'
import LoginAdminUser from '@admin_user_views/sessions/Login'
import LoginBusinessOwner from '@business_owner_views/sessions/Login'
import Page404 from '@/viewsTemp/pages/page404/Page404'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const BusinessOwnerDefaultLayout = React.lazy(() => import('@/layout/business_owner/DefaultLayout'))
const AdminDefaultLayout = React.lazy(() => import('@/layout/admin_user/DefaultLayout'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/admin-user-login" element={<LoginAdminUser />} />
          <Route path="/business-owner-login" element={<LoginBusinessOwner />} />

          <Route
            path="/admin-user/*"
            element={
              <AdminDefaultLayout>
                <AdminUserRoutes />
              </AdminDefaultLayout>
            }
          />

          {/* Route for business_owner namespace */}
          <Route
            path="/business-owner/*"
            element={
              <BusinessOwnerDefaultLayout>
                <BusinessOwnerRoutes />
              </BusinessOwnerDefaultLayout>
            }
          />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
