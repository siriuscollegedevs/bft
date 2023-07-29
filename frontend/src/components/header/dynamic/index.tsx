import Box from '@mui/material/Box'
import { ReactComponent as LogoIcon } from '../../../assets/sirius-logo.svg'
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg'
import {
  HeaderLogo,
  CustomAppBar,
  CustomButton,
  CustomTypography,
  CustomToolbar,
  CustomSettingsButton,
  CustomExitButton
} from '../../../styles/header'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetAccountByIdQuery } from '../../../__data__/service/account.api'
import { useDispatch, useSelector } from 'react-redux'
import { CurrentAccountId, setAccountData } from '../../../states/account'
import React, { useEffect } from 'react'
import { Typography } from '@mui/material'
import { ACCOUNT_ROLES } from '../../../consts/account-roles'

export const DynamicHeader = () => {
  const [activeButton, setActiveButton] = React.useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const currentAccountId = useSelector((state: { currentAccount: CurrentAccountId }) => state.currentAccount.id)

  const {
    data: currentAccountData,
    isLoading: currentAccountLoading,
    isError: currentAccountError
  } = useGetAccountByIdQuery(currentAccountId)

  if (currentAccountData) {
    dispatch(setAccountData(currentAccountData))
  }

  useEffect(() => {
    const currentPath = location.pathname
    const directoriesPaths = ['directories', 'accounts', 'objects', 'employees']
    const admissionsPath = 'admissions'

    if (directoriesPaths.some(path => currentPath.includes(path))) {
      setActiveButton('directories')
    } else if (currentPath.includes(admissionsPath)) {
      setActiveButton('admissions')
    } else {
      setActiveButton('')
    }
  }, [location.pathname])

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName)
    navigate(`/${buttonName}`)
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <CustomAppBar position="static">
          <CustomToolbar>
            {currentAccountLoading && <Typography>Loading</Typography>}
            {currentAccountError && <Typography>Error</Typography>}
            {currentAccountData && (
              <>
                <HeaderLogo color="inherit" disableRipple onClick={() => navigate('/navigation')}>
                  <LogoIcon />
                </HeaderLogo>
                <CustomTypography>{`Доступ.${
                  currentAccountData?.role !== null ? ACCOUNT_ROLES[currentAccountData?.role] : 'Error'
                }`}</CustomTypography>
                <Box sx={{ flexGrow: 1 }} />
                {currentAccountData?.role === ACCOUNT_ROLES.manager && (
                  <>
                    <CustomButton
                      isActive={activeButton === 'directories'}
                      onClick={() => handleButtonClick('directories')}
                    >
                      Справочники
                    </CustomButton>
                    <CustomButton
                      isActive={activeButton === 'admissions'}
                      onClick={() => handleButtonClick('admissions')}
                    >
                      Заявки
                    </CustomButton>
                  </>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <CustomSettingsButton
                  aria-label="setting"
                  color="inherit"
                  disableRipple
                  onClick={() => navigate('/settings')}
                >
                  <SettingsIcon />
                </CustomSettingsButton>
                {currentAccountData?.last_name !== null && currentAccountData?.surname !== null ? (
                  <CustomTypography>{`${currentAccountData?.first_name} ${currentAccountData?.last_name[0]}.${currentAccountData?.surname[0]}.`}</CustomTypography>
                ) : (
                  <CustomTypography>{`${currentAccountData?.first_name}`}</CustomTypography>
                )}
                <CustomExitButton color="inherit" variant="contained" onClick={() => navigate('/')}>
                  Выход
                </CustomExitButton>
              </>
            )}
          </CustomToolbar>
        </CustomAppBar>
      </Box>
    </>
  )
}

//TODO сделать адекватный выход(когда будет api)
