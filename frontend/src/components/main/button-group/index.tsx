import * as React from 'react'
import Box from '@mui/material/Box'
import { CustomButton, CustomListItem } from '../../../styles/button-group'
import { Container, List, ListItemText } from '@mui/material'
import { ReactComponent as ArrowIcon } from '../../../assets/arrow.svg'
import { useEffect } from 'react'

export default function GroupOrientation() {
  const availableObjects = ['Наименование 1', 'Наименование 2', 'Наименование 3', 'Наименование 4', 'Наименование 5']

  const [role, setRole] = React.useState('')

  useEffect(() => {
    // Fetch
    const userRole = 'sb'
    setRole(userRole)
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
          alignItem: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '15px'
        }}
      >
        {role === 'manager' && (
          <>
            <CustomButton variant="outlined">
              Справочники
              <ArrowIcon />
            </CustomButton>
            <CustomButton variant="outlined">
              Заявки
              <ArrowIcon />
            </CustomButton>
          </>
        )}
        {role === 'sb' && (
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
                {availableObjects.map((object, index) => (
                  <CustomListItem key={index}>
                    <ListItemText primary={object} />
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
