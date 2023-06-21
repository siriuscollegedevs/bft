import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseAPI = 'https://test.com'

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { useLoginMutation } = apiAuth
