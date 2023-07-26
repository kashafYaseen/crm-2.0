import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin-user/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Content',
    to: '/content',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Countries',
        to: '/admin-user/countries',
      },
      {
        component: CNavItem,
        name: 'Regions',
        to: '/admin-user/regions',
      },
      {
        component: CNavItem,
        name: 'Amenities',
        to: '/admin-user/amenities',
      },
      {
        component: CNavItem,
        name: 'Amenity Categories',
        to: '/admin-user/amenity-categories',
      },
      {
        component: CNavItem,
        name: 'Places',
        to: '/admin-user/places',
      },
      {
        component: CNavItem,
        name: 'Place Categories',
        to: '/admin-user/place-categories',
      },
      {
        component: CNavItem,
        name: 'Experiences',
        to: '/admin-user/experiences',
      },
      {
        component: CNavItem,
        name: 'New Partner',
        to: '/admin-user/business-owner',
      },
    ],
  },
]

export default _nav
