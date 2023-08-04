import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from './config'
import { RootState } from '../types/api'

export const baseQuery = fetchBaseQuery({
  baseUrl: config.baseAPI,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access
    const csrf = (getState() as RootState).auth.csrf

    if (token && csrf) {
      headers.set('Authorization', `Bearer ${token}`)
      headers.set('X-CSRFToken', csrf as string)
    }

    return headers
  }
})
