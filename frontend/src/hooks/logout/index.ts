import { useDispatch } from 'react-redux'
import { clearAccount } from '../../states/account'
import { clearAuth } from '../../states/auth'
import { useLogoutMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../../utils/cookie-parser'

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutMutation] = useLogoutMutation()

  const logout = () => {
    try {
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
