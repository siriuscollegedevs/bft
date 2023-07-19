import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from './config'
import { RootState } from '../types/api'

export const baseQuery = fetchBaseQuery({
  baseUrl: config.baseAPI,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})
