import { useDispatch, useSelector } from 'react-redux'
import { clearAccount } from '../../__data__/states/account'
import { AuthState, clearAuth } from '../../__data__/states/auth'
import { useLogoutMutation } from '../../__data__/service/auth.api'
// import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../../utils/cookie-parser'

export const useLogout = (navigate: (path: string) => void) => {
  const intervalId = useSelector((state: { auth: AuthState }) => state.auth.intervalId)
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const [logoutMutation] = useLogoutMutation()

  const logout = () => {
    try {
      clearInterval(intervalId)
      logoutMutation()
      deleteCookie('csrftoken')
      dispatch(clearAccount())
      dispatch(clearAuth())
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return logout
}
