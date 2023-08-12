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
import { useGetAllObjectsQuery } from '../../../__data__/service/object.api'
import { FiltersState } from '../../../__data__/states/filters'

export type CurrentURL = '/objects' | '/admissions'

type URL = {
  currentURL: CurrentURL
}

export const Basic = ({ currentURL, buttonNames, size }: URL & ButtonNames & { size: Size }) => {
  const objectsURL = currentURL === '/objects'
  const [data, setData] = useState<Objects[] | Admissions[]>()
  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const idArray: string[] = currentAccountObjects.map(object => object.id)
  const { data: objectsData } = useGetAllObjectsQuery()
  const [admissionsMutation, { data: admissionsData}] = useGetAllAdmissionsMutation()
  const [hasData, setHasData] = useState(false)
  const navigate = useNavigate()
  const filters = useSelector((state: { filters: FiltersState }) => state.filters)

  useEffect(() => {
    if (idArray.length > 0 && !hasData && !objectsURL) {
      admissionsMutation(idArray)
      setHasData(true)
    }
  }, [idArray, hasData])

  useEffect(() => {
    if (admissionsData && !objectsURL) {
      setData(admissionsData)
    } else {
      setData(objectsData)
    }
  }, [admissionsData, objectsData])

  const dateParser = (row: Admissions) => {
    const date = new Date(row.timestamp)
    return <>{`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`}</>
  }

  const filteredObjectIds = currentAccountObjects
    .filter(obj => filters.objectNameFilter.includes(obj.name))
    .map(obj => obj.id)

  const filteredData =
    filters.objectNameFilter.length > 0
      ? admissionsData?.filter(row => {
          if ('object_ids' in row) {
            return row.object_ids.some(id => filteredObjectIds.includes(id))
          }
          return false
        })
      : admissionsData

  const getObjectNamesFromIds = (objectIds: string[]): (string | undefined)[] => {
    return objectIds
      .map(id => currentAccountObjects.find(obj => obj.id === id))
      .filter(obj => obj)
      .map(obj => obj?.name)
  }

  return (
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="simple table">
        <TableBody>
          {(objectsURL ? data : filteredData)?.map((row: Objects | Admissions) => (
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
                  <TableCell
                    onClick={() => navigate(`/admissions/view/${row.id}`)}
                    style={{ cursor: 'pointer' }}
                    align="left"
                    sx={{ height: '47px', width: '15%' }}
                  >
                    {'timestamp' in row ? dateParser(row) : ''}
                  </TableCell>
                  <TableCell
                    onClick={() => navigate(`/admissions/view/${row.id}`)}
                    style={{ cursor: 'pointer' }}
                    align="left"
                    sx={{ height: '47px', width: '15%' }}
                  >
                    {'code' in row ? `#${row.code}` : ''}
                  </TableCell>
                  <TableCell align="left" sx={{ height: '47px', width: '100%' }}>
                    {'object_ids' in row ? getObjectNamesFromIds(row.object_ids).join(', ') : ''}
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
