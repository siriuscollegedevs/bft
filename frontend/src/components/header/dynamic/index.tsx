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
import { useNavigate } from 'react-router-dom'

export const DynamicHeader = () => {
  const [activeButton, setActiveButton] = React.useState('')
  const name = 'Руководитель'
  const navigate = useNavigate()

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CustomAppBar position="static">
        <CustomToolbar>
          <HeaderLogo color="inherit" disableRipple onClick={() => navigate('/access')}>
            <LogoIcon />
          </HeaderLogo>
          <CustomTypography>{`Доступ.${name}`}</CustomTypography>
          <Box sx={{ flexGrow: 1 }} />
          <CustomButton isActive={activeButton === 'directories'} onClick={() => handleButtonClick('directories')}>
            Справочники
          </CustomButton>
          <CustomButton isActive={activeButton === 'admissions'} onClick={() => handleButtonClick('admissions')}>
            Заявки
          </CustomButton>
          <Box sx={{ flexGrow: 1 }} />
          <CustomSettingsButton aria-label="setting" color="inherit" disableRipple onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </CustomSettingsButton>
          <CustomTypography>{`${name} ${name[0]}.${name[0]}.`}</CustomTypography>
          <CustomExitButton color="inherit" variant="contained">
            Выход
          </CustomExitButton>
        </CustomToolbar>
      </CustomAppBar>
    </Box>
  )
}
