import { createApi } from '@reduxjs/toolkit/query/react'
import { Accounts, Account, AccountHistory, ExpandSearchAdmissionsBody, ChangePasswordData } from '../../types/api'
import { baseQuery } from '../utils'

export const apiAccount = createApi({
  reducerPath: 'apiAccount',
  baseQuery,
  endpoints: builder => ({
    getAllAccounts: builder.query<Accounts[], void>({
      query: () => '/accounts/all'
    }),
    getAllArchiveAccounts: builder.query<Accounts[], void>({
      query: () => '/accounts/all/archive'
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
    accountArchiveSearch: builder.mutation<Accounts[], ExpandSearchAdmissionsBody>({
      query: accountData => ({
        url: '/account/expand_search/archive',
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
        },
        credentials: 'include'
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
  useAccountArchiveSearchMutation,
  useChangeAccountPasswordMutation
} = apiAccount
