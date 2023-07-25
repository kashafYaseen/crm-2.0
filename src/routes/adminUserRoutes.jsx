import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import routes from '@/routes'
import { useStores } from '@/context/storeContext'

const AdminUserRoutes = () => {
  const authStore = useStores()

  useEffect(() => {
    authStore.isLoggedIn
  }, [authStore.auth_token])

  if (authStore.isLoggedIn) {
    return <Navigate to="/admin-user-login" /> // Redirect to login if not authenticated
  }

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
                element={<Outlet />}
              />
            )
          } else {
            // Otherwise, it is a regular route without nesting
            return (
              <Route key={route.path} path={`/admin-user${route.path}`} element={route.element} />
            )
          }
        })}
      </Routes>
    </>
  )
}

export default AdminUserRoutes
