import * as React from 'react'
import Box from '@mui/material/Box'
import { CustomButton } from '../../styles/button-group'
import { Container } from '@mui/material'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'
import { useNavigate } from 'react-router-dom'
import { BackButton } from '../button-back'
import { DynamicHeader } from '../header/dynamic'

export const MainDirectories = () => {
  const navigate = useNavigate()
  return (
    <>
      <DynamicHeader />
      <BackButton />
      <Container
        sx={{
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '55%',
          gap: '15px',
          '& > *': {
            mt: 25
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <CustomButton variant="outlined" onClick={() => navigate('/accounts')}>
            Список учетных записей
            <ArrowIcon />
          </CustomButton>
          <CustomButton variant="outlined" onClick={() => navigate('/objects')}>
            Список объектов Фонда
            <ArrowIcon />
          </CustomButton>
          <CustomButton variant="outlined" onClick={() => navigate('/employees')}>
            Справочник закрепления сотрудников за объектами Фонда
            <ArrowIcon />
          </CustomButton>
        </Box>
      </Container>
    </>
  )
}
