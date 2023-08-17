import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type AuthState = {
  access: string
  accessTokenUpdateInterval: number
  csrf: string
}

const initialState: AuthState = {
  access: '',
  accessTokenUpdateInterval: 0,
  csrf: ''
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
    clearAuth: () => {
      return { ...initialState }
    }
  }
})

export const { setAccessToken, setTimeAccessToken, setCSRFToken, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer
export const selectAuth = (state: RootState) => state.auth
