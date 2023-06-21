import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiAuth } from './service/api'

export const store = configureStore({
  reducer: {
    [apiAuth.reducerPath]: apiAuth.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiAuth.middleware)
})

setupListeners(store.dispatch)
