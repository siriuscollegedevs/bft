import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { Classic } from './styles/theme'
import { Login } from './components/login'
import { Main } from './components/main'
import { Table } from './components/table'

export function App() {
  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/access" element={<Main />} />
            <Route path="/test" element={<Table />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
