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
import { useGetAllAdmissionsMutation } from '../../../__data__/service/admission.api'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

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
  console.log(idArray)

  const { data: objectData, error: objectError, isLoading: objectLoading } = useGetAllObjectsQuery()
  const [getAllAdmissions, { data: admissionData, error: admissionError, isLoading: admissionLoading }] =
    useGetAllAdmissionsMutation()

  // const [rowsData, setRowsData] = useState<Objects[] | Admissions[]>([])

  getAllAdmissions(idArray)
  // useEffect(() => {
  //   if (idArray.length > 0) {
  //     const fetchData = async () => {
  //       try {
  //         const data = await getAllAdmissions(idArray)
  //         console.log(data)
  //       } catch (error) {
  //         console.error('Error fetching admissions:', error)
  //       }
  //     }

  //     fetchData()
  //   }
  // }, [idArray])

  // TODO: изменить условия useEffect, сейчас он спамит запросами
  // useEffect(() => {
  //   if (objectsURL) {
  //     setRowsData(objectData ?? [])
  //   } else {
  //     getAllAdmissions(idArray)
  //     setRowsData(admissionData ?? [])
  //   }
  // }, [objectsURL, idArray, objectData, admissionData, getAllAdmissions])

  return (
    <></>
    // <TableContainer sx={{ width: size.width, height: size.height }}>
    //   <Table aria-label="simple table">
    //     <TableBody>
    //       {rowsData.map((row: Objects | Admissions) => (
    //         <TableRow key={'name' in row ? row.name : row.code}>
    //           {objectsURL ? (
    //             <>
    //               <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
    //                 {'name' in row ? row.name : ''}
    //               </TableCell>
    //               <TableCell align="right">
    //                 <Box display="flex" alignItems="center" justifyContent="flex-end">
    //                   <ShortcutButtons buttonNames={buttonNames} />
    //                 </Box>
    //               </TableCell>
    //             </>
    //           ) : (
    //             <>
    //               <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
    //                 {'timestemp' in row ? row.timestemp : ''}
    //               </TableCell>
    //               <TableCell align="left" padding={'checkbox'}>
    //                 {'code' in row ? `#${row.code}` : ''}
    //               </TableCell>
    //               <TableCell align="right">
    //                 <Box display="flex" alignItems="center" justifyContent="flex-end">
    //                   <ShortcutButtons buttonNames={buttonNames} />
    //                 </Box>
    //               </TableCell>
    //             </>
    //           )}
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  )
}
