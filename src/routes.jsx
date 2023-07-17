import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Lodgings = React.lazy(() => import('./views/lodgings/Lodgings'))
const Countries = React.lazy(() => import('./views/countries/Index'))
const Regions = React.lazy(() => import('./views/regions/Index'))
const CountryForm = React.lazy(() => import('./views/countries/Form'))
const RegionForm = React.lazy(() => import('./views/regions/Form'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lodgings', name: 'Lodgings', element: Lodgings },
  { path: '/countries', name: 'Countries', element: Countries },
  { path: '/regions', name: 'Regions', element: Regions },
  { path: '/country-form', name: 'Country Form', element: CountryForm },
  { path: '/region-form', name: 'Region Form', element: RegionForm },
]

export default routes
