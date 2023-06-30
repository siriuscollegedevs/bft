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
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
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
    const newErrors: Errors = {
      surname: false,
      name: false,
      patronymic: false,
      fundObject: false
    }

    Object.entries(fields).forEach(([field, value]) => {
      if (value.trim() === '') {
        newErrors[field as keyof Fields] = true
      }
    })

    newErrors.fundObject = objectName.length === 0;

    setErrors(newErrors)
  }

  const handleChange = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
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
        error={!fields.surname && errors.surname}
        helperText={!fields.surname && errors.surname && 'Это поле обязательно.'}
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
        error={!fields.name && errors.name}
        helperText={!fields.name && errors.name && 'Это поле обязательно.'}
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
        error={!fields.patronymic && errors.patronymic}
        helperText={!fields.patronymic && errors.patronymic && 'Это поле обязательно.'}
        value={fields.patronymic}
        onChange={e => handleFieldChange('patronymic', e.target.value)}
      />
      <FormControl sx={{ m: 1, width: '85%' }} focused required>
        <InputLabel id="demo-multiple-checkbox-label" error={errors.fundObject && !objectName}>
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
          error={errors.fundObject && !objectName}
        >
          {fundObjectsName.map(object => (
            <MenuItem key={object.id} value={object.name}>
              <Checkbox checked={objectName.indexOf(object.name) > -1} />
              <ListItemText primary={object.name} />
            </MenuItem>
          ))}
        </Select>
        {errors.fundObject && !objectName && <FormHelperText error>Выберите хотя бы один Объект Фонда.</FormHelperText>}
      </FormControl>
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
