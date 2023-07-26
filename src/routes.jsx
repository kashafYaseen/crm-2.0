import React from 'react'

const AdminDashboard = React.lazy(() => import('@admin_user_views/dashboard/Dashboard'))
const Countries = React.lazy(() => import('@admin_user_views/countries/Index'))
const Regions = React.lazy(() => import('@admin_user_views/regions/Index'))
const CountryForm = React.lazy(() => import('@admin_user_views/countries/Form'))
const RegionForm = React.lazy(() => import('@admin_user_views/regions/Form'))
const Places = React.lazy(() => import('@admin_user_views/places/Index'))
const NewPlace = React.lazy(() => import('@admin_user_views/places/NewPlace'))
const EditPlace = React.lazy(() => import('@admin_user_views/places/EditPlace'))
const PlaceCategories = React.lazy(() => import('@admin_user_views/place_categories/Index'))

const OwnerDashboard = React.lazy(() => import('@business_owner_views/dashboard/Dashboard'))

const admin_routes = [
  { path: '/dashboard', name: 'Dashboard', element: AdminDashboard },
  { path: '/countries', name: 'Countries', element: Countries },
  { path: '/places', name: 'Places', element: Places },
  { path: '/place-categories', name: 'PlaceCategories', element: PlaceCategories },
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
  {
    path: '/places/new-place',
    name: 'New Place',
    element: NewPlace,
  },
  {
    path: '/places/edit-place',
    name: 'Edit Place',
    element: EditPlace,
  },
]

const owner_routes = [{ path: '/dashboard', name: 'Dashboard', element: OwnerDashboard }]

const routes = { admin_routes, owner_routes }

export default routes
