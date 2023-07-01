import { FormAccount } from './form-account'
import { Container } from '@mui/material'
import { CustomFormControl } from '../../styles/settings'
import { CustomTypography } from '../../styles/header'
import Box from '@mui/material/Box'
import * as React from 'react'
import { FormObject } from './form-object'
import { FormEmployee } from './form-employee'
import { useLocation, useParams } from 'react-router-dom'

export const FormEditDirectories = () => {
  const location = useLocation()
  const { id } = useParams()

  const objectUrl = `/objects/${id}`
  const accountUrl = `/accounts/${id}`
  const employeeUrl = `/employees/${id}`

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
        <CustomFormControl color="primary">
          <CustomTypography variant="h6" sx={{ color: 'black' }}>
            {location.pathname === accountUrl && 'Учетная запись'}
            {location.pathname === objectUrl && 'Объект Фонда'}
            {location.pathname === employeeUrl && 'Закрепление сотрудника за объектами Фонда'}
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
          </Box>
        </CustomFormControl>
      </Container>
    </>
  )
}
