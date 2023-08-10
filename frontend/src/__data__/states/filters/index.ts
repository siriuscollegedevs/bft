import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FiltersState = {
  objectNameFilter: string[]
}

const initialState: FiltersState = {
  objectNameFilter: []
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setObjectNamesFilter: (state, action: PayloadAction<string[]>) => {
      state.objectNameFilter = action.payload
    }
  }
})

export const { setObjectNamesFilter } = filtersSlice.actions
export const filterReducer = filtersSlice.reducer
