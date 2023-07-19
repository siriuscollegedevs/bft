import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiAuth } from './service/auth.api'
import { apiAccount } from './service/account.api'
import { apiObject } from './service/object.api'
import { apiAdmissions } from './service/admission.api'
import { apiRecord } from './service/record.api'
import { authReducer } from '../states/auth'

const rootReducer = combineReducers({
  auth: authReducer,
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiAccount.reducerPath]: apiAccount.reducer,
  [apiObject.reducerPath]: apiObject.reducer,
  [apiAdmissions.reducerPath]: apiAdmissions.reducer,
  [apiRecord.reducerPath]: apiRecord.reducer
})

const apiMiddleware = [
  apiAuth.middleware,
  apiAccount.middleware,
  apiObject.middleware,
  apiAdmissions.middleware,
  apiRecord.middleware
]

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiMiddleware)
})

setupListeners(store.dispatch)
