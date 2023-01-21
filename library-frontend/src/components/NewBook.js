import { useState } from "react"
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS } from "../queries"
import { useMutation, useSubscription } from "@apollo/client"
import { BOOK_ADDED } from "../queries"
import { updateCache, updateCacheofAuthors } from "../utils"

const NewBook = (props) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    },

    update: (cache, response) => {
      updateCache(
        cache,
        {
          query: ALL_BOOKS,
        },
        response.data.addBook
      )
    },
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      console.log(addedBook.author)
      const genresToUpdate = addedBook.genres.concat(null)
      props.setError(`${addedBook.title} added`)
      genresToUpdate.forEach((g) => {
        updateCache(
          client.cache,
          { query: ALL_BOOKS, variables: { genre: g } },
          addedBook
        )
      })
      updateCacheofAuthors(
        client.cache,
        { query: ALL_AUTHORS },
        addedBook.author
      )
    },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: { title, author, published, genres } })

    setTitle("")
    setPublished("")
    setAuthor("")
    setGenres([])
    setGenre("")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
