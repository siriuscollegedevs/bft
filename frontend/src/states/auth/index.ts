import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AuthState = {
  token: string | null
  csrfToken: string
}

const initialState: AuthState = {
  token: null,
  csrfToken: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
    },
    setCSRFToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload
    }
  }
})

export const { setToken, setCSRFToken } = authSlice.actions
export const authReducer = authSlice.reducer
export const selectToken = (state: AuthState) => state.token
