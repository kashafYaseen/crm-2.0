import React, { Suspense } from 'react'
import { CSpinner } from '@coreui/react'
import AdminUserRoutes from '@/routes/adminUserRoutes'

const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <AdminUserRoutes />
    </Suspense>
  )
}

export default React.memo(AppContent)
