import { FormAccount } from './account'
import { Container, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { CustomFormControl } from '../../styles/settings'
import { CustomTypography } from '../../styles/header'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { FormObject } from './object'
import { FormEmployee } from './employee'
import { useLocation, useParams } from 'react-router-dom'
import { FormRecord } from './record'
import { useGetRecordByIdQuery } from './../../__data__/service/record.api'

export const FormEditDirectories = () => {
  const location = useLocation()

  const { id } = useParams<string>()
  const { data: recordData } = useGetRecordByIdQuery(id ?? '')
  const [gender, setGender] = useState('Человек')

  useEffect(() => {
    if (location.state?.edit) {
      if (recordData?.first_name === null) {
        setGender('Транспорт')
      } else {
        setGender('Человек')
      }
    }
  }, [recordData])

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string)
  }

  const objectUrl = '/objects'
  const accountUrl = '/accounts'
  const employeeUrl = '/employees'
  const recordUrl = '/admissions'

  return (
    <>
      <Box sx={{ display: 'flex', mt: '16px', mr: '21px' }}>
        {location.pathname.startsWith(recordUrl) && (
          <>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              onChange={handleChange}
              sx={{ marginLeft: 'auto', height: '20%' }}
              disabled={location.state?.edit}
            >
              <MenuItem value={'Человек'}>Человек</MenuItem>
              <MenuItem value={'Транспорт'}>Транспорт</MenuItem>
            </Select>
          </>
        )}
      </Box>
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
        <CustomFormControl color="primary">
          <CustomTypography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
            {location.pathname.startsWith(accountUrl) && 'Учетная запись'}
            {location.pathname.startsWith(objectUrl) && 'Объект Фонда'}
            {location.pathname.startsWith(employeeUrl) && 'Закрепление сотрудника за объектами Фонда'}
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
            {location.pathname.startsWith(accountUrl) && <FormAccount />}
            {location.pathname.startsWith(objectUrl) && <FormObject />}
            {location.pathname.startsWith(employeeUrl) && <FormEmployee />}
            {location.pathname.startsWith(recordUrl) && <FormRecord gender={gender} />}
          </Box>
        </CustomFormControl>
      </Container>
    </>
  )
}
