import { FormControl, TextField } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'

export const FormEmployee = () => {
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const fundObjectsName = [
    { id: 1, name: 'Наименование 1' },
    { id: 2, name: 'Наименование 2' },
    { id: 3, name: 'Наименование 3' },
    { id: 4, name: 'Наименование 4' },
    { id: 5, name: 'Наименование 5' },
    { id: 6, name: 'Наименование 6' },
    { id: 7, name: 'Наименование 7' }
  ]

  const [objectName, setObjectName] = React.useState<string[]>([])

  const handleChange = (event: SelectChangeEvent<typeof objectName>) => {
    const {
      target: { value }
    } = event
    setObjectName(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <>
      <TextField id="outlined-basic" label="Фамилия" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <TextField id="outlined-basic" label="Имя" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <TextField id="outlined-basic" label="Отчество" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <FormControl sx={{ m: 1, width: '85%' }} focused>
        <InputLabel id="demo-multiple-checkbox-label">Объект(-ы) Фонда</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={objectName}
          onChange={handleChange}
          input={<OutlinedInput label="Объект(-ы) Фонда" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {fundObjectsName.map(object => (
            <MenuItem key={object.id} value={object.name}>
              <Checkbox checked={objectName.indexOf(object.name) > -1} />
              <ListItemText primary={object.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
