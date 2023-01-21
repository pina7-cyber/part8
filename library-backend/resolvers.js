const { UserInputError, AuthenticationError } = require("apollo-server")
const jwt = require("jsonwebtoken")
const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

const JWT_SECRET = "NEED_HERE_A_SECRET_KEY"

const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      if (!author) {
        if (!args.genre) {
          return Book.find({}).populate("author")
        }
        return Book.find({ genres: { $in: [args.genre] } }).populate("author")
      }
      if (!args.genre) {
        return Book.find({ author: { $in: [author._id] } }).populate("author")
      }
      return Book.find({
        genres: { $in: [args.genre] },
        author: { $in: [author._id] },
      }).populate("author")
    },
    allAuthors: async (root, args) => {
      return Author.find({}).populate("books")
    },
    findAuthor: async (root, args) =>
      Author.findOne({ name: args.name }).populate("books"),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      console.log(root)
      return root.books.length
      //return (await Book.find({ author: { $in: [root.id] } })).length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const foundAuthor = await Author.findOne({ name: args.author })
      const author = foundAuthor
        ? foundAuthor
        : new Author({ name: args.author })
      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()

        author.books = author.books.concat(book._id)
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book.populate("author") })

      return book.populate("author")
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new UserInputError("author not found")
      }
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
