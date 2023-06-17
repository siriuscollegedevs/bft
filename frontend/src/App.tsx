import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './components/login'
import { ThemeProvider } from '@mui/material'
import Classic from './styles/theme'

function App() {
  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
