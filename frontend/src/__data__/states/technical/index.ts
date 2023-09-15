import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type TechnicalState = {
  previousPage: string
  startPage: string
}

const initialState: TechnicalState = {
  previousPage: '/',
  startPage: '/'
}

const technicalSlice = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setPreviousPage: (state, action: PayloadAction<string>) => {
      state.previousPage = action.payload
    },
    setStartPage: (state, action: PayloadAction<string>) => {
      state.startPage = action.payload
    },
    clearTechnical: () => {
      return { ...initialState }
    }
  }
})

export const { setPreviousPage, setStartPage, clearTechnical } = technicalSlice.actions
export const technicalReducer = technicalSlice.reducer

export const selectTechnical = (state: RootState) => state.technical
