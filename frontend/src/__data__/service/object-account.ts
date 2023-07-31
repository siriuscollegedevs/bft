import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../utils'
import { Objects } from '../../types/api'

export const apiObjectsAccounts = createApi({
  reducerPath: 'apiObjectsAccounts',
  baseQuery,
  endpoints: builder => ({
    getAccountToObjects: builder.query<Objects[], string>({
      query: accountId => `/account_to_objects/${accountId}`
    })
  })
})

export const { useGetAccountToObjectsQuery } = apiObjectsAccounts
