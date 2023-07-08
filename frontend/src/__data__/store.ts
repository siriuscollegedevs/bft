import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiAuth } from './service/auth.api'
import { apiAccount } from './service/account.api'
import { apiObject } from './service/object.api'
import { apiRequest } from './service/request.api'
import { apiRecord } from './service/record.api'

const rootReducer = combineReducers({
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiAccount.reducerPath]: apiAccount.reducer,
  [apiObject.reducerPath]: apiObject.reducer,
  [apiRequest.reducerPath]: apiRequest.reducer,
  [apiRecord.reducerPath]: apiRecord.reducer
})

const apiMiddleware = [
  apiAuth.middleware,
  apiAccount.middleware,
  apiObject.middleware,
  apiRequest.middleware,
  apiRecord.middleware
]

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiMiddleware)
})

setupListeners(store.dispatch)
