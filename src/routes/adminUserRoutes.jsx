import React from 'react'
import { Route, Routes, Navigate, Outlet, useNavigate } from 'react-router-dom'
import routes from '@/routes'
import { useStores } from '@/context/storeContext'
import i18next from 'i18next'

const AdminUserRoutes = () => {
  const authStore = useStores()
  const isLoggedIn = authStore((state) => state.token)

  return (
    <>
      <Routes>
        {routes.admin_routes.map((route) => {
          if (route.parentPath) {
            return (
              <Route
                key={route.path}
                path={`/${i18next.language}/admin-user${route.parentPath}${route.path}`}
                element={
                  !isLoggedIn ? (
                    <Navigate replace to={`/${i18next.language}/admin-user-login`} />
                  ) : (
                    <Outlet />
                  )
                }
              />
            )
          } else {
            // Otherwise, it is a regular route without nesting
            return (
              <Route
                key={route.path}
                path={`/${route.path}`}
                element={
                  !isLoggedIn ? (
                    <Navigate replace to={`/${i18next.language}/admin-user-login`} />
                  ) : (
                    <route.element />
                  )
                }
              />
            )
          }
        })}
        <Route
          path="*"
          element={<Navigate replace to={`/${i18next.language}/admin-user/dashboard`} />}
        />
      </Routes>
    </>
  )
}

export default AdminUserRoutes
