import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { accountReducer } from '../states/account'
import { authReducer } from '../states/auth'
import { filterReducer } from '../states/filters'
import { searchReducer } from '../states/search';

export const accountPersistConfig = {
  key: 'currentAccount',
  storage
}

export const authPersistConfig = {
  key: 'auth',
  storage
}

export const filterPersistConfig = {
  key: 'filters',
  storage
}

export const searchPersistConfig = {
  key: 'search',
  storage
}
export const persistedAccountReducer = persistReducer(accountPersistConfig, accountReducer)
export const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
export const persistedFilterReducer = persistReducer(filterPersistConfig, filterReducer)
export const persistedSearchReducer = persistReducer(searchPersistConfig, searchReducer)
