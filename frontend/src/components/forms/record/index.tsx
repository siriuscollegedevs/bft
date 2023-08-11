import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { useState } from 'react'

export const FormRecord = () => {
  const [gender, setGender] = useState('Человек')

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string)
  }

  return (
    <FormControl fullWidth>
      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={gender} onChange={handleChange}>
        <MenuItem value={'Человек'}>Человек</MenuItem>
        <MenuItem value={'Транспорт'}>Транспорт</MenuItem>
      </Select>
    </FormControl>
  )
}
