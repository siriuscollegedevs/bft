import * as React from 'react'
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
import { useEffect } from 'react'

export const DynamicHeader = () => {
  const [activeButton, setActiveButton] = React.useState('')
  const [role, setRole] = React.useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const name = 'Иванов'

  //TODO
  const roles = {
    admin: 'Администратор',
    manager: 'Руководитель',
    sb: 'Сотрудник СБ',
    security: 'Сотрудник охраны'
  }

  useEffect(() => {
    setRole(roles.manager)
  }, [])

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
    <Box sx={{ flexGrow: 1 }}>
      <CustomAppBar position="static">
        <CustomToolbar>
          <HeaderLogo color="inherit" disableRipple onClick={() => navigate('/navigation')}>
            <LogoIcon />
          </HeaderLogo>
          <CustomTypography>{`Доступ.${role}`}</CustomTypography>
          <Box sx={{ flexGrow: 1 }} />
          {role === roles.manager && (
            <>
              <CustomButton isActive={activeButton === 'directories'} onClick={() => handleButtonClick('directories')}>
                Справочники
              </CustomButton>
              <CustomButton isActive={activeButton === 'admissions'} onClick={() => handleButtonClick('admissions')}>
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
          <CustomTypography>{`${name} ${name[0]}.${name[0]}.`}</CustomTypography>
          <CustomExitButton color="inherit" variant="contained" onClick={() => navigate('/')}>
            Выход
          </CustomExitButton>
        </CustomToolbar>
      </CustomAppBar>
    </Box>
  )
}

//TODO сделать адекватный выход(когда будет api)
