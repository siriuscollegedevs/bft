import { useDispatch, useSelector } from 'react-redux'
import { clearAccount } from '../../__data__/states/account'
import { AuthState, clearAuth } from '../../__data__/states/auth'
import { useLogoutMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { clearAdmissionTechnical } from '../../__data__/states/admission-technical'
import { clearDocumentTitle } from '../../utils/document-title'
import { clearTechnical } from '../../__data__/states/technical'

export const useLogout = () => {
  const intervalIds = useSelector((state: { auth: AuthState }) => state.auth.intervalId)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutMutation] = useLogoutMutation()

  const logout = () => {
    try {
      intervalIds.forEach(intervalId => {
        clearInterval(intervalId)
      })
      logoutMutation()
      dispatch(clearAccount())
      dispatch(clearAuth())
      dispatch(clearAdmissionTechnical())
      dispatch(clearTechnical())
      navigate('/')
      clearDocumentTitle()
    } catch (error) {
      console.log(error)
    }
  }

  return logout
}
