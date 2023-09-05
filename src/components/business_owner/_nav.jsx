import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCursor, cilSpeedometer, cilTag, cilNotes, cilBook } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/business-owner/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Promotions',
    to: '/business-owner/promotions',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Bookings',
    to: '/content',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '2024',
        to: '/business-owner/dashboard',
      },
      {
        component: CNavItem,
        name: '2023',
        to: '/business-owner/dashboard',
      },
      {
        component: CNavItem,
        name: '2022',
        to: '/business-owner/dashboard',
      },
      {
        component: CNavItem,
        name: '2021',
        to: '/business-owner/dashboard',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Pending Requests',
    to: '/content',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Request Details',
        to: '/business-owner/dashboard',
      },
    ],
  },
]

export default _nav
