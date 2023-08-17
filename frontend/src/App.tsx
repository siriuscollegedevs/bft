import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { Classic } from './styles/theme'
import { Login } from './pages/login'
import { Main } from './pages/main'
import { ObjectsPage } from './pages/objects'
import { Settings } from './pages/settings'
import { MainDirectories } from './components/main-directories'
import { FormEditDirectories } from './components/forms'
import { DynamicHeader } from './components/header/dynamic'
import { StaticHeader } from './components/header/static'
import { BackButton } from './components/button-back'
import { EmployeesPage } from './pages/employees'
import { AccountsPage } from './pages/accounts'
import { AdmissionsPage } from './pages/admissions'
import { AdmissionViewPage } from './pages/admission-view'

export const App: React.FC = (): JSX.Element => {
  function Header() {
    const location = useLocation()
    const isLoginRoute = location.pathname === '/'
    const isAccessRoute = location.pathname === '/navigation'
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
            <Route path="/" element={<Login />} />
            <Route path="/navigation" element={<Main />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/directories" element={<MainDirectories />} />
            <Route path="/accounts/create" element={<FormEditDirectories />} />
            <Route path="/objects/create" element={<FormEditDirectories />} />
            <Route path="/employees/create" element={<FormEditDirectories />} />
            <Route path="/accounts/:id" element={<FormEditDirectories />} />
            <Route path="/objects/:id" element={<FormEditDirectories />} />
            <Route path="/employees/:id" element={<FormEditDirectories />} />
            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/objects/archive" element={<ObjectsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/admissions/view/:id" element={<AdmissionViewPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/archive" element={<EmployeesPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/archive" element={<AccountsPage />} />
            <Route path="/admissions/:id/entries/create" element={<FormEditDirectories />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
