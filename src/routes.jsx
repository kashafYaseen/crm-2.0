import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Lodgings = React.lazy(() => import('./views/lodgings/Lodgings'))
const Countries = React.lazy(() => import('./views/countries/Countries'))

const Places = React.lazy(() => import('./views/places/Index'))
const NewPlace = React.lazy(() => import('./views/places/newPlace'))
const EditPlace = React.lazy(() => import('./views/places/EditPlace'))

const PlaceCategories = React.lazy(() => import('./views/place_categories/Index'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lodgings', name: 'Lodgings', element: Lodgings },
  { path: '/countries', name: 'Countries', element: Countries },

  { path: '/places', name: 'Places', element: Places },
  { path: '/new-place', name: 'NewPlace', element: NewPlace },
  { path: '/edit-place', name: 'EditPlace', element: EditPlace },

  { path: '/place-categories', name: 'PlaceCategories', element: PlaceCategories },
]

export default routes
