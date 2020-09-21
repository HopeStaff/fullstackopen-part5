import React, { useState, useImperativeHandle  } from 'react'

const TogglableBlogDetails = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none', clear: 'both' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
      </div>
      <div style={showWhenVisible} className='dropdown'>
        {props.children}
      </div>
    </div>
  )
})

TogglableBlogDetails.displayName = 'TogglableBlogDetails'

export default TogglableBlogDetails