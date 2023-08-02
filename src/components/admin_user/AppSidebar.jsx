import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from '@/assets/brand/logo-negative'
import { sygnet } from '@/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import navigation from '@admin_user_components/_nav'
import i18next from 'i18next'
import initializeI18n from '@/initializeI18n'

const appendLanguageToRoutes = (routes) => {
  const language = i18next.language

  return routes.map((route) => {
    const modifiedRoute = { ...route }

    modifiedRoute.to = `/${language}${route.to}`

    if (modifiedRoute.items) {
      modifiedRoute.items = appendLanguageToRoutes(modifiedRoute.items)
    }

    return modifiedRoute
  })
}

const AppSidebar = () => {
  initializeI18n()

  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const modifiedNavigation = appendLanguageToRoutes(navigation)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          {/* Use the modified navigation array */}
          <AppSidebarNav items={modifiedNavigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
