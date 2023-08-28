import { useDispatch, useSelector } from 'react-redux'
import { clearAccount } from '../../__data__/states/account'
import { AuthState, clearAuth } from '../../__data__/states/auth'
import { useLogoutMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../../utils/cookie-parser'
import { clearAdmissionTechnical } from '../../__data__/states/admission-technical'
import { clearDocumentTitle } from '../../utils/document-title'

export const useLogout = () => {
  const intervalId = useSelector((state: { auth: AuthState }) => state.auth.intervalId)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutMutation] = useLogoutMutation()

  const logout = () => {
    try {
      clearInterval(intervalId)
      logoutMutation()
      dispatch(clearAccount())
      dispatch(clearAuth())
      dispatch(clearAdmissionTechnical())
      navigate('/')
      clearDocumentTitle()
    } catch (error) {
      console.log(error)
    }
  }

  return logout
}
