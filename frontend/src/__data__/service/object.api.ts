import { createApi } from '@reduxjs/toolkit/query/react'
import { ObjectHistory, Objects, soloObject } from '../../types/api'
import { baseQuery } from '../utils'

export const apiObject = createApi({
  reducerPath: 'apiObject',
  baseQuery,
  endpoints: builder => ({
    getAllObjects: builder.query<Objects[], void>({
      query: () => '/objects/all'
    }),
    getAllArchiveObjects: builder.query<Objects[], void>({
      query: () => '/objects/all/archive'
    }),
    createObject: builder.mutation<void, soloObject>({
      query: (objectData: soloObject) => ({
        url: '/object',
        method: 'POST',
        body: {
          name: objectData.name
        }
      })
    }),
    getObjectById: builder.query<{ name: string }, string>({
      query: (objectId: string) => `/object/${objectId}`
    }),
    updateObjectById: builder.mutation<void, { objectId: string; objectData: soloObject }>({
      query: ({ objectId, objectData }) => ({
        url: `/object/${objectId}`,
        method: 'PUT',
        body: {
          name: objectData.name
        }
      })
    }),
    deleteObjectById: builder.mutation<void, string>({
      query: objectId => ({
        url: `/object/${objectId}`,
        method: 'DELETE'
      })
    }),
    getObjectHistoryById: builder.query<ObjectHistory[], string>({
      query: objectId => `/object/history/${objectId}`
    })
  })
})

export const {
  useGetAllObjectsQuery,
  useGetAllArchiveObjectsQuery,
  useCreateObjectMutation,
  useGetObjectByIdQuery,
  useUpdateObjectByIdMutation,
  useDeleteObjectByIdMutation,
  useGetObjectHistoryByIdQuery
} = apiObject
