import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { Classic } from './styles/theme'
import { Login } from './components/login'
import { Main } from './components/main'
import { Settings } from './components/user-settings'
import { MainDirectories } from './components/main-directories'
import { FormEditDirectories } from './components/form-edit-directories'

export function App() {
  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
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
