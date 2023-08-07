import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from './config'
import { RootState } from '../types/api'
import { useSelector } from 'react-redux'
import { AuthState } from '../states/auth'

export const baseQuery = fetchBaseQuery({
  baseUrl: config.baseAPI,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access
    const csrf = (getState() as RootState).auth.csrf

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
      headers.set('X-CSRFToken', csrf as string)
    }

    return headers
  }
})

export const refreshAccessToken = async (refresh: () => Promise<any>) => {
  console.log(typeof refresh)
  await refresh()
  const accessTokenUpdateInterval = useSelector((state: { auth: AuthState }) => state.auth.accessTokenUpdateInterval)
  // setTimeout(refreshAccessToken, accessTokenUpdateInterval * 1000)
  setTimeout(refreshAccessToken, 20)
}
