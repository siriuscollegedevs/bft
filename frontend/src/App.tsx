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
import { useRefreshabilityCheck } from './hooks/refreshability-check'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AuthState } from './__data__/states/auth'
import { AccountsHistory } from './pages/history/accounts'
import { ObjectsHistory } from './pages/history/objects'
import { AdmissionsHistory } from './pages/history/admissions'
import { AdmissionCreate } from './pages/admission-ce/create'

export const App: React.FC = (): JSX.Element => {
  const intervalId = useSelector((state: { auth: AuthState }) => state.auth.intervalId)
  const refreshabilityCheck = useRefreshabilityCheck()

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

  useEffect(() => {
    refreshabilityCheck()

    return () => {
      clearInterval(intervalId)
    }
  })

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
            <Route path="/directories/accounts/create" element={<FormEditDirectories />} />
            <Route path="/directories/objects/create" element={<FormEditDirectories />} />
            <Route path="/directories/employees/create" element={<FormEditDirectories />} />
            <Route path="/directories/accounts/:id" element={<FormEditDirectories />} />
            <Route path="/directories/objects/:id" element={<FormEditDirectories />} />
            <Route path="/directories/employees/:id" element={<FormEditDirectories />} />

            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/objects/archive" element={<ObjectsPage />} />
            <Route path="/objects/create" element={<FormEditDirectories />} />
            <Route path="/objects/:id" element={<FormEditDirectories />} />
            <Route path="/objects/history/:id" element={<ObjectsHistory />} />

            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/admissions/archive" element={<AdmissionsPage />} />
            <Route path="/admissions/create" element={<AdmissionCreate />} />
            <Route path="/admissions/view/:id" element={<AdmissionViewPage />} />
            <Route path="/admissions/:id/record/create" element={<FormEditDirectories />} />
            <Route path="/admissions/history/:id" element={<AdmissionsHistory />} />

            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/archive" element={<EmployeesPage />} />

            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/archive" element={<AccountsPage />} />
            <Route path="/accounts/history/:id" element={<AccountsHistory />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
