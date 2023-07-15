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
import { accountsContext, objectsContext, admissionssContext } from './contexts/api'
import { useGetAllAccountsQuery } from './__data__/service/account.api'
import { useGetAllObjectsQuery } from './__data__/service/object.api'
import { useGetAllAdmissionssQuery } from './__data__/service/admission.api'

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

  const { data: accountData, error: accountError, isLoading: accountLoading } = useGetAllAccountsQuery()
  const { data: objectData, error: objectError, isLoading: objectLoading } = useGetAllObjectsQuery()
  const { data: admissionsData, error: admissionsError, isLoading: admissionsLoading } = useGetAllAdmissionssQuery()

  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
          <accountsContext.Provider value={{ accountData, accountError, accountLoading }}>
            <objectsContext.Provider value={{ objectData, objectError, objectLoading }}>
              <admissionssContext.Provider value={{ admissionsData, admissionsError, admissionsLoading }}>
                <Header />
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/navigation" element={<Main />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/directories" element={<MainDirectories />} />
                  <Route path="/accounts/:id" element={<FormEditDirectories />} />
                  <Route path="/objects/:id" element={<FormEditDirectories />} />
                  <Route path="/employees/:id" element={<FormEditDirectories />} />
                </Routes>
              </admissionssContext.Provider>
            </objectsContext.Provider>
          </accountsContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
