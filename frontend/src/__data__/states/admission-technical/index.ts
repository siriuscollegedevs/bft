import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../types/api'

export type AdmissionTechnical = {
  showObjectsSelector: boolean
  idsOfCreatedAdmissions: string[]
  isCreateFlag: boolean
}

const initialState = {
  showObjectsSelector: true,
  idsOfCreatedAdmissions: [''],
  isCreateFlag: false
}

const admissionTechnical = createSlice({
  name: 'admissionTechnical',
  initialState,
  reducers: {
    setShowObjectsSelector: (state, action: PayloadAction<boolean>) => {
      return { ...state, showObjectsSelector: action.payload }
    },
    setIdsOfCreatedAdmissions: (state, action: PayloadAction<string>) => {
      if (state.idsOfCreatedAdmissions[0] === '') {
        state.idsOfCreatedAdmissions[0] = action.payload
      } else {
        state.idsOfCreatedAdmissions.push(action.payload)
      }
    },
    setIsCreateFlag: (state, action: PayloadAction<boolean>) => {
      return { ...state, isCreateFlag: action.payload }
    },
    clearAdmissionTechnical: () => {
      return initialState
    }
  }
})

export const { setShowObjectsSelector, setIdsOfCreatedAdmissions, setIsCreateFlag, clearAdmissionTechnical } =
  admissionTechnical.actions
export const admissionTechnicalReducer = admissionTechnical.reducer
export const selectAdmissionTechnical = (state: RootState) => state.admissionTechnical
