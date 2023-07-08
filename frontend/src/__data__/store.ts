import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiAuth } from './service/auth.api'
import { apiAccount } from './service/account.api'
import { apiObject } from './service/object.api'

export const store = configureStore({
  reducer: {
    [apiAuth.reducerPath]: apiAuth.reducer,
    [apiAccount.reducerPath]: apiAccount.reducer,
    [apiObject.reducerPath]: apiObject.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiAuth.middleware).concat(apiAccount.middleware).concat(apiObject.middleware)
})

setupListeners(store.dispatch)
