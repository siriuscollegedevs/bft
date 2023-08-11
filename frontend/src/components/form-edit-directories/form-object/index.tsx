import { TextField } from '@mui/material'
import * as React from 'react'
import { CustomDefaultButton } from '../../../styles/settings'
import { useEffect, useState } from 'react'
import { useCreateObjectMutation } from '../../../__data__/service/object.api'
import { soloObject } from '../../../types/api'
import { useNavigate } from 'react-router-dom'

export const FormObject = () => {
  const navigate = useNavigate()
  const [fieldObject, setFieldObject] = useState<soloObject>({
    name: ''
  })
  const [error, setError] = useState(false)
  const [
    objectsMutation,
    { data: objectData, isLoading: objectLoading, isError: objectError, isSuccess: objectSuccess }
  ] = useCreateObjectMutation()

  const handleSubmit = () => {
    if (fieldObject.name.trim() === '') {
      setError(true)
    } else {
      setError(false)
    }

    if (fieldObject.name && !error) {
      objectsMutation(fieldObject)
    }
  }

  useEffect(() => {
    if (objectSuccess) {
      navigate(-1)
    }
  }, [objectSuccess, navigate])

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
        onChange={e => setFieldObject({ name: e.target.value })}
        sx={{ m: 1, width: '85%' }}
        error={error && !fieldObject.name}
        helperText={error && !fieldObject.name && 'Это поле обязательно.'}
      />
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
