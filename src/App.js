import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.Token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      blogService.setToken(user.token)
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const like = async (id, blog) => {
    try{
      await blogService.update(id, blog)
      setErrorMessage(`new like for ${blog.title} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // const toggleImportanceOf = id => {
  //   const blog = blogs.find(b => b.id === id)
  //   const changedBlog = { ...blog, important: !blog.important }

  //   blogService
  //     .update(id, changedBlog)
  //     .then(returnedBlog => {
  //       setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  //     })
  //     .catch(error => {
  //       setErrorMessage(
  //         `Blog '${blog.title}' was already removed from server`
  //       )
  //       setTimeout(() => {
  //         setErrorMessage(null)
  //       }, 5000)
  //       setBlogs(blogs.filter(b => b.id !== id))
  //     })
  // }

  // const blogsToShow = showAll
  // ? blogs
  // : blogs.filter(blog => blog.important)



  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)


  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage &&<Notification message={errorMessage} />}
        <Togglable buttonLabel='login'>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword} />
        </Togglable>
      </div>
    )

  return (
    <div>
      <h2>Welcome</h2>
      {errorMessage &&<Notification message={errorMessage} />}
      <div>
        {user.name} logged in <button onClick={handleLogout}>log out</button>
      </div>
      <Togglable buttonLabel="new note">
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <h2>Blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          setBlogs={setBlogs}
          blogs={blogs}
          setErrorMessage={setErrorMessage}
          user={user}
          likeCallback={like}/>
      )}
    </div>
  )

}

export default App
