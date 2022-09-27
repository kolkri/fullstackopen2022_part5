
import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, setErrorMessage, user, likeCallback }) => {
  // const label = blog.important
  //   ? 'make not important' : 'make important'

  const removeButton = {
    width: 'fit-content'
  }

  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenVisible = {
    display: showDetails ? 'none' : 'flex',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const showWhenVisible = {
    display: showDetails ? 'flex' : 'none',
    flexDirection: 'column',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }



  const toggleShowingDetails = () => {
    setShowDetails(!showDetails)
  }

  const addLike = async (blog) => {
    const blogToUpdate = {
      user: blog.user.id,
      likes: likes+1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    likeCallback(blog.id, blogToUpdate)
    setLikes(likes+1)
  }

  const removeBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        blogService.setToken(user.token)
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setErrorMessage(`blog ${blog.title} removed`)
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
  }



  return (
    <div>
      <div style={hideWhenVisible} className='blog'>
        {blog.title}&nbsp;{blog.author} <button onClick={toggleShowingDetails}>view</button>
      </div>
      <div style={showWhenVisible} className='all-visible'>
        <div>{blog.title} <button onClick={toggleShowingDetails}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {likes} <button onClick={() => addLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.name === user.name &&
        <button onClick={() => removeBlog(blog)}style={removeButton}>remove</button>}
      </div>
    </div>
  )
}

export default Blog