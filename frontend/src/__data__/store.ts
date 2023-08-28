import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiAuth } from './service/auth.api'
import { apiAccount } from './service/account.api'
import { apiObject } from './service/object.api'
import { apiAdmissions } from './service/admission.api'
import { apiRecord } from './service/record.api'
import { apiObjectsAccounts } from './service/object-account'
import { persistStore } from 'redux-persist'
import {
  persistedAccountReducer,
  persistedAuthReducer,
  persistedFilterReducer,
  persistedSearchReducer,
  persistedadmissionTechnicalReducer
} from './redux-persist'

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  currentAccount: persistedAccountReducer,
  filters: persistedFilterReducer,
  search: persistedSearchReducer,
  admissionTechnical: persistedadmissionTechnicalReducer,
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

export const persistor = persistStore(store)
setupListeners(store.dispatch)
