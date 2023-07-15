import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Accounts,
  Account,
  AccountHistory,
  ExpandSearchAdmissionsBody,
  ChangePasswordData,
  RootState
} from '../../types/api'
import { config } from '../config'

const baseQuery = fetchBaseQuery({
  baseUrl: config.baseAPI,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export const apiAccount = createApi({
  reducerPath: 'apiAccount',
  baseQuery,
  endpoints: builder => ({
    getAllAccounts: builder.query<Accounts[], void>({
      query: () => '/accounts'
    }),
    getAllArchiveAccounts: builder.query<Accounts[], void>({
      query: () => '/accounts/archive'
    }),
    createAccount: builder.mutation<void, Account>({
      query: (accountData: Account) => ({
        url: '/account',
        method: 'POST',
        body: {
          role: accountData.role,
          first_name: accountData.first_name,
          surname: accountData.surname,
          last_name: accountData.last_name,
          username: accountData.username,
          password: accountData.password
        }
      })
    }),
    getAccountById: builder.query<Account, string>({
      query: accountId => `/account/${accountId}`
    }),
    updateAccountById: builder.mutation<void, { accountId: string; accountData: Account }>({
      query: ({ accountId, accountData }) => ({
        url: `/account/${accountId}`,
        method: 'PUT',
        body: {
          role: accountData.role,
          first_name: accountData.first_name,
          surname: accountData.surname,
          last_name: accountData.last_name,
          username: accountData.username,
          password: accountData.password
        }
      })
    }),
    deleteAccountById: builder.mutation<void, string>({
      query: accountId => ({
        url: `/account/${accountId}`,
        method: 'DELETE'
      })
    }),
    getAccountHistoryById: builder.query<AccountHistory[], string>({
      query: accountId => `/account/history/${accountId}`
    }),
    accountSearch: builder.mutation<Accounts[], ExpandSearchAdmissionsBody>({
      query: accountData => ({
        url: '/account/expand_search',
        method: 'POST',
        body: {
          role: accountData?.role,
          first_name: accountData?.first_name,
          surname: accountData?.surname,
          last_name: accountData?.last_name,
          username: accountData?.username
        }
      })
    }),
    changeAccountPassword: builder.mutation<void, { accountId: string; admissionsBody: ChangePasswordData }>({
      query: ({ accountId, admissionsBody }) => ({
        url: `/account/change_pswd/${accountId}`,
        method: 'POST',
        body: {
          status: admissionsBody.status,
          current_password: admissionsBody.current_password,
          new_password: admissionsBody.new_password
        }
      })
    })
  })
})

export const {
  useGetAllAccountsQuery,
  useGetAllArchiveAccountsQuery,
  useCreateAccountMutation,
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
  useDeleteAccountByIdMutation,
  useGetAccountHistoryByIdQuery,
  useAccountSearchMutation,
  useChangeAccountPasswordMutation
} = apiAccount
