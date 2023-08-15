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
    name: 'Partners',
    to: '/partner',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Active Partners',
        to: '/admin-user/active-partner',
      },
      {
        component: CNavItem,
        name: 'Inactive Partners',
        to: '/admin-user/inactive-partner',
      },
      {
        component: CNavItem,
        name: 'Exact Partner Account',
        to: '/admin-user/exact-partner-account',
      },
      {
        component: CNavItem,
        name: 'Statistics/Inventory',
        to: '/admin-user/dashboard',
      },
      {
        component: CNavItem,
        name: 'New Partner Page',
        to: '/admin-user/new-partners-page',
      },
      {
        component: CNavItem,
        name: 'Partner Promotions',
        to: '/admin-user/dashboard',
      },
    ],
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
    ],
  },
]

export default _nav
