import { useState, useEffect } from "react"
import Authors from "./components/Authors"
//import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Recommend from "./components/Recommend"
import Books from "./components/BooksGraphQL"
import { useQuery, useApolloClient } from "@apollo/client"
import { ALL_AUTHORS } from "./queries"
import { ALL_BOOKS } from "./queries"
import { useNotify } from "./hooks"
import LoginForm from "./components/LoginForm"

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("authors")

  const result = useQuery(ALL_AUTHORS)

  const resultBooks = useQuery(ALL_BOOKS)
  const notify = useNotify()
  const client = useApolloClient()

  useEffect(() => {
    const localToken = window.localStorage.getItem("library-user-token")
    if (localToken) {
      setToken(localToken)
    }
  }, [])

  if (result.loading) {
    return <div>loading...</div>
  }
  if (resultBooks.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  const Notify = ({ errorMessage }) => {
    if (!errorMessage) {
      return null
    }
    return <div style={{ color: "red" }}>{errorMessage}</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>
      <div>
        <Notify errorMessage={notify.errorMessage} />
      </div>
      <Authors
        show={page === "authors"}
        authors={result.data.allAuthors}
        setError={notify.setError}
      />

      <Books show={page === "books"} books={resultBooks.data.allBooks} />

      <NewBook show={page === "add"} setError={notify.setError} />
      <Recommend
        show={page === "recommend"}
        setToken={setToken}
        setPage={setPage}
      />
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify.setError}
        setPage={setPage}
      />
    </div>
  )
}

export default App
