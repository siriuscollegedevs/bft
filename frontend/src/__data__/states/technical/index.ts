import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type TechnicalState = {
  previousPage: string
  startPage: string
  needUpdate: boolean
}

const initialState: TechnicalState = {
  previousPage: '/',
  startPage: '/',
  needUpdate: false
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
    setNeedUpdate: (state, action: PayloadAction<boolean>) => {
      state.needUpdate = action.payload
    },
    clearTechnical: () => {
      return { ...initialState }
    }
  }
})

export const { setPreviousPage, setStartPage, setNeedUpdate, clearTechnical } = technicalSlice.actions
export const technicalReducer = technicalSlice.reducer

export const selectTechnical = (state: RootState) => state.technical
