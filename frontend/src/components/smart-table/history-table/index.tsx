import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'
import { rowsAccount, rowsAdmission, rowsEmployee, rowsObject } from './smoke'
import { getRowColor, StyledTableCell } from '../../../styles/history-table'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
// import { BasicModal } from '../../modal'
import { Size } from '../index'
import { AccountHistory } from '../../../types/api';

// export type Row = {
//   id: string
//   timestamp: string
//   modifiedBy: string
//   action: string
//   data: object
// }
//
// function getRowsData(): Row[] {
//   const location = useLocation()
//   if (location.pathname.startsWith('/accounts/')) {
//     return rowsAccount
//   } else if (location.pathname.startsWith('/objects/')) {
//     return rowsObject
//   } else if (location.pathname.startsWith('/employees/')) {
//     return rowsEmployee
//   } else if (location.pathname.startsWith('/admissions/')) {
//     return rowsAdmission
//   } else {
//     return []
//   }
// }

const actionTranslations: { [key: string]: string } = {
  edit: 'Измененные данные',
  cancel: 'Аннулирование',
  toRepay: 'Погашение'
}

const getActionTranslation = (action: string): string => {
  return actionTranslations[action] || action
}

export const HistoryTable = ( { size, data }: {size: Size} & any) => {
  // const [selectedRow, setSelectedRow] = useState<Row | null>(null)
  //
  // const handleOpenModal = (rowData: Row) => {
  //   setSelectedRow(rowData)
  // }
  // const handleCloseModal = () => {
  //   setSelectedRow(null)
  // }

  return (
    <>
      <TableContainer sx={{ width: size.width, height: size.height }}>
        <Table aria-label="simple table">
          <TableBody>
            {data && (
                <>
                  {data?.map((row: AccountHistory) => (
                      <TableRow
                          key={row.username}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                      >
                        <TableCell component="th" scope="row" align="left" sx={{ width: '20%' }}>
                          {row.timestamp}
                        </TableCell>
                        <TableCell align="left" sx={{ width: '25%' }}>
                          {row.modified_by}
                        </TableCell>
                        {row.action === 'cancel' || row.action === 'edit' ? (
                            <StyledTableCell align="center" color={getRowColor(row.action)}>
                              {getActionTranslation(row.action)}
                              <Tooltip
                                  title={row.action === 'cancel' ? 'Посмотреть причину аннулирования' : 'Посмотреть изменения'}
                                  placement="top"
                              >
                                <InfoOutlinedIcon
                                    sx={{
                                      verticalAlign: 'bottom',
                                      ml: '5px',
                                      '&:hover': {
                                        cursor: 'pointer'
                                      }
                                    }}
                                    color="primary"
                                    // onClick={() => handleOpenModal(row)}
                                />
                              </Tooltip>
                            </StyledTableCell>
                        ) : (
                            <StyledTableCell align="center" color={getRowColor(row.action)}>
                              {getActionTranslation(row.action)}
                            </StyledTableCell>
                        )}
                      </TableRow>
                  ))}
                </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/*<BasicModal open={Boolean(selectedRow)} handleClose={handleCloseModal} selectedRow={selectedRow as Row} />*/}
    </>
  )
}
