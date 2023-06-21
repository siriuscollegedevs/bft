import { AppBar, Box, Toolbar } from '@mui/material'
import { ReactComponent as LogoIcon } from '../../../assets/sirius-logo.svg'

export const StaticHeader = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#49547D', justifyContent: 'center', height: 70 }}>
          <LogoIcon style={{ height: '100%', width: '55px' }} />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
