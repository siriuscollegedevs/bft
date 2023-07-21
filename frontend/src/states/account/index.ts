import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CurrentAccountId = {
  currentAccountId: string
}

const initialState: CurrentAccountId = {
  currentAccountId: ''
}

const accountSlice = createSlice({
  name: 'currentAccount',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<CurrentAccountId>) => {
      return action.payload
    },
    clearAccount: () => {
      return initialState
    }
  }
})

export const { setAccount, clearAccount } = accountSlice.actions
export const accountReducer = accountSlice.reducer
