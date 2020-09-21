import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

///// Exercise 5.13
test('renders content', () => {
  const testBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Bajsmannen',
    user: {
      username: 'User 1',
      id: '5f56536ec1ead720ec990fe1'
    }
  }

  const testUser = {
    username: 'User 1',
    id: '5f56536ec1ead720ec990fe1'
  }

  const component = render(
    <Blog user={testUser} blog={testBlog} />
  )

  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

///// Exercise 5.14
test('Checks that url and numbers of likes are shown when the button controllong the shown details has been clicked', () => {
  const testBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Bajsmannen',
    url: 'www.test.com',
    likes: 13,
    id: '5f56569a26ca0d644026a969',
    user: {
      username: 'User 1',
      id: '5f56536ec1ead720ec990fe1'
    }
  }

  const testUser = {
    username: 'User 1',
    id: '5f56536ec1ead720ec990fe1'
  }

  //const mockHandler = jest.fn()

  const component = render(
    <Blog user={testUser} blog={testBlog} />
  )

  const button = component.getByText('View')
  fireEvent.click(button)

  const div = component.container.querySelector('.dropdown')
  expect(div).toHaveTextContent('www.test.com')
  expect(div).toHaveTextContent('Likes: 13')
})

//5.15
test('Click the like button twice', () => {
  const testBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Bajsmannen',
    url: 'www.test.com',
    likes: 13,
    id: '5f56569a26ca0d644026a969',
    user: {
      username: 'User 1',
      id: '5f56536ec1ead720ec990fe1'
    }
  }

  const testUser = {
    username: 'User 1',
    id: '5f56536ec1ead720ec990fe1'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog user={testUser} blog={testBlog} addLike={mockHandler}/>
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})