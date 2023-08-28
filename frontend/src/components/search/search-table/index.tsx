import React from 'react'
import { Box, Typography } from '@mui/material'
import { SmartTable } from '../../smart-table'
import { ButtonName } from '../../shortcut-buttons'
import CircularProgress from '@mui/material/CircularProgress'

type SearchTableProps = {
  showTable: boolean
  checked: string
  tableData?: any
  tableArchiveData?: any
  buttonNames: ButtonName[]
  isLoading: boolean
  isLoadingArchive: boolean
}

export const SearchTableContent: React.FC<SearchTableProps> = ({
  showTable,
  checked,
  tableData,
  tableArchiveData,
  buttonNames,
  isLoading,
  isLoadingArchive
}) => {
  if (!showTable) {
    return null
  }

  if (isLoading || isLoadingArchive) {
    return <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
  }

  if ((checked === 'archive' ? tableArchiveData : tableData) && (checked === 'archive' ? tableArchiveData.length > 0 : tableData.length > 0)) {
    return (
      <Box sx={{ width: '100%' }}>
        <SmartTable
          buttonNames={buttonNames}
          size={{
            width: '100%',
            height: '100%'
          }}
          data={checked === 'archive' ? tableArchiveData : tableData}
        />
      </Box>
    )
  } else {
    return (
      <Box>
        <Typography>Ничего не найдено, проверьте введенные данные.</Typography>
      </Box>
    )
  }
}
