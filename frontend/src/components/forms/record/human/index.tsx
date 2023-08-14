import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material'
import { CustomDefaultButton } from '../../../../styles/settings'
import { SetStateAction, useState } from 'react'
import { RECORD_FIELDS, RECORD_TYPE } from '../../../../__data__/consts/record'
import dayjs, { Dayjs } from 'dayjs'
import { Box } from '@mui/system'

type FieldsState = {
  lastName: string
  firstName: string
  surname: string
  type: string
  note: string
}

export const Human = () => {
  const [error, setError] = useState(false)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [fields, setFields] = useState<FieldsState>({
    lastName: '',
    firstName: '',
    surname: '',
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

  const handleSubmit = () => {
    let hasEmptyField = false
    for (const value of Object.values(fields)) {
      if (value.trim() === '') {
        hasEmptyField = true
      }
    }

    if (hasEmptyField) {
      setError(true)
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
        error={error}
        helperText={!fields.lastName && 'Это поле обязательно.'}
        value={fields.lastName}
        onChange={e => handleFieldChange('lastName', e.target.value)}
      />
      <TextField
        label={RECORD_FIELDS.first_name}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={error}
        helperText={!fields.firstName && 'Это поле обязательно.'}
        value={fields.firstName}
        onChange={e => handleFieldChange('firstName', e.target.value)}
      />
      <TextField
        label={RECORD_FIELDS.surname}
        focused
        variant="outlined"
        sx={{ m: 1, width: '85%' }}
        required
        error={error}
        helperText={!fields.surname && 'Это поле обязательно.'}
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
        error={error}
        value={fields.note}
        multiline
        rows={3}
        onChange={e => handleFieldChange('note', e.target.value)}
      />
      <CustomDefaultButton variant="contained" color="primary" onClick={handleSubmit}>
        Сохранить
      </CustomDefaultButton>
    </>
  )
}
