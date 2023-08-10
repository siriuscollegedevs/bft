import { TextField } from '@mui/material'
import * as React from 'react'
import { CustomDefaultButton } from '../../../styles/settings'
import { useState } from 'react'
import { useCreateObjectMutation } from '../../../__data__/service/object.api'
import { soloObject } from '../../../types/api'

export const FormObject = () => {
  const [fieldObject, setFieldObject] = useState<soloObject>({
      name: ''
  })
  const [error, setError] = useState(false)
  const [objectsMutation, { data: objectData, isLoading: objectLoading, isError: objectError }] =
    useCreateObjectMutation()

  const handleSubmit = () => {
    if (fieldObject.name.trim() === '') {
      setError(true)
    } else {
      setError(false)
    }
    if (fieldObject) {
        objectsMutation(fieldObject)
    }
  }

  if (objectLoading) {
    return <p>Сохранение...</p>
  }

  if (objectError) {
    return <p>Произошла ошибка при сохранении.</p>
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Наименование объекта"
        focused
        variant="outlined"
        required
        value={fieldObject.name}
        onChange={e => setFieldObject({name: e.target.value})}
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
