import { FormAccount } from './account'
import { Container, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { CustomFormControl } from '../../styles/settings'
import { CustomTypography } from '../../styles/header'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { FormObject } from './object'
import { FormEmployee } from './employee'
import { useLocation, useParams } from 'react-router-dom'
import { FormRecord } from './record'

export const FormEditDirectories = () => {
  const location = useLocation()
  const { id } = useParams()
  const [gender, setGender] = useState('Человек')

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string)
  }

  const objectUrl = `/objects/${id}`
  const accountUrl = `/accounts/${id}`
  const employeeUrl = `/employees/${id}`
  const recordUrl = `/admissions/${id}/entries/create`

  return (
    <>
      <Container
        fixed
        sx={{
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          mt: '75px',
          mb: '75px'
        }}
      >
        {location.pathname === recordUrl && (
          <>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              onChange={handleChange}
              sx={{ marginLeft: 'auto', height: '20%' }}
            >
              <MenuItem value={'Человек'}>Человек</MenuItem>
              <MenuItem value={'Транспорт'}>Транспорт</MenuItem>
            </Select>
          </>
        )}
        <CustomFormControl color="primary">
          <CustomTypography variant="h6" sx={{ color: 'black' }}>
            {location.pathname === accountUrl && 'Учетная запись'}
            {location.pathname === objectUrl && 'Объект Фонда'}
            {location.pathname === employeeUrl && 'Закрепление сотрудника за объектами Фонда'}
            {location.pathname === recordUrl && 'Запись'}
          </CustomTypography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '25px',
              width: '100%',
              '& .MuiFormHelperText-root': {
                marginLeft: 0
              }
            }}
          >
            {location.pathname === accountUrl && <FormAccount />}
            {location.pathname === objectUrl && <FormObject />}
            {location.pathname === employeeUrl && <FormEmployee />}
            {location.pathname === recordUrl && <FormRecord gender={gender} />}
          </Box>
        </CustomFormControl>
      </Container>
    </>
  )
}
