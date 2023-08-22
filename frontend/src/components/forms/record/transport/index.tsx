import {
  SelectChangeEvent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  CircularProgress
} from '@mui/material'
import { Box } from '@mui/system'
import { useState, SetStateAction } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { RECORD_TYPE, RECORD_FIELDS } from '../../../../__data__/consts/record'
import { CustomDefaultButton } from '../../../../styles/settings'
import { useCreateCarRecordMutation } from '../../../../__data__/service/record.api'
import { useDispatch, useSelector } from 'react-redux'
import {
  AdmissionTechnical,
  setIdsOfCreatedAdmissions,
  setIsCreateFlag
} from '../../../../__data__/states/admission-technical'

type FieldsState = {
  car_number: string
  car_brand: string
  car_model: string
  type: string
  note: string
}

export const Transport = () => {
  const [error, setError] = useState<{ car_number: boolean; car_brand: boolean; car_model: boolean }>({
    car_number: false,
    car_brand: false,
    car_model: false
  })
  const [hasValidation, setHasValidation] = useState(false)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [showLoader, setShowLoader] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const isCreateFlag = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.isCreateFlag
  )
  const admissionId = location.state?.id
  const [
    createTransportRecordMutation,
    { isLoading: createTransportRecordLoading, isError: createTransportRecordError }
  ] = useCreateCarRecordMutation()
  const [fields, setFields] = useState<FieldsState>({
    car_number: '',
    car_brand: '',
    car_model: '',
    type: RECORD_TYPE.for_once,
    note: ''
  })

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
      if (key !== 'note' && key !== 'type' && value.trim() === '') {
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
        const mutationResponse = await createTransportRecordMutation({
          recordId: id,
          recordData: {
            car_brand: fields.car_brand,
            car_model: fields.car_model,
            car_number: fields.car_number,
            type: fields.type === RECORD_TYPE.for_once ? 'for_once' : 'for_long_time',
            from_date: startDate,
            to_date: endDate,
            note: fields.note
          }
        })
        if (
          !createTransportRecordError &&
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
    } catch (error) {
      console.log(error)
    } finally {
      setShowLoader(false)
    }
  }

  return (
    <>
      <TextField
        label={RECORD_FIELDS.car_number}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={hasValidation && error.car_number}
        helperText={!fields.car_number ? 'Это поле обязательно.' : ' '}
        value={fields.car_number}
        onChange={e => handleFieldChange('car_number', e.target.value)}
      />
      <TextField
        label={RECORD_FIELDS.car_brand}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={hasValidation && error.car_brand}
        helperText={!fields.car_brand ? 'Это поле обязательно.' : ' '}
        value={fields.car_brand}
        onChange={e => handleFieldChange('car_brand', e.target.value)}
      />
      <TextField
        label={RECORD_FIELDS.car_model}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={hasValidation && error.car_model}
        helperText={!fields.car_model ? 'Это поле обязательно.' : ' '}
        value={fields.car_model}
        onChange={e => handleFieldChange('car_model', e.target.value)}
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
        disabled={createTransportRecordLoading || showLoader}
      >
        {createTransportRecordLoading || showLoader ? <CircularProgress size={20} color="inherit" /> : 'Сохранить'}
      </CustomDefaultButton>
    </>
  )
}
