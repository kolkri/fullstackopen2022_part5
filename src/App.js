import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Footer from './components/Footer'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      console.log(error);
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

  const addBlog = async (event) => {
    event.preventDefault()
    try {
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    blogService.setToken(user.token)
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setErrorMessage(`a new blog ${title} by ${author} added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    setTitle('')
    setAuthor('')
    setUrl('')
    } catch (error) {
      console.log('ERrpprpkeroprkero',error);
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )
 
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage &&<Notification message={errorMessage} />}
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>Welcome</h2>
      {errorMessage &&<Notification message={errorMessage} />}
      <div>
        {user.name} logged in <button onClick={handleLogout}>log out</button>
      </div>
      <h2>Add new blog:</h2>
      {blogForm()}
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  // return (
  //   <div>
  //     {user === null ?
  //     <h1>Log in to application</h1> :
  //     <h1>Blogs</h1>}
  //     <Notification message={errorMessage} />

  //     {user === null ?
  //       loginForm() :
  //       <div>
  //         <p>{user.name} logged in</p>
  //         <ul>
  //           {blogsToShow.map(blog => 
  //             <Blog
  //               key={blog.id}
  //               blog={blog}
  //                 toggleImportance={() => toggleImportanceOf(blog.id)}
  //             />
  //       )}
  //     </ul>
  //       </div>
  //     }

  //    <div>
  //       <button onClick={() => setShowAll(!showAll)}>
  //         show {showAll ? 'important' : 'all' }
  //       </button>
  //     </div>   
  //     <ul>
  //       {blogsToShow.map(blog => 
  //         <Blog
  //           key={blog.id}
  //           blog={blog}
  //           toggleImportance={() => toggleImportanceOf(blog.id)}
  //         />
  //       )}
  //     </ul>

  //     <Footer /> 
  //   </div>
  // )
}

export default App
