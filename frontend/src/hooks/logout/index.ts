import { useDispatch } from 'react-redux'
import { clearAccount } from '../../states/account'
import { clearAuth } from '../../states/auth'
import { useLogoutMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()

  try {
    dispatch(clearAccount())
    dispatch(clearAuth())
    logout()
    navigate('/')
    return true
  } catch (error) {
    console.log('error')
    return false
  }
}
