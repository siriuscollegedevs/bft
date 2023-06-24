import { FormAccount } from './form-account'
import { DynamicHeader } from '../header/dynamic'
import { BackButton } from '../button-back'
import { Container } from '@mui/material'
import { CustomDefaultButton, CustomFormControl } from '../../styles/settings'
import { CustomTypography } from '../../styles/header'
import Box from '@mui/material/Box'
import * as React from 'react'
import { FormObject } from './form-object'
import { FormEmployee } from './form-employee'
import { useLocation } from 'react-router-dom'

export const FormEditDirectories = () => {
  const location = useLocation()

  return (
    <>
      <DynamicHeader />
      <BackButton />
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
            {location.pathname === '/accounts' && 'Учетная запись'}
            {location.pathname === '/objects' && 'Объект Фонда'}
            {location.pathname === '/employees' && 'Закрепление сотрудника за объектами Фонда'}
          </CustomTypography>

          <Box
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '25px',
              width: '100%'
            }}
          >
            {location.pathname === '/accounts' && <FormAccount />}
            {location.pathname === '/objects' && <FormObject />}
            {location.pathname === '/employees' && <FormEmployee />}
          </Box>

          <CustomDefaultButton variant="contained" color="primary">
            Сохранить
          </CustomDefaultButton>
        </CustomFormControl>
      </Container>
    </>
  )
}
