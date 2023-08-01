import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Login } from '../../types/api'
import { config } from '../config'

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseAPI,
    credentials: 'include'
  }),
  tagTypes: ['Login'],
  endpoints: builder => ({
    login: builder.mutation<any, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { username: username, password: password },
        credentials: 'include'
      }),
      invalidatesTags: [{ type: 'Login' }],
      transformResponse: async (response, meta: any) => {
        const CSRFToken = await meta.response.headers.get('X-CSRFToken')
        console.log(CSRFToken)
        return response
      }
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
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
