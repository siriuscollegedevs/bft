import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseAPI = 'https://test.com'

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: '/login',
        method: 'POST',
        body: { username: username, password: password }
      })
    }),
    logout: builder.mutation({
      query: refreshToken => ({
        url: '/logout/blacklist',
        method: 'POST',
        body: { refresh_token: refreshToken }
      })
    }),
    refresh: builder.mutation({
      query: refreshToken => ({
        url: '/refresh',
        method: 'POST',
        body: { refresh: refreshToken }
      })
    })
  })
})

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } = apiAuth
