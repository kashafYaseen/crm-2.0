import React from 'react'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import routes from '@/routes'

const BusinessOwnerRoutes = () => {
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

export default BusinessOwnerRoutes