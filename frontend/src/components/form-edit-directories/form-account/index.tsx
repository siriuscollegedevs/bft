import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import { CustomDefaultButton } from '../../../styles/settings'
import { ACCOUNT_ROLES } from '../../../__data__/consts/account-roles'
import { useCreateAccountMutation } from '../../../__data__/service/account.api'
import { Account } from '../../../types/api'
import { useNavigate } from 'react-router-dom'

type Errors = {
  role: boolean
  first_name: boolean
  surname: boolean
  last_name: boolean
  username: boolean
  password: boolean
}

export const FormAccount = () => {
  const navigate = useNavigate()
  const [accountsMutation, { data: accountData, isLoading: accountLoading, isError: accountError, isSuccess }] =
    useCreateAccountMutation()

  const [fields, setFields] = useState<Account>({
    role: '',
    first_name: '',
    surname: '',
    last_name: '',
    username: '',
    password: ''
  })

  const [errors, setErrors] = useState<Errors>({
    role: false,
    first_name: false,
    surname: false,
    last_name: false,
    username: false,
    password: false
  })

  const handleFieldChange = (field: keyof Account, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    const newErrors: Errors = {
      role: false,
      first_name: false,
      surname: false,
      last_name: false,
      username: false,
      password: false
    }

    Object.entries(fields).forEach(([field, value]) => {
      if (value.trim() === '') {
        if (field === 'first_name' || field === 'surname') {
          newErrors[field as keyof Account] = false;
        } else {
          newErrors[field as keyof Account] = true;
        }
      }
    });

    setErrors(newErrors)

    const noErrors = Object.values(newErrors).every(error => !error)

    if (fields && noErrors) {
      accountsMutation(fields)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      navigate(-1)
    }
  }, [isSuccess, navigate])

  if (accountLoading) {
    return <p>Сохранение...</p>
  }

  if (accountError) {
    return <p>Произошла ошибка при сохранении.</p>
  }

  return (
    <>
      <TextField
        id="last_name"
        label="Фамилия"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={!fields.last_name && errors.last_name}
        helperText={!fields.last_name && errors.last_name && 'Это поле обязательно.'}
        value={fields.last_name}
        onChange={e => handleFieldChange('last_name', e.target.value)}
      />
      <TextField
        id="first_name"
        label="Имя"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        value={fields.first_name}
        onChange={e => handleFieldChange('first_name', e.target.value)}
      />
      <TextField
        id="surname"
        label="Отчество"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        value={fields.surname}
        onChange={e => handleFieldChange('surname', e.target.value)}
      />
      <TextField
        id="login"
        label="Логин"
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={!fields.username && errors.username}
        helperText={!fields.username && errors.username && 'Это поле обязательно.'}
        value={fields.username}
        onChange={e => handleFieldChange('username', e.target.value)}
      />
      <TextField
        id="role"
        select
        label="Тип учетной записи"
        defaultValue="admin"
        focused
        required
        error={!fields.role && errors.role}
        helperText={!fields.role && errors.role && 'Это поле обязательно.'}
        value={fields.role}
        sx={{ m: 1, width: '85%' }}
        onChange={e => handleFieldChange('role', e.target.value)}
      >
        {Object.entries(ACCOUNT_ROLES).map(([roleValue, roleLabel]) => (
          <MenuItem key={roleValue} value={roleValue}>
            {roleLabel}
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
        error={!fields.password && errors.password}
        helperText={!fields.password && errors.password && 'Это поле обязательно.'}
        value={fields.password}
        onChange={e => handleFieldChange('password', e.target.value)}
      />
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
