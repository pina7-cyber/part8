// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  try {
    cache.updateQuery(query, ({ allBooks }) => {
      return {
        allBooks: uniqByTitle(allBooks.concat(addedBook)),
      }
    })
  } catch {
    console.log("not active")
  }
}

export const updateCacheofAuthors = (cache, query, addedAuthor) => {
  const unique = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }
  try {
    cache.updateQuery(query, ({ allAuthors }) => {
      return {
        allAuthors: unique(allAuthors.concat(addedAuthor)),
      }
    })
  } catch {
    console.log("not active Authors")
  }
}
