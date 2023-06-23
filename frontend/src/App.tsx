import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { Classic } from './styles/theme'
import { Login } from './components/login'
import { Main } from './components/main'
import { ShortcutButtons } from './components/shortcut-buttons'

export function App() {
  return (
    <>
      <ThemeProvider theme={Classic}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/access" element={<Main />} />
            <Route path="/test" element={<ShortcutButtons buttonNames={['edit', 'history', 'trash']} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}
