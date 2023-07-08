import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Login } from '../../types/api'

const baseAPI = 'https://test.com'

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI
  }),
  endpoints: builder => ({
    login: builder.mutation<Login, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: '/login',
        method: 'POST',
        body: { username: username, password: password }
      })
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: refreshToken => ({
        url: '/logout/blacklist',
        method: 'POST',
        body: { refresh_token: refreshToken }
      })
    }),
    refresh: builder.mutation<{ access: string }, { refreshToken: string }>({
      query: refreshToken => ({
        url: '/refresh',
        method: 'POST',
        body: { refresh: refreshToken }
      })
    })
  })
})

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } = apiAuth
