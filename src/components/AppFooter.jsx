import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <b>Copyright</b> Digital Accommodation Manager © 2015-2016
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
