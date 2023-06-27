import { TextField } from '@mui/material'
import * as React from 'react'
import { CustomDefaultButton } from '../../../styles/settings'
import { useState } from 'react'

export const FormObject = () => {
  const [fieldObject, setFieldObject] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    if (fieldObject.trim() === '') {
      setError(true)
    } else {
      setError(false)
    }
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Наименование объекта"
        focused
        variant="outlined"
        required
        value={fieldObject}
        onChange={e => setFieldObject(e.target.value)}
        sx={{ m: 1, width: '85%' }}
        error={error && !fieldObject}
        helperText={error && !fieldObject && 'Это поле обязательно.'}
      />
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
