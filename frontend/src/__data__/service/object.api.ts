import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseAPI = 'https://test.com'

type Objects = {
  id: string
  name: string
}

type soloObject = {
  name: string
}

type ObjectHistory = {
  name: string
  version: number
  timestamp: string
  action: string
  modified_by: string
}

export const apiObject = createApi({
  reducerPath: 'apiObject',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI
  }),
  endpoints: builder => ({
    getAllObjects: builder.query<Objects[], void>({
      query: () => '/objects'
    }),
    getAllArchiveObjects: builder.query<Objects[], void>({
      query: () => '/objects/archive'
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
      query: objectId => `/account/history/${objectId}`
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
