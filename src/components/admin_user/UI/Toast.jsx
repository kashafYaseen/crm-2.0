import React, { useEffect } from 'react'
import { CToast, CToastHeader } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export const Toast = ({ error, onExited, type }) => {
  useEffect(() => {
    const delay = 3000 // 3 seconds in milliseconds

    const timeoutId = setTimeout(() => {
      onExited()
    }, delay)

    return () => {
      clearTimeout(timeoutId) // Clean up the timeout if the component unmounts before the delay
    } // Invoke the function passed from the parent when the component mounts or updates
  }, [onExited])

  let toastColor = ''
  let icon = ''
  if (type === 'success') {
    toastColor = 'success'
    icon = faCheckCircle
  } else if (type === 'danger') {
    toastColor = 'danger'
    icon = faTimesCircle
  }

  return (
    <div>
      <CToast color={toastColor} autohide={true} visible={true} className="align-items-center">
        <CToastHeader closeButton>
          <FontAwesomeIcon icon={icon} className="me-2 m-auto" />
          <div className="fw-bold me-auto">{error}</div>
        </CToastHeader>
      </CToast>
    </div>
  )
}
