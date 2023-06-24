import { TextField } from '@mui/material'
import * as React from 'react'

export const FormObject = () => {
  return (
    <>
      <TextField
        id="outlined-basic"
        label="Наименование объекта"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
      />
    </>
  )
}
