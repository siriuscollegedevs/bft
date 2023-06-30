import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { Classic } from './styles/theme'
import { Login } from './components/login'
import { Main } from './components/main'
import { Settings } from './components/user-settings'
import { MainDirectories } from './components/main-directories'
import { FormEditDirectories } from './components/form-edit-directories'
import { DynamicHeader } from './components/header/dynamic'
import { StaticHeader } from './components/header/static'
import { BackButton } from './components/button-back'

export function App() {
  function Header() {
    const location = useLocation()
    const isLoginRoute = location.pathname === '/login'
    const isAccessRoute = location.pathname === '/access'
    const showBackButton = !isLoginRoute && !isAccessRoute

    return (
      <>
        {showBackButton && <BackButton />}
        {isLoginRoute ? <StaticHeader /> : <DynamicHeader />}
      </>
    )
  }

  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/access" element={<Main />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/directories" element={<MainDirectories />} />
            <Route path="/accounts/:id" element={<FormEditDirectories />} />
            <Route path="/objects/:id" element={<FormEditDirectories />} />
            <Route path="/employees/:id" element={<FormEditDirectories />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
