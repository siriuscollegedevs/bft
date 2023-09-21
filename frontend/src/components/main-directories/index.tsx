import * as React from 'react'
import Box from '@mui/material/Box'
import { CustomButton } from '../../styles/button-group'
import { Container } from '@mui/material'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPreviousPage } from '../../__data__/states/technical'

export const MainDirectories = () => {
  const dispatch = useDispatch()
  dispatch(setPreviousPage('/navigation'))
  const navigate = useNavigate()
  return (
    <>
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
