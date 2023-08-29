import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/system'
import { Fab } from '@mui/material'

export const HeaderLogo = styled(IconButton)`
  height: 100%;
  width: 50px;
`

export const CustomAppBar = styled(AppBar)`
  background: #49547d;
`

export const CustomToolbar = styled(Toolbar)`
  height: 70px;
`

export const CustomTypography = styled(Typography)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: #ffffff;
`

export const CustomButton = styled(Button)<{ isActive: boolean }>`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  text-transform: capitalize;

  ${({ isActive }) =>
    isActive &&
    `
  &:hover {
    background-color: white;
  }
    background-color: white;
    color: #000000;
  `}
`

export const CustomExitButton = styled(Button)`
  background: #ffffff;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: #000000;
  width: 100px;
  height: 40px;
  margin-left: 15px;
  text-transform: capitalize;
`

export const CustomSettingsButton = styled(Fab)`
  background-color: white;
  width: 40px;
  height: 40px;
  margin-right: 15px;
`
