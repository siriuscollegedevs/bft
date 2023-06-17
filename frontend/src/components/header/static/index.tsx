import { AppBar, Box, Toolbar } from '@mui/material'
import Logo from '../../logo'

const StaticHeader = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#49547D', justifyContent: 'center', height: 70 }}>
          <Logo size={50} />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default StaticHeader
