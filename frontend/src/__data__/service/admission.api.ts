import { createApi } from '@reduxjs/toolkit/query/react'
import { Admissions, AdmissionsHistory, CreateAdmission, SearchOfAdmissions } from '../../types/api'
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
        providesTags: ['regularAdmissions'],
        credentials: 'include'
      })
    }),
    getAllArchiveAdmissions: builder.mutation<Admissions[], string[]>({
      query: objectsIds => ({
        url: '/request/archive',
        method: 'POST',
        body: {
          ids: objectsIds
        },
        providesTags: ['archiveAdmissions'],
        credentials: 'include'
      })
    }),
    createAdmissions: builder.mutation<CreateAdmission, string[]>({
      query: objectsIds => ({
        url: '/request/create',
        method: 'POST',
        body: { object_ids: objectsIds }
      })
    }),
    updateAdmissionStatus: builder.mutation<
      void,
      {
        admissionId: string
        admissionData: { status: string; reason: string }
      }
    >({
      query: ({ admissionId, admissionData }) => ({
        url: `/request/change_status/${admissionId}`,
        method: 'PUT',
        body: {
          status: admissionData.status,
          reason: admissionData.reason
        }
      })
    }),
    getAdmissionsHistoryById: builder.query<AdmissionsHistory[], string>({
      query: admissionsId => `/request/records/archive/${admissionsId}`
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
    admissionsSearch: builder.mutation<SearchOfAdmissions[], SearchOfAdmissions>({
      query: admissionsData => ({
        url: '/request/expand_search',
        method: 'POST',
        body: {
          car_number: admissionsData.car_number,
          car_brand: admissionsData.car_brand,
          car_model: admissionsData.car_model,
          objects: admissionsData.objects,
          type: admissionsData.type,
          first_name: admissionsData.first_name,
          surname: admissionsData.surname,
          last_name: admissionsData.last_name,
          from_date: admissionsData.from_date,
          to_date: admissionsData.to_date,
          note: admissionsData.note
        }
      })
    }),
    admissionsArchiveSearch: builder.mutation<SearchOfAdmissions[], SearchOfAdmissions>({
      query: admissionsData => ({
        url: '/request/expand_search/archive',
        method: 'POST',
        body: {
          car_number: admissionsData.car_number,
          car_brand: admissionsData.car_brand,
          car_model: admissionsData.car_model,
          objects: admissionsData.objects,
          type: admissionsData.type,
          first_name: admissionsData.first_name,
          surname: admissionsData.surname,
          last_name: admissionsData.last_name,
          from_date: admissionsData.from_date,
          to_date: admissionsData.to_date,
          note: admissionsData.note
        }
      })
    }),
    getAdmissionById: builder.query<Admissions, string>({
      query: admissionId => `/request/information/${admissionId}`
    }),
    createAdmissionVieExcel: builder.mutation<{ request_id: string }, FormData>({
      query: file => ({
        url: '/request/excel',
        method: 'POST',
        body: file
      })
    })
  })
})

export const {
  useGetAllAdmissionsMutation,
  useGetAllArchiveAdmissionsMutation,
  useCreateAdmissionsMutation,
  useUpdateAdmissionStatusMutation,
  useGetAdmissionsHistoryByIdQuery,
  useGetRecordOfAdmissionsQuery,
  useDeleteAdmissionsByIdMutation,
  useAdmissionsSearchMutation,
  useAdmissionsArchiveSearchMutation,
  useGetAdmissionByIdQuery,
  useCreateAdmissionVieExcelMutation
} = apiAdmissions
