import { useSelector } from 'react-redux'
import { AuthState } from '../../__data__/states/auth'

export const useRefreshabilityCheck = () => {
  const updateProcess = useSelector((state: { auth: AuthState }) => state.auth.updateProcess)

  const refreshabilityCheck = () => {
    try {
      // if (!updateProcess) {
      //   refreshToken
      //   intervalId = setInterval(refreshToken, response.access_exp / 2)
      //   dispatch(setUpdateProcess(true))
      // }
    } catch (error) {
      console.log(error)
    }
  }

  return refreshabilityCheck
}
