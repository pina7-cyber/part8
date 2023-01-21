import { useState } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

export const useNotify = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const setError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return {
    errorMessage,
    setError,
  }
}

//ex.8.19 Books by genre using just react. useBookFilter not used in final version.
export const useBookFilter = () => {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState(["all"])

  const initializeLibrary = (array) => {
    setBooks(array)
    let genres = []
    for (let i = 0; i < array.length; i++) {
      for (let x in array[i].genres) {
        if (!genres.find((g) => g === array[i].genres[x])) {
          genres = genres.concat(array[i].genres[x])
        }
      }
    }
    setGenres(genres)
  }

  const selectGenre = (genre) => {
    if (genre === "all") {
      if (selectedGenres.find((g) => g === "all")) {
        setSelectedGenres([])
      } else setSelectedGenres(genres.concat(genre))
    } else if (selectedGenres.find((g) => g === "all")) {
      setSelectedGenres([genre])
    } else if (selectedGenres.find((g) => g === genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres(selectedGenres.concat(genre))
    }
  }

  const isSelected = (id) => {
    if (selectedGenres.find((g) => g === "all")) {
      return true
    }
    if (selectedGenres.length === genres.length) {
      setSelectedGenres(selectedGenres.concat("all"))
      return true
    }
    if (books.find((b) => b.id === id)) {
      const book = books.find((b) => b.id === id)
      for (let x in book.genres) {
        for (let i in selectedGenres) {
          if (book.genres[x] === selectedGenres[i]) {
            return true
          }
        }
      }
      return false
    }
    if (selectedGenres.find((g) => g === id)) {
      for (let x in selectedGenres) {
        if (selectedGenres[x] === id) {
          return true
        }
      }
      return false
    }
  }

  return {
    genres,
    initializeLibrary,
    books,
    selectGenre,
    selectedGenres,
    isSelected,
  }
}

export const useGenreFilter = () => {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre },
  })
  const books = result.data ? result.data.allBooks : []

  const initializeLibrary = (array) => {
    let genres = []
    for (let i = 0; i < array.length; i++) {
      for (let x in array[i].genres) {
        if (!genres.find((g) => g === array[i].genres[x])) {
          genres = genres.concat(array[i].genres[x])
        }
      }
    }
    setGenres(genres)
  }

  const selectGenre = (g) => {
    if (g === "all") {
      setGenre(null)
    } else setGenre(g)
  }

  return {
    genres,
    initializeLibrary,
    selectGenre,
    books,
    genre,
  }
}
