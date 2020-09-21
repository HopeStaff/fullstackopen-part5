import React from 'react'

const Notification = ({ message, notificationError }) => {
  if (message === null) {
    return null
  }

  const usedClass = notificationError ? 'error' : 'success'

  return (
    <div className={usedClass}>
      {message}
    </div>
  )
}

export default Notification