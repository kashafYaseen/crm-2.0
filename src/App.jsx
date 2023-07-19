import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@/scss/style.scss'
import AdminUserRoutes from '@/routes/admin_user_routes'
import BusinessOwnerRoutes from '@/routes/business_owner_routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('@/layout/business_owner/DefaultLayout'))
const AdminDefaultLayout = React.lazy(() => import('@/layout/admin_user/DefaultLayout'))

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            {/* Route for admin_user namespace */}
            <Route
              path="/admin-user/*"
              element={
                // Check if user is logged in as admin_user here
                <AdminDefaultLayout>
                  <AdminUserRoutes />
                </AdminDefaultLayout>
              }
            />

            {/* Route for business_owner namespace */}
            <Route
              path="/business-owner/*"
              element={
                // Check if user is logged in as business_owner here
                <DefaultLayout>
                  <BusinessOwnerRoutes />
                </DefaultLayout>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App
