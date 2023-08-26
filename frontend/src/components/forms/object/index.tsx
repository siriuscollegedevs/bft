import { TextField } from '@mui/material'
import { CustomDefaultButton } from '../../../styles/settings'
import { useEffect, useState } from 'react'
import {
  useCreateObjectMutation,
  useGetObjectByIdQuery,
  useUpdateObjectByIdMutation
} from '../../../__data__/service/object.api'
import { soloObject } from '../../../types/api'
import { useNavigate, useParams } from 'react-router-dom'

export const FormObject = () => {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const [fieldObject, setFieldObject] = useState<soloObject>({
    name: ''
  })
  const [error, setError] = useState(false)
  const [objectsMutation, { isLoading: objectUpdateLoading, isError: objectError, isSuccess: objectSuccess }] =
    useCreateObjectMutation()
  const {
    data: objectsDataById,
    isLoading: objectLoading,
    refetch: refetchObjectsDataById
  } = useGetObjectByIdQuery(id ?? '')
  const [updateObjectMutation, { isLoading: updateLoading, isError: updateError, isSuccess: updateSuccess }] =
    useUpdateObjectByIdMutation()
  const isEditMode = !!id

  useEffect(() => {
    if (isEditMode && objectsDataById) {
      setFieldObject(objectsDataById)
    }
  }, [isEditMode, objectsDataById])

  const handleSubmit = () => {
    if (fieldObject.name.trim() === '') {
      setError(true)
    } else {
      setError(false)
    }

    const noErrors = !error

    if (fieldObject.name && noErrors) {
      if (isEditMode) {
        updateObjectMutation({ objectId: id, objectData: fieldObject })
        refetchObjectsDataById()
      }
      objectsMutation(fieldObject)
    }
  }

  useEffect(() => {
    if (objectSuccess || updateSuccess) {
      navigate(-1)
    }
  }, [objectSuccess, updateSuccess, navigate])

  if (objectLoading || objectUpdateLoading) {
    return <p>Сохранение...</p>
  }

  if (objectError || updateError) {
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
