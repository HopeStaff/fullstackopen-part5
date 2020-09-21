import React from 'react'

const CreateForm = ({ addBlog, handleNameChange, handleNumberChange, handleUrlChange, newTitle, newAuthor, newUrl }) => {



  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        Title:&nbsp;<input id='title' value={newTitle} onChange={handleNameChange}/><br/>
        Author:&nbsp;<input id='author' value={newAuthor} onChange={handleNumberChange}/><br/>
        Url:&nbsp;<input id='url' value={newUrl} onChange={handleUrlChange}/><br/>
        <button id='create-btn' type='submit'>create</button>
      </form>
    </>
  )
}

export default CreateForm