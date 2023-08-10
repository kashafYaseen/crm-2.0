import React from 'react'

const AdminDashboard = React.lazy(() => import('@admin_user_views/dashboard/Dashboard'))
const Countries = React.lazy(() => import('@admin_user_views/countries/Index'))
const Regions = React.lazy(() => import('@admin_user_views/regions/Index'))
const EditRegion = React.lazy(() => import('@admin_user_views/regions/EditRegion'))
const NewRegion = React.lazy(() => import('@admin_user_views/regions/NewRegion'))

const NewCountry = React.lazy(() => import('@admin_user_views/countries/NewCountry'))
const EditCountry = React.lazy(() => import('@admin_user_views/countries/EditCountry'))
const Places = React.lazy(() => import('@admin_user_views/places/Index'))
const NewPlace = React.lazy(() => import('@admin_user_views/places/NewPlace'))
const EditPlace = React.lazy(() => import('@admin_user_views/places/EditPlace'))
const PlaceCategories = React.lazy(() => import('@admin_user_views/place_categories/Index'))
const Amenities = React.lazy(() => import('@admin_user_views/amenities/Index'))
const AmenityCategories = React.lazy(() => import('@admin_user_views/amenity_categories/Index'))
const Experiences = React.lazy(() => import('@admin_user_views/experiences/Index'))
const Partners = React.lazy(() => import('@admin_user_views/partners/Index'))
const EditPartner = React.lazy(() => import('@admin_user_views/partners/EditPartner'))
const NewPartner = React.lazy(() => import('@admin_user_views/partners/NewPartner'))

const OwnerDashboard = React.lazy(() => import('@business_owner_views/dashboard/Dashboard'))

const admin_routes = [
  { path: '/dashboard', name: 'Dashboard', element: AdminDashboard },
  { path: '/countries', name: 'Countries', element: Countries },
  { path: '/places', name: 'Places', element: Places },
  { path: '/place-categories', name: 'PlaceCategories', element: PlaceCategories },
  { path: '/regions', name: 'Regions', element: Regions },
  { path: '/amenities', name: 'Amenities', element: Amenities },
  { path: '/amenity-categories', name: 'AmenityCategories', element: AmenityCategories },
  { path: '/experiences', name: 'Experiences', element: Experiences },

  { path: '/partners', name: 'Partners', element: Partners },
  { path: '/new-partner', name: 'New Partner', element: NewPartner },
  {
    path: '/partners/edit-partner',
    name: 'Edit Partner',
    element: EditPartner,
  },
  {
    path: '/countries/new', // Nested path under '/countries'
    name: 'New Country',
    element: NewCountry,
  },
  {
    path: '/countries/edit', // Nested path under '/countries'
    name: 'Edit Country',
    element: EditCountry,
  },
  {
    path: '/regions/edit',
    name: 'EditRegion',
    element: EditRegion,
  },
  {
    path: '/regions/new',
    name: 'NewRegion',
    element: NewRegion,
  },
  {
    path: '/places/new',
    name: 'New Place',
    element: NewPlace,
  },
  {
    path: '/places/edit',
    name: 'Edit Place',
    element: EditPlace,
  },
]

const owner_routes = [{ path: '/dashboard', name: 'Dashboard', element: OwnerDashboard }]

const routes = { admin_routes, owner_routes }

export default routes
