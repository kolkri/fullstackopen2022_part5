const Blog = ({ blog, toggleImportance }) => {
  const label = blog.important
    ? 'make not important' : 'make important'

  return (
    <li className="blog">
      {blog.title} 
      
    </li>
  )
}

export default Blog