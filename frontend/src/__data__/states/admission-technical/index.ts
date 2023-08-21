import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type AdmissionTechnical = {
  showObjectsSelector: boolean
}

const initialState = {
  showObjectsSelector: true
}

const admissionTechnical = createSlice({
  name: 'admissionTechnical',
  initialState,
  reducers: {
    setShowObjectsSelector: (state, action: PayloadAction<AdmissionTechnical>) => {
      return { ...state, showObjectsSelector: action.payload.showObjectsSelector }
    },
    clearAccount: () => {
      return initialState
    }
  }
})

export const { setShowObjectsSelector } = admissionTechnical.actions
export const admissionTechnicalReducer = admissionTechnical.reducer
export const selectAdmissionTechnical = (state: RootState) => state.admissionTechnical
