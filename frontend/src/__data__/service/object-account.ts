import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../utils'
import { AccountToObject, Objects } from '../../types/api'

export const apiObjectsAccounts = createApi({
  reducerPath: 'apiObjectsAccounts',
  baseQuery,
  endpoints: builder => ({
    getAccountToObjects: builder.query<Objects[], string>({
      query: accountId => `/account_to_objects/${accountId}`
    }),
    getAllAccountToObject: builder.query<AccountToObject[], void>({
      query: () => '/account_to_objects'
    }),
    getAllAccountToObjectArchive: builder.query<AccountToObject[], void>({
      query: () => '/account_to_objects/archive'
    })
  })
})

export const { useGetAccountToObjectsQuery, useGetAllAccountToObjectQuery, useGetAllAccountToObjectArchiveQuery } =
  apiObjectsAccounts
