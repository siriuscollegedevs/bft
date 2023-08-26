import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material'
import { CustomDefaultButton } from '../../../../styles/settings'
import { SetStateAction, useEffect, useState } from 'react'
import { RECORD_FIELDS, RECORD_TYPE } from '../../../../__data__/consts/record'
import { Box } from '@mui/system'
import {
  useCreateHumanRecordMutation,
  useGetRecordByIdQuery,
  useUpdateRecordByIdMutation
} from '../../../../__data__/service/record.api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AdmissionTechnical, setIdsOfCreatedAdmissions } from '../../../../__data__/states/admission-technical'

type FieldsState = {
  lastName: string
  firstName: string
  surname: string
  type: string
  note: string
}

export const Human = () => {
  const [error, setError] = useState<{ lastName: boolean; firstName: boolean; surname: boolean }>({
    lastName: false,
    firstName: false,
    surname: false
  })
  const [hasValidation, setHasValidation] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const { id } = useParams<string>()
  const { data: recordData } = useGetRecordByIdQuery(id ?? '')
  const [startDate, setStartDate] = useState(recordData?.from_date || new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(recordData?.to_date || new Date().toISOString().split('T')[0])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditFlag = location.state?.edit
  const isCreateFlag = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.isCreateFlag
  )
  const admissionId = location.state?.id
  const [createHumanRecordMutation, { isLoading: createHumanRecordLoading, isError: createHumanRecordError }] =
    useCreateHumanRecordMutation()
  const [updateHumanRecordMutation, { isLoading: updateHumanRecordLoading, isError: updateHumanRecordError }] =
    useUpdateRecordByIdMutation()
  const [fields, setFields] = useState<FieldsState>({
    lastName: '',
    firstName: '',
    surname: '',
    type: RECORD_TYPE.for_once,
    note: ''
  })

  useEffect(() => {
    if (isEditFlag) {
      setFields({
        lastName: recordData?.last_name as string,
        firstName: recordData?.first_name as string,
        surname: recordData?.surname === null ? '' : (recordData?.surname as string),
        type: recordData?.type === Object.keys(RECORD_TYPE)[0] ? RECORD_TYPE.for_long_time : RECORD_TYPE.for_once,
        note: recordData?.note === null ? '' : (recordData?.note as string)
      })
    }
  }, [recordData])

  const handleStartDateChange = (event: { target: { value: SetStateAction<string> } }) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event: { target: { value: SetStateAction<string> } }) => {
    setEndDate(event.target.value)
  }

  const handleChange = (event: SelectChangeEvent) => {
    handleFieldChange('type', event.target.value as string)
  }

  const handleFieldChange = (field: keyof FieldsState, value: string) => {
    setFields(prevFields => ({
      ...prevFields,
      [field]: value
    }))
  }

  const fieldsCheck = () => {
    let hasEmptyField = false

    for (const [key, value] of Object.entries(fields)) {
      if (key !== 'note' && key !== 'type' && value.trim() === '' && key !== 'surname') {
        hasEmptyField = true
        setError(prevError => ({
          ...prevError,
          [key]: true
        }))
      } else {
        setError(prevError => ({
          ...prevError,
          [key]: false
        }))
      }
    }
    return hasEmptyField
  }

  const handleSubmit = async () => {
    setShowLoader(true)
    const hasEmptyField = await fieldsCheck()

    setHasValidation(true)

    try {
      if (!hasEmptyField && id && fields.type) {
        let mutationResponse
        if (isEditFlag) {
          mutationResponse = await updateHumanRecordMutation({
            recordId: id,
            recordData: {
              car_number: '',
              car_brand: '',
              car_model: '',
              object: '',
              type: fields.type === RECORD_TYPE.for_once ? 'for_once' : 'for_long_time',
              first_name: fields.firstName,
              surname: fields.surname,
              last_name: fields.lastName,
              from_date: startDate,
              to_date: endDate,
              note: fields.note
            }
          })
          if (!updateHumanRecordError) {
            navigate(-1)
          }
        } else {
          mutationResponse = await createHumanRecordMutation({
            recordId: id,
            recordData: {
              first_name: fields.firstName,
              surname: fields.surname,
              last_name: fields.lastName,
              type: fields.type === RECORD_TYPE.for_once ? 'for_once' : 'for_long_time',
              from_date: startDate,
              to_date: endDate,
              note: fields.note
            }
          })
          if (
            !createHumanRecordError &&
            'data' in mutationResponse &&
            mutationResponse.data &&
            mutationResponse.data.id
          ) {
            if (isCreateFlag) {
              dispatch(setIdsOfCreatedAdmissions(mutationResponse.data.id))
              navigate(`/admissions/${admissionId}`, {
                state: { create: true }
              })
            } else {
              dispatch(setIdsOfCreatedAdmissions(mutationResponse.data.id))
              navigate(-1)
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setShowLoader(false)
    }
  }

  return (
    <>
      <TextField
        label={RECORD_FIELDS.last_name}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={hasValidation && error.lastName}
        helperText={!fields.lastName ? 'Это поле обязательно.' : ' '}
        value={fields.lastName}
        onChange={e => handleFieldChange('lastName', e.target.value)}
      />
      <TextField
        label={RECORD_FIELDS.first_name}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={hasValidation && error.firstName}
        helperText={!fields.firstName ? 'Это поле обязательно.' : ' '}
        value={fields.firstName}
        onChange={e => handleFieldChange('firstName', e.target.value)}
      />
      <TextField
        label={RECORD_FIELDS.surname}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        error={hasValidation && error.surname}
        value={fields.surname}
        onChange={e => handleFieldChange('surname', e.target.value)}
      />
      <FormControl sx={{ m: 1, width: '85%' }} focused required>
        <InputLabel id="demo-multiple-checkbox-label">{RECORD_FIELDS.type}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={fields.type}
          onChange={handleChange}
          input={<OutlinedInput label={RECORD_FIELDS.type} />}
        >
          <MenuItem value={RECORD_TYPE.for_once}>{RECORD_TYPE.for_once}</MenuItem>
          <MenuItem value={RECORD_TYPE.for_long_time}>{RECORD_TYPE.for_long_time}</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ m: 1, display: 'flex', justifyContent: 'space-between', width: '85%' }}>
        <TextField
          label="с"
          type="date"
          focused
          required={fields.type !== RECORD_TYPE.for_once}
          value={fields.type === RECORD_TYPE.for_once ? endDate : startDate}
          disabled={fields.type === RECORD_TYPE.for_once}
          error={fields.type === RECORD_TYPE.for_long_time && startDate === ''}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            min: new Date().toISOString().split('T')[0]
          }}
          sx={{ width: '48%' }}
        />
        <TextField
          label="по"
          type="date"
          focused
          required
          value={endDate === '' ? setEndDate(new Date().toISOString().split('T')[0]) : endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            min: new Date().toISOString().split('T')[0]
          }}
          sx={{ width: '48%' }}
        />
      </Box>
      <TextField
        label={RECORD_FIELDS.note}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        value={fields.note}
        multiline
        rows={3}
        onChange={e => handleFieldChange('note', e.target.value)}
      />
      <CustomDefaultButton
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={createHumanRecordLoading || showLoader}
      >
        {createHumanRecordLoading || showLoader ? <CircularProgress size={20} color="inherit" /> : 'Сохранить'}
      </CustomDefaultButton>
    </>
  )
}
