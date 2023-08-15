import React from 'react'

const AdminDashboard = React.lazy(() => import('@admin_user_views/dashboard/Dashboard'))
const Countries = React.lazy(() => import('@admin_user_views/countries/Index'))
const Regions = React.lazy(() => import('@admin_user_views/regions/Index'))
const EditRegion = React.lazy(() => import('@admin_user_views/regions/EditRegion'))
const NewRegion = React.lazy(() => import('@admin_user_views/regions/NewRegion'))

const CountryForm = React.lazy(() => import('@admin_user_views/countries/Form'))
const Places = React.lazy(() => import('@admin_user_views/places/Index'))
const NewPlace = React.lazy(() => import('@admin_user_views/places/NewPlace'))
const EditPlace = React.lazy(() => import('@admin_user_views/places/EditPlace'))
const PlaceCategories = React.lazy(() => import('@admin_user_views/place_categories/Index'))
const Amenities = React.lazy(() => import('@admin_user_views/amenities/Index'))
const AmenityCategories = React.lazy(() => import('@admin_user_views/amenity_categories/Index'))
const Partners = React.lazy(() => import('@admin_user_views/partners/new_partner_page/Index'))
const ActivePartners = React.lazy(() => import('@admin_user_views/partners/active_partner/Index'))
const InactivePartners = React.lazy(() =>
  import('@admin_user_views/partners/inactive_partner/Index'),
)
const ExactPartners = React.lazy(() =>
  import('@admin_user_views/partners/exact_partner_account/Index'),
)
const Experiences = React.lazy(() => import('@admin_user_views/experiences/Index'))
const EditPartner = React.lazy(() =>
  import('@admin_user_views/partners/new_partner_page/EditPartner'),
)
const NewPartner = React.lazy(() =>
  import('@admin_user_views/partners/new_partner_page/NewPartner'),
)

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

  { path: '/exact-partner-account', name: 'Exact Partners', element: ExactPartners },
  { path: '/inactive-partner', name: 'Inactive Partners', element: InactivePartners },
  { path: '/active-partner', name: 'Active Partners', element: ActivePartners },

  { path: '/new-partners-page', name: 'Partners', element: Partners },
  { path: '/new', name: 'New Partner', element: NewPartner },
  {
    path: '/edit',
    name: 'Edit Partner',
    element: EditPartner,
  },
  {
    path: '/countries/country-form', // Nested path under '/countries'
    name: 'Country Form',
    element: CountryForm,
  },
  {
    path: '/regions/edit-region',
    name: 'EditRegion',
    element: EditRegion,
  },
  {
    path: '/regions/new-region',
    name: 'NewRegion',
    element: NewRegion,
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
