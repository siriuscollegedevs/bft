import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type AuthState = {
  access: string
  accessTokenUpdateInterval: number
  csrf: string
  updateProcess: boolean
}

const initialState: AuthState = {
  access: '',
  accessTokenUpdateInterval: 0,
  csrf: '',
  updateProcess: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      return { ...state, access: action.payload }
    },
    setTimeAccessToken: (state, action: PayloadAction<number>) => {
      return { ...state, accessTokenUpdateInterval: action.payload }
    },
    setCSRFToken: (state, action: PayloadAction<string>) => {
      return { ...state, csrf: action.payload }
    },
    setUpdateProcess: (state, action: PayloadAction<boolean>) => {
      return { ...state, updateProcess: action.payload }
    },
    clearAuth: () => {
      return { ...initialState }
    }
  }
})

export const { setAccessToken, setTimeAccessToken, setCSRFToken, setUpdateProcess, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer
export const selectAuth = (state: RootState) => state.auth
