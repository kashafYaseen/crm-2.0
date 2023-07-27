import React, { Suspense } from 'react'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import routes from '@/routes'
import { useStores } from '@/context/storeContext'
import { CSpinner } from '@coreui/react'

const AdminUserRoutes = () => {
  const authStore = useStores()
  const isLoggedIn = authStore((state) => state.token)

  return (
    <>
      <Routes>
        {routes.admin_routes.map((route) => {
          // If the route has a parentPath defined, it is a nested route
          if (route.parentPath) {
            return (
              <Route
                key={route.path}
                path={`/admin-user${route.parentPath}${route.path}`}
                element={!isLoggedIn ? <Navigate replace to={'/admin-user-login'} /> : <Outlet />}
              />
            )
          } else {
            // Otherwise, it is a regular route without nesting
            return (
              <Route
                key={route.path}
                path={`/${route.path}`}
                element={
                  !isLoggedIn ? <Navigate replace to={'/admin-user-login'} /> : <route.element />
                }
              />
            )
          }
        })}
        <Route path="*" element={<Navigate replace to={'/admin-user/dashboard'} />} />
      </Routes>
    </>
  )
}

export default AdminUserRoutes
