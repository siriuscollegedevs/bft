import { FormControl, FormHelperText, TextField } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { CustomDefaultButton } from '../../../styles/settings'
import { useState } from 'react'

type Fields = {
  surname: string
  name: string
  patronymic: string
}

type Errors = {
  surname: boolean
  name: boolean
  patronymic: boolean
  fundObject: boolean
}

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

  const [fields, setFields] = useState<Fields>({
    surname: '',
    name: '',
    patronymic: ''
  })

  const [errors, setErrors] = useState<Errors>({
    surname: false,
    name: false,
    patronymic: false,
    fundObject: false
  })

  const handleFieldChange = (field: keyof Fields, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    let hasErrors = false
    const newErrors: Errors = {
      surname: false,
      name: false,
      patronymic: false,
      fundObject: false
    }

    Object.entries(fields).forEach(([field, value]) => {
      if (value.trim() === '') {
        newErrors[field as keyof Fields] = true
        hasErrors = true
      }
    })

    if (objectName.length === 0) {
      newErrors.fundObject = true
      hasErrors = true
    } else {
      newErrors.fundObject = false
    }

    setErrors(newErrors)
  }

  const handleChange = (event: SelectChangeEvent<typeof objectName>) => {
    const {
      target: { value }
    } = event
    setObjectName(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <>
      <TextField
        id="surname"
        label="Фамилия"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={errors.surname}
        helperText={errors.surname && 'Это поле обязательно.'}
        value={fields.surname}
        onChange={e => handleFieldChange('surname', e.target.value)}
      />
      <TextField
        id="name"
        label="Имя"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={errors.name}
        helperText={errors.name && 'Это поле обязательно.'}
        value={fields.name}
        onChange={e => handleFieldChange('name', e.target.value)}
      />
      <TextField
        id="patronymic"
        label="Отчество"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={errors.patronymic}
        helperText={errors.patronymic && 'Это поле обязательно.'}
        value={fields.patronymic}
        onChange={e => handleFieldChange('patronymic', e.target.value)}
      />
      <FormControl sx={{ m: 1, width: '85%' }} focused required>
        <InputLabel id="demo-multiple-checkbox-label" error={errors.fundObject}>
          Объект(-ы) Фонда
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={objectName}
          onChange={handleChange}
          input={<OutlinedInput label="Объект(-ы) Фонда" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
          error={errors.fundObject}
        >
          {fundObjectsName.map(object => (
            <MenuItem key={object.id} value={object.name}>
              <Checkbox checked={objectName.indexOf(object.name) > -1} />
              <ListItemText primary={object.name} />
            </MenuItem>
          ))}
        </Select>
        {errors.fundObject && <FormHelperText error>Выберите хотя бы один Объект Фонда.</FormHelperText>}
      </FormControl>
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
