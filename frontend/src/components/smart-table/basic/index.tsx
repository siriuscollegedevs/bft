import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { ButtonNames, ShortcutButtons } from '../../shortcut-buttons'
import { Box } from '@mui/material'
import { Size } from '..'
import { useContext } from 'react'
import { objectsContext } from '../../../contexts/api'
import { Objects, Admissionss } from '../../../types/api'

export type CurrentURL = '/objects' | '/admissions'

type URL = {
  currentURL: CurrentURL
}

export const Basic = ({ currentURL, buttonNames, size }: URL & ButtonNames & { size: Size }) => {
  const objectsURL = currentURL === '/objects'

  const rows = useContext(objectsContext)

  return (
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map((row: Objects | Admissionss) => (
            <TableRow key={'name' in row ? row.name : row.code}>
              {objectsURL ? (
                <>
                  <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
                    {'name' in row ? row.name : ''}
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <ShortcutButtons buttonNames={buttonNames} />
                    </Box>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
                    {'timestemp' in row ? row.timestemp : ''}
                  </TableCell>
                  <TableCell align="left" padding={'checkbox'}>
                    {'code' in row ? `#${row.code}` : ''}
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <ShortcutButtons buttonNames={buttonNames} />
                    </Box>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
