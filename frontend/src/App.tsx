import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import Classic from './styles/theme'
import Login from './components/login'
import Main from './components/main/index'


function App() {
  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/access" element={<Main />} />
        </Routes>
      </BrowserRouter></ThemeProvider>
    </>
  )
}

export default App
