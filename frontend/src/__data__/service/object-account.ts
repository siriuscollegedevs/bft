import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../utils'
import { AccountToObject, AccountToObjectCreate, ObjectsMatch } from '../../types/api'

export const apiObjectsAccounts = createApi({
  reducerPath: 'apiObjectsAccounts',
  baseQuery,
  endpoints: builder => ({
    getAccountToObjects: builder.query<ObjectsMatch[], string>({
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
      query: accountId => ({
        url: `/account_to_objects/${accountId}`,
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
