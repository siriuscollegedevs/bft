import { createApi } from '@reduxjs/toolkit/query/react'
import { Status, Human, Car, AdmissionsHistory } from '../../types/api'
import { baseQuery } from '../utils'

export const apiRecord = createApi({
  reducerPath: 'apiRecord',
  baseQuery,
  endpoints: builder => ({
    changeRecordStatusById: builder.mutation<void, { recordId: string; recordStatus: Status }>({
      query: ({ recordId, recordStatus }) => ({
        url: `/record/change_status/${recordId}`,
        method: 'PUT',
        body: {
          status: recordStatus.status
        }
      })
    }),
    deleteRecordById: builder.mutation<void, string>({
      query: (recordId: string) => ({
        url: `/record/${recordId}`,
        method: 'DELETE'
      })
    }),
    getRecordHistoryById: builder.query<AdmissionsHistory[], string>({
      query: (recordId: string) => `/record/history/${recordId}`
    }),
    updateHumanRecordById: builder.mutation<void, { recordId: string; recordData: Human }>({
      query: ({ recordId, recordData }) => ({
        url: `/record/human/${recordId}`,
        method: 'PUT',
        body: {
          first_name: recordData.first_name,
          surname: recordData.surname,
          last_name: recordData.last_name,
          type: recordData.type,
          from_date: recordData.from_date,
          to_date: recordData.to_date,
          note: recordData.note
        }
      })
    }),
    createHumanRecord: builder.mutation<void, { recordId: string; recordData: Human }>({
      query: ({ recordId, recordData }) => ({
        url: `/request/record/human/${recordId}`,
        method: 'POST',
        body: {
          type: recordData.type,
          first_name: recordData.first_name,
          surname: recordData.surname,
          last_name: recordData.last_name,
          from_date: recordData.from_date,
          to_date: recordData.to_date,
          note: recordData.note
        }
      })
    }),
    updateCarRecordById: builder.mutation<void, { recordId: string; recordData: Car }>({
      query: ({ recordId, recordData }) => ({
        url: `/record/car/${recordId}`,
        method: 'PUT',
        body: {
          type: recordData.type,
          car_number: recordData.car_number,
          car_brand: recordData.car_brand,
          car_model: recordData.car_model,
          from_date: recordData.from_date,
          to_date: recordData.to_date,
          note: recordData.note
        }
      })
    }),
    createCarRecord: builder.mutation<void, { recordId: string; recordData: Car }>({
      query: ({ recordId, recordData }) => ({
        url: `/record/car/${recordId}`,
        method: 'POST',
        body: {
          type: recordData.type,
          car_number: recordData.car_number,
          car_brand: recordData.car_brand,
          car_model: recordData.car_model,
          from_date: recordData.from_date,
          to_date: recordData.to_date,
          note: recordData.note
        }
      })
    })
  })
})

export const {
  useChangeRecordStatusByIdMutation,
  useDeleteRecordByIdMutation,
  useGetRecordHistoryByIdQuery,
  useUpdateHumanRecordByIdMutation,
  useCreateHumanRecordMutation,
  useUpdateCarRecordByIdMutation,
  useCreateCarRecordMutation
} = apiRecord
