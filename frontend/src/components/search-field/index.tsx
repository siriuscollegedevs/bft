import { InputAdornment, TextField } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import * as React from 'react'
import { setSearchField } from '../../__data__/states/search'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export const SearchField = () => {
  const dispatch = useDispatch()
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value
    dispatch(setSearchField(searchQuery))
  }

  useEffect(() => {
    dispatch(setSearchField(''))
  }, [])

  return (
    <>
      <TextField
        id="input-with-icon-textfield"
        color="primary"
        label=""
        type="search"
        placeholder="Поиск..."
        onChange={handleSearchChange}
        sx={{
          height: '100%',
          '& .MuiInputBase-root.MuiInput-root': {
            height: '100%'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ height: '100%' }}>
              <SearchOutlinedIcon />
            </InputAdornment>
          )
        }}
        variant="standard"
      />
    </>
  )
}
