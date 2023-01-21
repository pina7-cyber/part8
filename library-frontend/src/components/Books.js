//ex.8.19 Books by genre using just react. Not used in final version.

import { useBookFilter } from "../hooks"
import { useEffect } from "react"

const Books = (props) => {
  const filter = useBookFilter()
  const genres = filter.genres
  const books = filter.books

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
          {books.map((b) => (
            <tr
              key={b.id}
              style={{ display: filter.isSelected(b.id) ? "" : "none" }}
            >
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button
          style={{ backgroundColor: filter.isSelected(g) ? "blue" : "" }}
          key={g}
          value={g}
          onClick={filterHandler}
        >
          {g}
        </button>
      ))}
      <button value='all' onClick={filterHandler}>
        {filter.isSelected("all") ? "select" : "all genres"}
      </button>
    </div>
  )
}

export default Books
