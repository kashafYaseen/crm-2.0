import React, { Suspense } from 'react'
import { CSpinner } from '@coreui/react'
import BusinessOwnerRoutes from '@/routes/businessOwnerRoutes'

const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <BusinessOwnerRoutes />
    </Suspense>
  )
}

export default React.memo(AppContent)
