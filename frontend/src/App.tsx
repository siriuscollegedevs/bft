import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './components/login'
import Main from './components/main/index'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/access" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
