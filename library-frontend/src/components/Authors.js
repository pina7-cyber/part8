import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import { useMutation } from "@apollo/client"
import { EDIT_AUTHOR } from "../queries"

const Authors = (props) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [changeBirthYear, result] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name: name, setBornTo: born } })

    setName("")
    setBorn("")
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      props.setError("author not found")
    }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  const authors = props.authors

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>set birthyear</h3>

        <Box component={"form"} onSubmit={submit} sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel>name</InputLabel>
            <Select
              value={name}
              label='Name'
              onChange={({ target }) => setName(target.value)}
            >
              {authors.map((a) => (
                <MenuItem key={a.id} value={a.name}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>born</InputLabel>
            <OutlinedInput
              value={born}
              onChange={({ target }) => setBorn(parseInt(target.value))}
            />
          </FormControl>
          <button type='submit'>update Author</button>
        </Box>
      </div>
    </div>
  )
}

export default Authors
