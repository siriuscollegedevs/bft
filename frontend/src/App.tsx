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
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, clearAuth } from './__data__/states/auth'
import { AccountAdvancedSearch } from './pages/search/account'
import { EmployeeAdvancedSearch } from './pages/search/employee'
import { AdmissionsAdvancedSearch } from './pages/search/admissions'
import { AccountsHistory } from './pages/history/accounts'
import { ObjectsHistory } from './pages/history/objects'
import { AdmissionsHistory } from './pages/history/admissions'
import { AdmissionCreate } from './pages/admission-ce/create'
import { AdmissionViewEdit } from './pages/admission-ce/edit'
import { CurrentAccountId } from './__data__/states/account'
import { Account, Objects } from './types/api'
import { ACCOUNT_ROLES } from './__data__/consts/account-roles'
import { ResponseSnackBar } from './components/response-snackbar'

export const App: React.FC = (): JSX.Element => {
  const intervalIds = useSelector((state: { auth: AuthState }) => state.auth.intervalId)
  const refreshabilityCheck = useRefreshabilityCheck()
  const dispatch = useDispatch()

  function Header() {
    const location = useLocation()
    const accountRole = useSelector(
      (state: { currentAccount: CurrentAccountId & Account & { accountObjects: Objects[] } }) =>
        state.currentAccount.role
    )
    const isLoginRoute = location.pathname === '/'
    const isAccessRoute = location.pathname === '/navigation'
    const isDirectories = location.pathname === '/directories'
    const isAdmissions = location.pathname === '/admissions'
    const isDirectoriesForAdmin = isDirectories && accountRole === ACCOUNT_ROLES.administrator.en
    const isAdmissionsForSec = isAdmissions && accountRole === ACCOUNT_ROLES.security_officer.en
    const showBackButton = !isLoginRoute && !isAccessRoute && !isDirectoriesForAdmin && !isAdmissionsForSec

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
      intervalIds.forEach(intervalId => {
        clearInterval(intervalId)
      })
      dispatch(clearAuth())
    }
  }, [])

  useEffect(() => {
    refreshabilityCheck()
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

            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/objects/archive" element={<ObjectsPage />} />
            <Route path="/objects/create" element={<FormEditDirectories />} />
            <Route path="/objects/:id" element={<FormEditDirectories />} />
            <Route path="/objects/history/:id" element={<ObjectsHistory />} />

            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/admissions/archive" element={<AdmissionsPage />} />
            <Route path="/admissions/create" element={<AdmissionCreate />} />
            <Route path="/admissions/:id" element={<AdmissionViewEdit />} />
            <Route path="/admissions/view/:id" element={<AdmissionViewPage />} />
            <Route path="/admissions/:id/record/create" element={<FormEditDirectories />} />
            <Route path="/admissions/:id/record/edit" element={<FormEditDirectories />} />
            <Route path="/admissions/history/:id" element={<AdmissionsHistory />} />
            <Route path="/admissions/search" element={<AdmissionsAdvancedSearch />} />

            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<FormEditDirectories />} />
            <Route path="/employees/create" element={<FormEditDirectories />} />
            <Route path="/employees/archive" element={<EmployeesPage />} />
            <Route path="/employees/search" element={<EmployeeAdvancedSearch />} />

            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/:id" element={<FormEditDirectories />} />
            <Route path="/accounts/create" element={<FormEditDirectories />} />
            <Route path="/accounts/archive" element={<AccountsPage />} />
            <Route path="/accounts/history/:id" element={<AccountsHistory />} />
            <Route path="/accounts/search" element={<AccountAdvancedSearch />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
