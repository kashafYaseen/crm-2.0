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
    to: '/dashboard',
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
        to: '/countries',
      },
      {
        component: CNavItem,
        name: 'Regions',
        to: '/regions',
      },
      {
        component: CNavItem,
        name: 'Amenities',
        to: '/amenities',
      },
      {
        component: CNavItem,
        name: 'Accommodations',
        to: '/lodgings',
      },
      {
        component: CNavItem,
        name: 'Places',
        to: '/places',
      },
      {
        component: CNavItem,
        name: 'Place Categories',
        to: '/place-categories',
      },
    ],
  },
]

export default _nav
