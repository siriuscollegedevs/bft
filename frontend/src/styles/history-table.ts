import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

export const StyledTableCell = styled(TableCell)(({ color }) => ({
  backgroundColor: color
}))

export const getRowColor = (action: string): string => {
  if (action === 'edit') {
    return '#fff7001c'
  } else if (action === 'cancel') {
    return '#df00001f'
  } else if (action === 'toRepay') {
    return '#00800029'
  }
  return 'inherit'
}
