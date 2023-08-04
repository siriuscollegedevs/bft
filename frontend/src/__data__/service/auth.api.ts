import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../utils'

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery,
  endpoints: builder => ({
    login: builder.mutation<any, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { username: username, password: password },
        credentials: 'include'
      }),
      transformResponse: async (response, meta: any) => {
        const CSRFToken = meta.response.headers.get('X-CSRFToken')
        if (CSRFToken) {
          document.cookie = `csrftoken=${CSRFToken};`
        }
        return response
      }
    }),
    logout: builder.mutation<void, void>({
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
