import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { accountReducer } from '../states/account'
import { authReducer } from '../states/auth'
import { filterReducer } from '../states/filters'
import { searchReducer } from '../states/search'
import { admissionTechnicalReducer } from '../states/admission-technical'

export const accountPersistConfig = {
  key: 'currentAccount',
  storage
}

export const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['updateProcess', 'intervalId']
}

export const filterPersistConfig = {
  key: 'filters',
  storage
}

export const searchPersistConfig = {
  key: 'search',
  storage
}

export const admissionTechnicalPersistConfig = {
  key: 'admissionTechnical',
  storage
}

export const persistedAccountReducer = persistReducer(accountPersistConfig, accountReducer)
export const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
export const persistedFilterReducer = persistReducer(filterPersistConfig, filterReducer)
export const persistedSearchReducer = persistReducer(searchPersistConfig, searchReducer)
export const persistedadmissionTechnicalReducer = persistReducer(
  admissionTechnicalPersistConfig,
  admissionTechnicalReducer
)
