import { createApi } from '@reduxjs/toolkit/query/react'
import { Admissions, AdmissionsHistory, SearchOfAdmissions } from '../../types/api'
import { baseQuery } from '../utils'

export const apiAdmissions = createApi({
  reducerPath: 'apiAdmissions',
  baseQuery,
  tagTypes: ['admissions'],
  endpoints: builder => ({
    getAllAdmissions: builder.mutation<Admissions[], string[]>({
      query: objectsIds => ({
        url: '/request/requests',
        method: 'POST',
        body: {
          ids: objectsIds
        },
        providesTags: ['admissions'],
        credentials: 'include'
      })
    }),
    getAllArchiveAdmissions: builder.query<Admissions[], void>({
      query: () => '/request/archive'
    }),
    createAdmissions: builder.mutation<Admissions, void>({
      query: () => ({
        url: '/request',
        method: 'POST'
      })
    }),
    getAdmissionsHistoryById: builder.query<AdmissionsHistory[], string>({
      query: admissionsId => `/request/history/${admissionsId}`
    }),
    getRecordOfAdmissions: builder.query<AdmissionsHistory[], string>({
      query: admissionsId => `/request/${admissionsId}`
    }),
    deleteAdmissionsById: builder.mutation<void, string>({
      query: admissionsId => ({
        url: `/request/${admissionsId}`,
        method: 'DELETE'
      })
    }),
    admissionsSearch: builder.mutation<Admissions[], SearchOfAdmissions>({
      query: admissionsData => ({
        url: '/request/expand_search',
        method: 'POST',
        body: {
          car_number: admissionsData.car_number,
          car_brand: admissionsData.car_brand,
          car_model: admissionsData.car_model,
          object: admissionsData.object,
          type: admissionsData.type,
          first_name: admissionsData.first_name,
          surname: admissionsData.surname,
          last_name: admissionsData.last_name,
          from_date: admissionsData.from_date,
          to_date: admissionsData.to_date,
          note: admissionsData.note
        }
      })
    })
  })
})

export const {
  useGetAllAdmissionsMutation,
  useGetAllArchiveAdmissionsQuery,
  useCreateAdmissionsMutation,
  useGetAdmissionsHistoryByIdQuery,
  useGetRecordOfAdmissionsQuery,
  useDeleteAdmissionsByIdMutation,
  useAdmissionsSearchMutation
} = apiAdmissions
