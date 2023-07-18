import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCursor, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/business-owner/dashboard',
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
    items: [],
  },
]

export default _nav
