import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiAuth } from './service/auth.api'
import { apiAccount } from './service/account.api'
import { apiObject } from './service/object.api'
import { apiAdmissions } from './service/admission.api'
import { apiRecord } from './service/record.api'
import { authReducer } from './states/auth'
import { accountReducer } from './states/account'
import { filterReducer } from './states/filters'
import { apiObjectsAccounts } from './service/object-account'

const rootReducer = combineReducers({
  auth: authReducer,
  currentAccount: accountReducer,
  filters: filterReducer,
  [apiAuth.reducerPath]: apiAuth.reducer,
  [apiAccount.reducerPath]: apiAccount.reducer,
  [apiObject.reducerPath]: apiObject.reducer,
  [apiObjectsAccounts.reducerPath]: apiObjectsAccounts.reducer,
  [apiAdmissions.reducerPath]: apiAdmissions.reducer,
  [apiRecord.reducerPath]: apiRecord.reducer
})

const apiMiddleware = [
  apiAuth.middleware,
  apiAccount.middleware,
  apiObject.middleware,
  apiObjectsAccounts.middleware,
  apiAdmissions.middleware,
  apiRecord.middleware
]

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({}).concat(apiMiddleware)
})

setupListeners(store.dispatch)
