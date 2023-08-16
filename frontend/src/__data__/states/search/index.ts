import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from '../../../types/api';

export type SearchState = {
    searchFilter: string
}

const initialState: SearchState = {
    searchFilter: ''
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchField: (state, action: PayloadAction<string>) => {
            state.searchFilter = action.payload
        }
    }
})

export const { setSearchField } = searchSlice.actions
export const searchReducer = searchSlice.reducer

export const selectSearch = (state: RootState) => state.search

