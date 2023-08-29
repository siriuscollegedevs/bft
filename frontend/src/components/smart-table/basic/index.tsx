import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { ButtonNames, ShortcutButtons } from '../../shortcut-buttons'
import { Box } from '@mui/material'
import { Size } from '..'
import { Objects, Admissions } from '../../../types/api'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { dateParser } from '../../../utils/date-parser'
import { CustomCell } from '../../../styles/table'

export type CurrentURL = '/objects' | '/admissions' | '/objects/archive'

type URL = {
  currentURL: CurrentURL
}

export const Basic = ({ currentURL, buttonNames, size, data }: URL & ButtonNames & { size: Size } & any) => {
  const objectsURL = currentURL === '/objects'
  const objectsArchiveURL = currentURL === '/objects/archive'
  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const navigate = useNavigate()

  const getObjectNamesFromIds = (objectIds: string[]): (string | undefined)[] => {
    return objectIds
      .map(id => currentAccountObjects.find(obj => obj.id === id))
      .filter(obj => obj)
      .map(obj => obj?.name)
  }

  return (
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="simple table" size="small">
        <TableBody>
          {data && (
            <>
              {data?.map((row: Objects | Admissions) => (
                <TableRow key={'name' in row ? row.name : row.code}>
                  {objectsURL || objectsArchiveURL ? (
                    <>
                      <CustomCell align="left" sx={{ width: '200px' }}>
                        {'name' in row ? row.name : ''}
                      </CustomCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <ShortcutButtons buttonNames={buttonNames} id={row.id} />
                        </Box>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <CustomCell
                        onClick={() => navigate(`/admissions/view/${row.id}`)}
                        style={{ cursor: 'pointer' }}
                        align="left"
                        sx={{ width: '15%' }}
                      >
                        {'timestamp' in row ? dateParser(row.timestamp) : ''}
                      </CustomCell>
                      <CustomCell
                        onClick={() => navigate(`/admissions/view/${row.id}`)}
                        style={{ cursor: 'pointer' }}
                        align="left"
                        sx={{ width: '15%' }}
                      >
                        {'code' in row ? `#${row.code}` : ''}
                      </CustomCell>
                      <CustomCell
                        onClick={() => navigate(`/admissions/view/${row.id}`)}
                        style={{ cursor: 'pointer' }}
                        align="left"
                        sx={{ width: '100%' }}
                      >
                        {'object_ids' in row ? getObjectNamesFromIds(row.object_ids).join(', ') : ''}
                      </CustomCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <ShortcutButtons buttonNames={buttonNames} id={row.id} />
                        </Box>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
