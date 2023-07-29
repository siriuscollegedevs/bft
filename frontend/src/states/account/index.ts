import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Account } from '../../types/api'

export type CurrentAccountId = {
  id: string
}

const initialAccountState: Account = {
  role: null,
  first_name: null,
  surname: null,
  last_name: null,
  username: null
}

const initialState: CurrentAccountId & Account = {
  id: '',
  ...initialAccountState
}

const accountSlice = createSlice({
  name: 'currentAccount',
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<CurrentAccountId>) => {
      return { ...state, id: action.payload.id }
    },
    setAccountData: (state, action: PayloadAction<Account>) => {
      return { ...state, ...action.payload }
    },
    clearAccount: () => {
      return { id: '', ...initialAccountState }
    }
  }
})

export const { setAccountId, setAccountData, clearAccount } = accountSlice.actions
export const accountReducer = accountSlice.reducer
