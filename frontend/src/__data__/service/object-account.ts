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
    }),
    createAccountToObject: builder.mutation<void, AccountToObject>({
      query: (objectAccountData: AccountToObject) => ({
        url: '/account_to_objects',
        method: 'POST',
        body: {
          first_name: objectAccountData.first_name,
          last_name: objectAccountData.last_name,
          surname: objectAccountData.surname,
          object_ids: objectAccountData.objects.map(obj => obj.match_id)
        }
      })
    }),
    deleteAccountToObjectById: builder.mutation<void, string>({
      query: matchId => ({
        url: `/object/accounts/${matchId}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetAccountToObjectsQuery,
  useGetAllAccountToObjectQuery,
  useGetAllAccountToObjectArchiveQuery,
  useDeleteAccountToObjectByIdMutation,
  useCreateAccountToObjectMutation
} = apiObjectsAccounts
