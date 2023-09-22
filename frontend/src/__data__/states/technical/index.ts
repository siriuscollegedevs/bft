import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type TechnicalState = {
  previousPage: string
  startPage: string
  needUpdate: boolean
  showSnackBar: boolean
  requestStatus: 'success' | 'error' | ''
}

const initialState: TechnicalState = {
  previousPage: '/',
  startPage: '/',
  needUpdate: false,
  showSnackBar: false,
  requestStatus: ''
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
    setShowSnackBar: (state, action: PayloadAction<boolean>) => {
      state.showSnackBar = action.payload
    },
    setRequestStatus: (state, action: PayloadAction<'success' | 'error' | ''>) => {
      state.requestStatus = action.payload
    },
    clearTechnical: () => {
      return { ...initialState }
    }
  }
})

export const { setPreviousPage, setStartPage, setNeedUpdate, setShowSnackBar, setRequestStatus, clearTechnical } =
  technicalSlice.actions
export const technicalReducer = technicalSlice.reducer

export const selectTechnical = (state: RootState) => state.technical
