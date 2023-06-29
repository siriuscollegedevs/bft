import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Container } from '@mui/system'
import { TextField, Typography } from '@mui/material'
import React from 'react'

const directoriesProperties: { [key: string]: string } = {
  fullName: 'ФИО',
  role: 'Роль',
  email: 'Электронная почта'
}

export const Filters = () => {
  // const [age, setAge] = React.useState('')

  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value as string)
  // }

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 845,
        height: 500,
        flexDirection: 'column'
      }}
    >
      {Object.keys(directoriesProperties).map((property: string) => (
        <FormControl key={property} sx={{ flexDirection: 'row' }} focused>
          {/* <InputLabel id={`label-${property}`}>Age</InputLabel>
          <Select
            labelId={`label-${property}`}
            id={`select-${property}`}
            label="Age"
            color="primary"
            inputProps={{ shrink: true }}
            sx={{
              width: '280px',
              height: '100%',
              alignSelf: 'center'
            }}
            value={age}
            onChange={handleChange}
          >
            {Object.values(directoriesProperties).map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select> */}
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {directoriesProperties[property]}
          </Typography>
          <TextField
            label={directoriesProperties[property]}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            focused
            color="primary"
            sx={{ marginLeft: '80px', height: '100%', width: '485px', alignSelf: 'center',marginTop: '20px'}}
          />
        </FormControl>
      ))}
    </Container>
  )
}
