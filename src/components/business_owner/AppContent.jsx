import React, { Suspense } from 'react'
import { CSpinner } from '@coreui/react'
import BusinessOwnerRoutes from '@/routes/businessOwnerRoutes'

// routes config
import routes from '@/routes'

const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <BusinessOwnerRoutes />
    </Suspense>
  )
}

export default React.memo(AppContent)
