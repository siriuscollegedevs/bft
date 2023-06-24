import { TextField } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'

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
  return (
    <>
      <TextField id="outlined-basic" label="Фамилия" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <TextField id="outlined-basic" label="Имя" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <TextField id="outlined-basic" label="Отчество" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <TextField id="outlined-basic" label="Логин" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
      <TextField
        id="outlined-select-currency"
        select
        label="Тип учетной записи"
        defaultValue="admin"
        focused
        sx={{ m: 1, width: '85%' }}
      >
        {roles.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField id="outlined-basic" label="Пароль" focused variant="outlined" sx={{ m: 1, width: '85%' }} />
    </>
  )
}
