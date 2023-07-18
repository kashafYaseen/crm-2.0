import React from 'react'

const Dashboard = React.lazy(() => import('./views/admin_user/dashboard/Dashboard'))
const Countries = React.lazy(() => import('./views/admin_user/countries/Index'))
const Regions = React.lazy(() => import('./views/admin_user/regions/Index'))
const CountryForm = React.lazy(() => import('./views/admin_user/countries/Form'))
const RegionForm = React.lazy(() => import('./views/admin_user/regions/Form'))

const admin_routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/countries', name: 'Countries', element: Countries },
  { path: '/regions', name: 'Regions', element: Regions },
  {
    path: '/countries/country-form', // Nested path under '/countries'
    name: 'Country Form',
    element: CountryForm,
  },
  {
    path: '/regions/region-form',
    name: 'Region Form',
    element: RegionForm,
  },
]

const owner_routes = [{ path: '/business-owner', exact: true, name: 'Home' }]

const routes = { admin_routes, owner_routes }

export default routes
