import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type TechnicalState = {
  previousPage: string
}

const initialState: TechnicalState = {
  previousPage: '/'
}

const technicalSlice = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setPreviousPage: (state, action: PayloadAction<string>) => {
      state.previousPage = action.payload
    },
    clearTechnical: () => {
      return { ...initialState }
    }
  }
})

export const { setPreviousPage, clearTechnical } = technicalSlice.actions
export const technicalReducer = technicalSlice.reducer

export const selectTechnical = (state: RootState) => state.technical
