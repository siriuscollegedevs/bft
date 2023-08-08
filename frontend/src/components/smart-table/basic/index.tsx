import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { ButtonNames, ShortcutButtons } from '../../shortcut-buttons'
import { Box } from '@mui/material'
import { Size } from '..'
import { Objects, Admissions } from '../../../types/api'
import { useGetAllAdmissionsMutation } from '../../../__data__/service/admission.api'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export type CurrentURL = '/objects' | '/admissions'

type URL = {
  currentURL: CurrentURL
}

export const Basic = ({ currentURL, buttonNames, size }: URL & ButtonNames & { size: Size }) => {
  const objectsURL = currentURL === '/objects'
  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const idArray: string[] = currentAccountObjects.map(object => object.id)
  const [admissionsMutation, { data }] = useGetAllAdmissionsMutation()
  const [hasData, setHasData] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (idArray.length > 0 && !hasData) {
      admissionsMutation(idArray)
      setHasData(true)
    }
  }, [idArray, hasData])
  console.log(data)

  const dateParser = (row: Admissions) => {
    const date = new Date(row.timestamp)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return <>{`${day}.${month}.${year}`}</>
  }

  return (
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="simple table">
        <TableBody>
          {data?.map((row: Objects | Admissions) => (
            <TableRow
              key={'name' in row ? row.name : row.code}
              onClick={() => (objectsURL ? null : navigate(`/admissions/view/${row.id}`))}
              style={{ cursor: 'pointer' }}
            >
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
                    {'timestamp' in row ? dateParser(row) : ''}
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
