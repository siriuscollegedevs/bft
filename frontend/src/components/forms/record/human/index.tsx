import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material'
import { CustomDefaultButton } from '../../../../styles/settings'
import { useState } from 'react'
import { RECORD_TYPE } from '../../../../__data__/consts/record'

type FieldsState = {
  lastName: string
  firstName: string
  surname: string
  type: string
  date: string
  note: string
}

export const Human = () => {
  const [error, setError] = useState(false)
  const [fields, setFields] = useState<FieldsState>({
    lastName: '',
    firstName: '',
    surname: '',
    type: 'Разовый',
    date: '',
    note: ''
  })

  const handleChange = (event: SelectChangeEvent) => {
    handleFieldChange('type', event.target.value as string)
  }

  const handleFieldChange = (field: keyof FieldsState, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    let hasEmptyField = false

    for (const value of Object.values(fields)) {
      if (value.trim() === '') {
        hasEmptyField = true
      }
    }

    if (hasEmptyField) {
      setError(true)
    } else {
      console.log(fields)
    }
  }

  return (
    <>
      <TextField
        id="lastName"
        label="Фамилия"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={error}
        helperText={!fields.lastName && 'Это поле обязательно.'}
        value={fields.lastName}
        onChange={e => handleFieldChange('lastName', e.target.value)}
      />
      <TextField
        id="firstName"
        label="Имя"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={error}
        helperText={!fields.firstName && 'Это поле обязательно.'}
        value={fields.firstName}
        onChange={e => handleFieldChange('firstName', e.target.value)}
      />
      <TextField
        id="surname"
        label="Отчество"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={error}
        helperText={!fields.surname && 'Это поле обязательно.'}
        value={fields.surname}
        onChange={e => handleFieldChange('surname', e.target.value)}
      />
      <FormControl sx={{ m: 1, width: '85%' }} focused required>
        <InputLabel id="demo-multiple-checkbox-label">Тип</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={fields.type}
          onChange={handleChange}
          input={<OutlinedInput label="Тип" />}
        >
          <MenuItem value={RECORD_TYPE.for_once}>{RECORD_TYPE.for_once}</MenuItem>
          <MenuItem value={RECORD_TYPE.for_long_time}>{RECORD_TYPE.for_long_time}</MenuItem>
        </Select>
      </FormControl>
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
