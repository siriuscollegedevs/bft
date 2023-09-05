import { FormControl, FormHelperText, TextField } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { CustomDefaultButton } from '../../../styles/settings'
import { useEffect, useState } from 'react'
import {
  useCreateAccountToObjectMutation,
  useGetAccountToObjectsQuery,
  useUpdateAccountToObjectByIdMutation
} from '../../../__data__/service/object-account'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetAllObjectsQuery } from '../../../__data__/service/object.api'
import { Accounts, AccountToObjectCreate, Objects } from '../../../types/api'
import { useGetAccountByIdQuery, useGetAllAccountsQuery } from '../../../__data__/service/account.api'
import Autocomplete from '@mui/material/Autocomplete'

type Errors = {
  account: boolean
  object_ids: boolean
}

export const FormEmployee = () => {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const [objectName, setObjectName] = useState<string[]>([])

  const { data: objectsData } = useGetAllObjectsQuery()
  const { data: currentAccountObjectsData } = useGetAccountToObjectsQuery(id ?? '')
  const [employeesMutation, { isLoading: employeesLoading, isError: employeesError, isSuccess: employeesSuccess }] =
    useCreateAccountToObjectMutation()
  const [
    employeesUpdateMutation,
    { isLoading: employeesUpdateLoading, isError: employeesUpdateError, isSuccess: employeesUpdateSuccess }
  ] = useUpdateAccountToObjectByIdMutation()
  const { data: accountDataById, refetch: refetchAccountDataById } = useGetAccountByIdQuery(id ?? '')
  const { data: accountsData } = useGetAllAccountsQuery()

  const [sortedAccountsData, setSortedAccountsData] = useState<Accounts[]>([])
  const [sortedObjectsData, setSortedObjectsData] = useState<Objects[]>([])

  useEffect(() => {
    if (accountsData) {
      const sortedData = [...accountsData].sort((a, b) => {
        return a.last_name.localeCompare(b.last_name)
      })
      setSortedAccountsData(sortedData)
    }
  }, [accountsData])

  useEffect(() => {
    if (objectsData) {
      const sortedData = [...objectsData].sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      setSortedObjectsData(sortedData)
    }
  }, [objectsData])

  const isEditMode = !!id

  const [fields, setFields] = useState<AccountToObjectCreate>({
    account_id: '',
    object_ids: []
  })

  const [errors, setErrors] = useState<Errors>({
    account: false,
    object_ids: false
  })

  useEffect(() => {
    if (isEditMode && accountDataById && currentAccountObjectsData) {
      const objectIds = currentAccountObjectsData.map(object => object.id)
      const selectedObjectNames = currentAccountObjectsData.map(object => object.name)

      setFields(prevFields => ({
        ...prevFields,
        account_id: id || '',
        object_ids: objectIds || []
      }))

      setObjectName(selectedObjectNames)
    }
  }, [isEditMode, accountDataById, currentAccountObjectsData])

  const handleSubmit = () => {
    const newErrors: Errors = {
      account: !fields.account_id,
      object_ids: objectName.length === 0
    }

    setErrors(newErrors)

    const noErrors = Object.values(newErrors).every(error => !error)

    if (fields && noErrors) {
      if (isEditMode) {
        employeesUpdateMutation({ accountId: id, accountToObjectData: fields.object_ids })
        refetchAccountDataById()
      }
      employeesMutation({ accountId: fields.account_id, accountToObjectData: fields.object_ids })
    }
  }

  useEffect(() => {
    if ((isEditMode && employeesUpdateSuccess) || employeesSuccess) {
      navigate(-1)
    }
  }, [employeesSuccess, employeesUpdateSuccess, navigate])

  const isSaving = isEditMode ? employeesUpdateLoading : employeesLoading
  const saveError = isEditMode ? employeesUpdateError : employeesError

  if (saveError) {
    return <p>Произошла ошибка при сохранении.</p>
  }
  if (isSaving) {
    return <p>Сохранение...</p>
  }

  const handleChange = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
    setObjectName(typeof value === 'string' ? value.split(',') : value)

    if (Array.isArray(value)) {
      const selectedObjectIds = value.map((selectedName: string) => {
        const selectedObject = objectsData?.find(object => object.name === selectedName)
        return selectedObject ? selectedObject.id : ''
      })

      setFields(prevFields => ({
        ...prevFields,
        object_ids: selectedObjectIds.filter((id: string) => id !== '')
      }))
    }
  }

  const handleFieldChange = (field: keyof AccountToObjectCreate, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [field]: value
    }))
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        width: 250
      }
    }
  }

  return (
    <>
      <Autocomplete
        id="account"
        options={sortedAccountsData}
        getOptionLabel={(account) => {
          const parts = [account.last_name, account.first_name, account.surname].filter(Boolean);
          return parts.join(' ');
        }}
        value={sortedAccountsData.find(account => account.id === fields.account_id) || null}
        onChange={(event, newValue) => {
          handleFieldChange('account_id', newValue?.id || '')
        }}
        sx={{ m: 1, width: '85%' }}
        noOptionsText="Ничего не найдено."
        disabled={isEditMode}
        renderInput={params => (
          <TextField
            {...params}
            label="ФИО"
            focused
            required
            disabled={isEditMode}
            error={errors.account}
            helperText={errors.account && 'Выберите учетную запись для закрепления.'}
          />
        )}
      />
      <FormControl sx={{ m: 1, width: '85%' }} focused required>
        <InputLabel id="demo-multiple-checkbox-label" error={errors.object_ids}>
          Объект(-ы) Фонда
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          required
          value={objectName}
          onChange={handleChange}
          input={<OutlinedInput label="Объект(-ы) Фонда" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
          error={errors.object_ids}
        >
          {sortedObjectsData?.map(object => (
            <MenuItem key={object.id} value={object.name}>
              <Checkbox checked={objectName.indexOf(object.name) > -1} />
              <ListItemText primary={object.name} />
            </MenuItem>
          ))}
        </Select>
        {errors.object_ids && <FormHelperText error>Выберите хотя бы один Объект Фонда.</FormHelperText>}
      </FormControl>
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
