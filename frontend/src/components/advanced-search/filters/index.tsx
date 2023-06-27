import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React from 'react'
import { Container } from '@mui/system'
import { TextField } from '@mui/material'

export const Filters = () => {
  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 845, height: 500 }}>
      <FormControl sx={{ flexDirection: 'row' }}>
        <InputLabel id="label">Age</InputLabel>
        <Select
          labelId="label"
          id="demo-simple-select"
          value={'Ten'}
          label="Age"
          sx={{ width: '280px', height: '50px' }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <TextField
          label="Значение"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          focused
          sx={{ marginLeft: '80px', height: '50px', width: '485px' }}
        />
      </FormControl>
    </Container>
  )
}
