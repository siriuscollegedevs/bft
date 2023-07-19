import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { ButtonNames, ShortcutButtons } from '../../shortcut-buttons'
import { Box } from '@mui/material'
import { Size } from '..'
import { Objects, Admissions } from '../../../types/api'
import { useGetAllObjectsQuery } from '../../../__data__/service/object.api'
import { useGetAllAdmissionsQuery } from '../../../__data__/service/admission.api'

export type CurrentURL = '/objects' | '/admissions'

type URL = {
  currentURL: CurrentURL
}

export const Basic = ({ currentURL, buttonNames, size }: URL & ButtonNames & { size: Size }) => {
  const objectsURL = currentURL === '/objects'

  const { data: objectData, error: objectError, isLoading: objectLoading } = useGetAllObjectsQuery()
  const { data: admissionData, error: admissionError, isLoading: admissionLoading } = useGetAllAdmissionsQuery()

  let rowsData = null
  if (objectsURL) {
    rowsData = objectData
  } else {
    rowsData = admissionData
  }

  return (
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="simple table">
        <TableBody>
          {rowsData?.map((row: Objects | Admissions) => (
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
