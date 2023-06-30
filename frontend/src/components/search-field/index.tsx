import { InputAdornment, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import * as React from 'react'

export const SearchField = () => {
  return (
    <>
      <TextField
        id="input-with-icon-textfield"
        color="primary"
        label=""
        type="search"
        placeholder="Поиск..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          )
        }}
        variant="standard"
      />
    </>
  )
}
