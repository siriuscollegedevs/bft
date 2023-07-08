import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Requests, RequestHistory, SearchOfRequest } from '../../types/api'

const baseAPI = 'https://test.com'

export const apiRequest = createApi({
  reducerPath: 'apiRequest',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI
  }),
  endpoints: builder => ({
    getAllRequests: builder.query<Requests[], void>({
      query: () => '/requests'
    }),
    getAllArchiveRequests: builder.query<Requests[], void>({
      query: () => '/requests/archive'
    }),
    createRequest: builder.mutation<Requests, void>({
      query: () => ({
        url: '/request',
        method: 'POST'
      })
    }),
    getRequestHistoryById: builder.query<RequestHistory[], string>({
      query: requestId => `/request/history/${requestId}`
    }),
    getRecordOfRequest: builder.query<RequestHistory[], string>({
      query: requestId => `/request/${requestId}`
    }),
    deleteRequestById: builder.mutation<void, string>({
      query: requestId => ({
        url: `/request/${requestId}`,
        method: 'DELETE'
      })
    }),
    requestSearch: builder.mutation<Requests[], SearchOfRequest>({
      query: requestData => ({
        url: '/request/expand_search',
        method: 'POST',
        body: {
          car_number: requestData.car_number,
          car_brand: requestData.car_brand,
          car_model: requestData.car_model,
          object: requestData.object,
          type: requestData.type,
          first_name: requestData.first_name,
          surname: requestData.surname,
          last_name: requestData.last_name,
          from_date: requestData.from_date,
          to_date: requestData.to_date,
          note: requestData.note
        }
      })
    })
  })
})

export const {
  useGetAllRequestsQuery,
  useGetAllArchiveRequestsQuery,
  useCreateRequestMutation,
  useGetRequestHistoryByIdQuery,
  useGetRecordOfRequestQuery,
  useDeleteRequestByIdMutation,
  useRequestSearchMutation
} = apiRequest