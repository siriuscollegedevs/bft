import Box from '@mui/material/Box'
import { CustomButton, CustomListItem } from '../../styles/button-group'
import { Container, List, ListItemText } from '@mui/material'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'
import { useNavigate } from 'react-router-dom'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import { useSelector, useDispatch } from 'react-redux'
import { Account } from '../../types/api'
import { useGetAccountToObjectsQuery } from '../../__data__/service/object-account'
import { CurrentAccountId, setAccountObjects } from '../../states/account'
import { useEffect } from 'react'

export const ButtonGroup = () => {
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const currentAccountId = useSelector((state: { currentAccount: CurrentAccountId }) => state.currentAccount.id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    data: currentAccountObjectsData,
    isLoading: currentAccountObjectsLoading,
    isError: currentAccountObjectsError
  } = useGetAccountToObjectsQuery(currentAccountId)

  if (currentAccountObjectsData) {
    dispatch(setAccountObjects(currentAccountObjectsData))
  }

  useEffect(() => {
    switch (currentAccountRole) {
      case Object.keys(ACCOUNT_ROLES)[0]: {
        navigate('/directories')
        break
      }
      case Object.keys(ACCOUNT_ROLES)[3]: {
        navigate('/admissions')
      }
    }
  }, [currentAccountRole])

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
        {currentAccountRole === Object.keys(ACCOUNT_ROLES)[1] && (
          <>
            <CustomButton variant="outlined" onClick={() => navigate('/directories')}>
              Справочники
              <ArrowIcon />
            </CustomButton>
            <CustomButton variant="outlined" onClick={() => navigate('/admissions')}>
              Заявки
              <ArrowIcon />
            </CustomButton>
          </>
        )}
        {currentAccountRole === Object.keys(ACCOUNT_ROLES)[2] && (
          <>
            <CustomButton variant="outlined" onClick={() => navigate('/admissions')}>
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
                {currentAccountObjectsLoading && <>Loading...</>}
                {currentAccountObjectsError && <>Error</>}
                {currentAccountObjectsData && (
                  <>
                    {currentAccountObjectsData?.map(object => (
                      <CustomListItem key={object.id}>
                        <ListItemText primary={object.name} />
                      </CustomListItem>
                    ))}
                  </>
                )}
              </List>
            </CustomButton>
          </>
        )}
      </Box>
    </Container>
  )
}
