import { useQuery } from "@apollo/client"
import { FAVORITE_GENRE } from "../queries"
import { ALL_BOOKS } from "../queries"

const Recommend = (props) => {
  const recommend = useQuery(FAVORITE_GENRE)

  const result =
    recommend.data && recommend.data.me
      ? recommend.data.me.favouriteGenre
      : "unavailable"

  const books = useQuery(ALL_BOOKS, {
    variables: { genre: result },
  })

  if (!props.show) {
    return null
  }
  if (recommend.loading || books.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{result}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Recommend
