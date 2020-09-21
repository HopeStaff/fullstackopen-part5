import React, { useRef } from 'react'
import TogglableBlogDetails from './TogglableBlogDetails'

const Blog = ({ user, blog, addLike, removeBlog }) => {

  const isOwner = blog.user.username === user.username

  const handleClickLike = (event) => {
    addLike({ ...blog, likes: blog.likes + 1 })
  }

  const handleClickRemove = (event) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)

    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const floatLeft = {
    float: 'left'
  }

  const blogFormRef = useRef()

  const changeVisibility = () => {
    blogFormRef.current.toggleVisibility('')
    const myButton = document.getElementById(blog.id.toString())
    if (myButton.value === 'View') {
      myButton.value='hide'
      myButton.innerHTML='hide'
    } else {
      myButton.value='View'
      myButton.innerHTML='View'
    }
  }



  return (
    <div style={blogStyle}>
      <div style={floatLeft} className='note'>{blog.title} {blog.author}</div>
      <div style={floatLeft}><button onClick={changeVisibility} value='View' id={blog.id} className='view-btn'>View</button></div>
      <br />
      <TogglableBlogDetails buttonLabel='View' ref={blogFormRef}>
        {blog.url} <br />
      Likes: {blog.likes} <button id='like-btn' onClick={handleClickLike}>like</button> <br />
        {blog.user.username}
        <br />
        {isOwner && (
          <button id='remove-btn' onClick={handleClickRemove}>remove</button>
        )}
      </TogglableBlogDetails>
    </div>
  )
}

export default Blog
