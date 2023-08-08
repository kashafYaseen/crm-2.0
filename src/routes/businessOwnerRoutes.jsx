import React from 'react'
import { useStores } from '@/context/storeContext'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import routes from '@/routes'

const BusinessOwnerRoutes = () => {
  const authStore = useStores()
  const isLoggedIn = authStore((state) => state.token)

  return (
    <>
      <Routes>
        {routes.owner_routes.map((route) => {
          // If the route has a parentPath defined, it is a nested route
          if (route.parentPath) {
            return (
              <Route
                key={route.path}
                path={`/business-owner${route.parentPath}${route.path}`}
                element={
                  !isLoggedIn ? <Navigate replace to={'/business-owner-login'} /> : <Outlet />
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
                    <Navigate replace to={'/business-owner-login'} />
                  ) : (
                    <route.element />
                  )
                }
              />
            )
          }
        })}
        <Route path="*" element={<Navigate replace to={'/business-owner/dashboard'} />} />
      </Routes>
    </>
  )
}

export default BusinessOwnerRoutes
