import { useRefreshMutation } from '../../__data__/service/auth.api'

export const useRefreshToken = () => {
  const [refreshTokenMutation] = useRefreshMutation()

  const refresh = async () => {
    try {
      const response = await refreshTokenMutation()
      if ('data' in response) {
        return response.data.access
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      return 'error'
    }
  }

  return refresh
}
