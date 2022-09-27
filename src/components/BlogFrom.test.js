import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('checks that event handlerer received as props the right details when blog is created', async () => {
  const user = userEvent.setup()
  const addBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={addBlog}/>)

  const sendButton = screen.getByText('create')
  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')

  await user.type(titleInput, 'title here')
  await user.type(authorInput, 'author here')
  await user.type(urlInput, 'url here')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  console.log('mock: ', addBlog.mock.calls[0][0].title)
  expect(addBlog.mock.calls[0][0].title).toBe('title here')
  expect(addBlog.mock.calls[0][0].author).toBe('author here')
  expect(addBlog.mock.calls[0][0].url).toBe('url here')

})