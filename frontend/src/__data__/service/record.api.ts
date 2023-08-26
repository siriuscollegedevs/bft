import { createApi } from '@reduxjs/toolkit/query/react'
import { Status, Human, Car, AdmissionsHistory, AdmissionRecord, UpdateRecord } from '../../types/api'
import { baseQuery } from '../utils'

export const apiRecord = createApi({
  reducerPath: 'apiRecord',
  baseQuery,
  endpoints: builder => ({
    changeRecordStatusById: builder.mutation<void, { recordId: string; recordStatus: Status }>({
      query: ({ recordId, recordStatus }) => ({
        url: `/request/record/change_status/${recordId}`,
        method: 'PUT',
        body: {
          status: recordStatus.status,
          reason: recordStatus.reason
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
      query: recordId => `/request/record/history/${recordId}`
    }),
    updateHumanRecordById: builder.mutation<void, { recordId: string; recordData: UpdateRecord }>({
      query: ({ recordId, recordData }) => ({
        url: `/request/record/${recordId}`,
        method: 'PUT',
        body: {
          car_number: recordData.car_number,
          car_brand: recordData.car_brand,
          car_model: recordData.car_model,
          object: recordData.object,
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
    createHumanRecord: builder.mutation<{ id: string }, { recordId: string; recordData: Human }>({
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
    createCarRecord: builder.mutation<{ id: string }, { recordId: string; recordData: Car }>({
      query: ({ recordId, recordData }) => ({
        url: `/request/record/car/${recordId}`,
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
    }),
    deleteMultipleRecords: builder.mutation<void, string[]>({
      query: recordIds => ({
        url: '/request/records',
        method: 'DELETE',
        body: {
          ids: recordIds
        }
      })
    }),
    getRecordById: builder.query<AdmissionRecord, string>({
      query: recordId => `/request/record/${recordId}`
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
  useCreateCarRecordMutation,
  useDeleteMultipleRecordsMutation,
  useGetRecordByIdQuery
} = apiRecord
