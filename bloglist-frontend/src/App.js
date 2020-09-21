import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateForm from './components/CreateForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Toggable'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const [ newTitle, setNewTitle ] = useState('')
  const [ newAuthor, setNewAuthor ] = useState('')
  const [ newUrl, setNewUrl ] = useState('')

  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ notificationError, setNotificationError ] = useState(false)

  const blogFormRef = useRef()



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  function initBlogs () {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )

    return 0
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortBlogs = blogs.sort((a, b) => b.likes - a.likes)

  const addBlog = (event) => {
    event.preventDefault()

    if (newTitle === '' && newUrl === '') {
      setNotificationError(true)
      setNotificationMessage('Could not create the blog, both title and url can not be empty')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationError(false)
      }, 5000)
    }

    else {
    const title = newTitle
    const author = newAuthor
    const url = newUrl
    const blogObject = {
      title: title,
      author: author,
      url: url,
      user: {

      }
    }

    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationError(false)
        setNotificationMessage(`a new blog ${newTitle} by ${newAuthor} added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        initBlogs()
      })
    }
  }

  const removeBlog = (id) => {
    blogService
      .remove(id)
      .then(returnedBlog => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
  }

  const addLike = (blog) => {
    const updatedTitle = blog.title
    const updatedAuthor = blog.author
    const updatedUrl = blog.url
    const updatedLikes = blog.likes
    const updatedId = blog.id
    const blogObject = {
      id: updatedId,
      title: updatedTitle,
      author: updatedAuthor,
      url: updatedUrl,
      likes: updatedLikes
    }

    blogService
      .update(blogObject.id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(iblog => iblog.id === blog.id ? blog : iblog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
  }

  const handleNameChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationError(true)
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationError(false)
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message = {notificationMessage} notificationError={notificationError}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message = {notificationMessage} notificationError={notificationError}/>
      <p>
        {user.username} logged in&nbsp;
        <button onClick={handleLogout} id='logout-btn'>logout</button>
      </p>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <CreateForm
          addBlog={addBlog}
          newTitle={newTitle}
          handleNameChange={handleNameChange}
          newAuthor={newAuthor}
          handleNumberChange={handleNumberChange}
          newUrl={newUrl}
          handleUrlChange={handleUrlChange}
        />
      </Togglable>
      {sortBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} removeBlog={removeBlog} user={user}/>
      )}
    </div>
  )
}

export default App