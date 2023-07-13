import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Lodgings = React.lazy(() => import('./views/lodgings/Lodgings'))
const Countries = React.lazy(() => import('./views/countries/Index'))
const CountryForm = React.lazy(() => import('./views/countries/Form'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lodgings', name: 'Lodgings', element: Lodgings },
  { path: '/countries', name: 'Countries', element: Countries },
  { path: '/country-form', name: 'Country Form', element: CountryForm },
]

export default routes
