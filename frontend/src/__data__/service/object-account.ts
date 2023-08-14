import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../utils'
import { Account, AccountToObject, AccountToObjectCreate, Objects } from '../../types/api'

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
    createAccountToObject: builder.mutation<void, AccountToObjectCreate>({
      query: (objectAccountData: AccountToObjectCreate) => ({
        url: '/account_to_objects',
        method: 'POST',
        body: {
          first_name: objectAccountData.first_name,
          last_name: objectAccountData.last_name,
          surname: objectAccountData.surname,
          object_ids: objectAccountData.object_ids
        }
      })
    }),
    updateAccountToObjectById: builder.mutation<void, { accountId: string; accountToObjectData: string[] }>({
      query: ({ accountId, accountToObjectData }) => ({
        url: `/account_to_objects/${accountId}`,
        method: 'PUT',
        body: {
          object_ids: accountToObjectData
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
  useCreateAccountToObjectMutation,
  useUpdateAccountToObjectByIdMutation
} = apiObjectsAccounts
