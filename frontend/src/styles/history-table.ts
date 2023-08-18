import TableCell from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

export const StyledTableCell = styled(TableCell)(({ color }) => ({
  backgroundColor: color
}))

export const getRowColor = (action: string): string => {
  if (action === 'modified') {
    return '#fff7001c'
  } else if (action === 'canceled') {
    return '#df00001f'
  } else if (action === 'closed') {
    return 'rgba(255, 155, 3, 0.19)'
  } else if (action === 'created') {
    return '#00800029'
  } else if (action === 'deleted') {
    return 'rgba(255,1,1,0.15)'
  }
  return 'inherit'
}
