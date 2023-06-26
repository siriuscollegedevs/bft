import { TextField } from '@mui/material'
import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import { CustomDefaultButton } from '../../../styles/settings'

type Fields = {
  surname: string
  name: string
  patronymic: string
  login: string
  password: string
}

type Errors = {
  surname: boolean
  name: boolean
  patronymic: boolean
  login: boolean
  password: boolean
}

export const FormAccount = () => {
  const roles = [
    {
      value: 'admin',
      label: 'Администратор'
    },
    {
      value: 'manager',
      label: 'Руководитель'
    },
    {
      value: 'sb',
      label: 'СБ'
    },
    {
      value: 'security',
      label: 'Сотрудник охраны'
    }
  ]

  const [fields, setFields] = useState<Fields>({
    surname: '',
    name: '',
    patronymic: '',
    login: '',
    password: ''
  })

  const [errors, setErrors] = useState<Errors>({
    surname: false,
    name: false,
    patronymic: false,
    login: false,
    password: false
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
      login: false,
      password: false
    }

    Object.entries(fields).forEach(([field, value]) => {
      if (value.trim() === '') {
        newErrors[field as keyof Fields] = true
        hasErrors = true
      }
    })

    setErrors(newErrors)
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
      <TextField
        id="login"
        label="Логин"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={errors.login}
        helperText={errors.login && 'Это поле обязательно.'}
        value={fields.login}
        onChange={e => handleFieldChange('login', e.target.value)}
      />
      <TextField
        id="accountType"
        select
        label="Тип учетной записи"
        defaultValue="admin"
        focused
        required
        sx={{ m: 1, width: '85%' }}
      >
        {roles.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="password"
        label="Пароль"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={errors.password}
        helperText={errors.password && 'Это поле обязательно.'}
        value={fields.password}
        onChange={e => handleFieldChange('password', e.target.value)}
      />
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
