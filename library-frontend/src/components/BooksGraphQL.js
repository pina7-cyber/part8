//ex.8.21 Books by genre using GraphQL query to the server.

import { useGenreFilter } from "../hooks"
import { useEffect } from "react"

const Books = (props) => {
  const filter = useGenreFilter()

  useEffect(() => {
    if (props.books) {
      filter.initializeLibrary(props.books)
    }
  }, [props.books]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  const filterHandler = (event) => {
    filter.selectGenre(event.target.value)
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filter.books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filter.genres.map((g) => (
        <button
          style={{ backgroundColor: g === filter.genre ? "blue" : "" }}
          key={g}
          value={g}
          onClick={filterHandler}
        >
          {g}
        </button>
      ))}
      <button
        style={{
          backgroundColor: filter.genre === null ? "blue" : "",
        }}
        value={"all"}
        onClick={filterHandler}
      >
        all genres
      </button>
    </div>
  )
}

export default Books
