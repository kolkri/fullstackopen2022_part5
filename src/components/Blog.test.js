import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kristiina Kolu',
    url: 'google.com',
    likes: 0,
    user: {
      username: 'kolkri',
      name:'Kristiina Kolu'
    }
  }
  const testUser = {
    username: 'kolkri',
    name:'Kristiina Kolu'
  }

  const { container } = render(<Blog blog={blog} user={testUser}/>)

  const div = container.querySelector('.blog')


  expect (div).toHaveTextContent(blog.title)
  expect (div).toHaveTextContent(blog.author)

  expect (div).not.toHaveTextContent(blog.url)
  expect (div).not.toHaveTextContent(blog.likes)
})

test('url and likes are shown when shown details has been clicked', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kristiina Kolu',
    url: 'google.com',
    likes: 0,
    user: {
      username: 'kolkri',
      name: 'Kristiina Kolu'
    }
  }
  const user = {
    username: 'kolkri',
    name: 'Kristiina Kolu'

  }
  const { container } = render(
    <Blog blog={blog} user={user}/>
  )
  const div = container.querySelector('.all-visible')
  const button = screen.getByText('view')
  userEvent.click(button)


  expect (div).toHaveTextContent(blog.url)
  expect (div).toHaveTextContent(blog.likes)


})

test('if like clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kristiina Kolu',
    url: 'google.com',
    likes: 0,
    user: {
      username: 'kolkri',
      name: 'Kristiina Kolu'
    }
  }
  const user = {
    username: 'kolkri',
    name: 'Kristiina Kolu'
  }
  const mockHandler = jest.fn()
  render(<Blog blog={blog} user={user} likeCallback={mockHandler}/>)

  const eventUser = userEvent.setup()
  const button = screen.getByText('like')
  await eventUser.click(button)
  await eventUser.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
