import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseAPI = 'https://test.com'

type Accounts = {
  id: string
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
}

type Account = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
  password: string
}

type ExpandSearchRequestBody = {
  role?: string
  first_name?: string
  surname?: string
  last_name?: string
  username?: string
}

type ChangePasswordData = {
  status: string
  current_password: string
  new_password: string
}

type AccountHistory = {
  role: string
  first_name: string
  surname: string
  last_name: string
  username: string
  timestamp: string
  action: string
  modified_by: string
}

export const apiAccount = createApi({
  reducerPath: 'apiAccount',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI
  }),
  endpoints: builder => ({
    getAllAccounts: builder.query<Accounts[], void>({
      query: () => '/accounts'
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
    accountSearch: builder.mutation<Accounts[], ExpandSearchRequestBody>({
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
    changeAccountPassword: builder.mutation<void, { accountId: string; requestBody: ChangePasswordData }>({
      query: ({ accountId, requestBody }) => ({
        url: `/account/change_pswd/${accountId}`,
        method: 'POST',
        body: {
          status: requestBody.status,
          current_password: requestBody.current_password,
          new_password: requestBody.new_password
        }
      })
    })
  })
})

export const {
  useGetAllAccountsQuery,
  useCreateAccountMutation,
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
  useDeleteAccountByIdMutation,
  useGetAccountHistoryByIdQuery,
  useAccountSearchMutation,
  useChangeAccountPasswordMutation
} = apiAccount
