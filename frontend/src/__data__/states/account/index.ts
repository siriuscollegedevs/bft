import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Account, Objects, RootState } from '../../../types/api'

export type CurrentAccountId = {
  id: string
}

const initialAccountState: Account = {
  role: '',
  first_name: '',
  surname: '',
  last_name: '',
  username: ''
}

const initialState: CurrentAccountId & Account & { accountObjects: Objects[] } = {
  id: '',
  ...initialAccountState,
  accountObjects: []
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
    setAccountObjects: (state, action: PayloadAction<Objects[]>) => {
      return { ...state, accountObjects: action.payload }
    },
    clearAccount: () => {
      return { id: '', ...initialAccountState, accountObjects: [] }
    }
  }
})

export const { setAccountId, setAccountData, setAccountObjects, clearAccount } = accountSlice.actions
export const accountReducer = accountSlice.reducer
export const selectAccount = (state: RootState) => state.currentAccount
