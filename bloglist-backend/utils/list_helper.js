const blog = require("../models/blog")
const _ = require("lodash")
const { groupBy, sortBy } = require("lodash")

const dummy = (blogs) => 1

const totalLikes = blogs => blogs.reduce((total, blog) => total + blog.likes, 0)

const favoriteBlog = blogs => {
    if (blogs.length > 0) { //If the array isn't empty
    //Find the favorite blog
    const blogWithMostLikes = blogs.reduce((a, b) => b.likes > a.likes ? b : a)

    // Remove (_id, url, __v,) from the object so it's in the expected fromat
    const { _id, url, __v, ...favoriteBlog } = blogWithMostLikes

    return favoriteBlog
    } else { //The array is empty
        return blogs
    }
}

const mostBlogs = blogs => {
    if (blogs.length > 0) { //If the array isn't empty
    const GroupOfAuthorWithMostBlogs = groupBy(blogs, 'author')
    const sortedAuthorsWithMostBlogs = sortBy(GroupOfAuthorWithMostBlogs, 'blogs')
    const authorWithMostBlogs = sortedAuthorsWithMostBlogs[sortedAuthorsWithMostBlogs.length - 1]

    return (
        {
            author: authorWithMostBlogs[0].author,
            blogs: authorWithMostBlogs.length
        }
    )
    } else { //The array is empty
        return blogs
    }
}

const mostLikes = blogs => {
    if (blogs.length > 0) { //If the array isn't empty
    const authorWithMostLikes = _(blogs).groupBy('author')
    .map((objs, key) => ({
    'author': key,
    'likes': _.sumBy(objs, 'likes') }))
    .value().reduce((a, b) => b.likes > a.likes ? b : a)

    return (
        authorWithMostLikes
    )    
} else { //The array is empty
        return blogs
    }
    
}
  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }