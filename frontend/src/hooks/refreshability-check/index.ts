import { useDispatch, useSelector } from 'react-redux'
import { AuthState, setAccessToken, setIntervalId, setUpdateProcess } from '../../__data__/states/auth'
import { useRefreshToken } from '../refresh-token'

export const useRefreshabilityCheck = () => {
  const updateProcess = useSelector((state: { auth: AuthState }) => state.auth.updateProcess)
  const accessTokenUpdateInterval = useSelector((state: { auth: AuthState }) => state.auth.accessTokenUpdateInterval)
  const refresh = useRefreshToken()
  const dispatch = useDispatch()

  const refreshabilityCheck = async () => {
    try {
      if (!updateProcess && accessTokenUpdateInterval !== 0) {
        const refreshAndDispatch = async () => {
          const newToken = await refresh()
          if (newToken) {
            dispatch(setAccessToken(newToken))
          }
        }

        await refreshAndDispatch()
        const intervalId = setInterval(refreshAndDispatch, accessTokenUpdateInterval / 2)
        dispatch(setIntervalId(intervalId))
        dispatch(setUpdateProcess(true))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return refreshabilityCheck
}
