import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AuthState = {
  access: string
  csrf: string
}

const initialState: AuthState = {
  access: '',
  csrf: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      return { ...state, access: action.payload }
    },
    setCSRFToken: (state, action: PayloadAction<string>) => {
      return { ...state, csrf: action.payload }
    },
    clearAuth: () => {
      return { ...initialState }
    }
  }
})

export const { setAccessToken, setCSRFToken, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer
export const selectToken = (state: AuthState) => state.access
