import * as React from 'react'
import Box from '@mui/material/Box'
import { CustomButton, CustomListItem } from '../../../styles/button-group'
import { Container, List, ListItemText } from '@mui/material'
import { ReactComponent as ArrowIcon } from '../../../assets/arrow.svg'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const ButtonGroup = () => {
  //TODO
  const roles = {
    manager: 'manager',
    sb: 'sb'
  }

  const availableObjects = [
    { id: 1, name: 'Наименование 1' },
    { id: 2, name: 'Наименование 2' },
    { id: 3, name: 'Наименование 3' },
    { id: 4, name: 'Наименование 4' },
    { id: 5, name: 'Наименование 5' }
  ]

  const [role, setRole] = React.useState('')
  const navigate = useNavigate()
  useEffect(() => {
    // Fetch
    setRole(roles.manager)
  }, [])

  return (
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
        {role === roles.manager && (
          <>
            <CustomButton variant="outlined" onClick={() => navigate('/directories')}>
              Справочники
              <ArrowIcon />
            </CustomButton>
            <CustomButton variant="outlined">
              Заявки
              <ArrowIcon />
            </CustomButton>
          </>
        )}
        {role === roles.sb && (
          <>
            <CustomButton variant="outlined">
              Заявки
              <ArrowIcon />
            </CustomButton>
            <CustomButton
              variant="outlined"
              disabled
              sx={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'baseline' }}
            >
              Доступные объекты
              <List component="div">
                {availableObjects.map(object => (
                  <CustomListItem key={object.id}>
                    <ListItemText primary={object.name} />
                  </CustomListItem>
                ))}
              </List>
            </CustomButton>
          </>
        )}
      </Box>
    </Container>
  )
}
