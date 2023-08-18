import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'
import { getRowColor, StyledTableCell } from '../../../styles/history-table'
import { BasicModal } from '../../history-modal'
import { Size } from '../index'
import { AccountHistory, AdmissionsHistory, ObjectHistory } from '../../../types/api'
import { dateParser } from '../../../utils/date-parser'
import { getActionTranslation } from '../../../__data__/consts/history'
import { useState } from 'react'

export type CommonHistoryData = AccountHistory | ObjectHistory | AdmissionsHistory

export const HistoryTable = ({ size, data }: { size: Size } & any) => {
  const [selectedRow, setSelectedRow] = useState<CommonHistoryData | null>(null)
  const [previousRow, setPreviousRow] = useState<CommonHistoryData | null>(null)

  const handleOpenModal = (rowIndex: number) => {
    const selectedRow = data[rowIndex]
    const previousRow = data[rowIndex - 1]
    setSelectedRow(selectedRow)
    setPreviousRow(previousRow)
  }

  const handleCloseModal = () => {
    setSelectedRow(null)
  }

  return (
    <>
      <TableContainer sx={{ width: size.width, height: size.height }}>
        <Table aria-label="simple table">
          <TableBody>
            {data && (
              <>
                {data?.map((row: CommonHistoryData, index: number) => (
                  <TableRow
                    key={JSON.stringify(row)}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell component="th" scope="row" align="left" sx={{ width: '20%' }}>
                      {dateParser(row.timestamp)}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '25%' }}>
                      {row.modified_by}
                    </TableCell>
                    {row.action === 'canceled' || row.action === 'modified' ? (
                      <StyledTableCell align="center" color={getRowColor(row.action)}>
                        {getActionTranslation(row.action)}
                        <Tooltip
                          title={
                            row.action === 'canceled' ? 'Посмотреть причину аннулирования' : 'Посмотреть изменения'
                          }
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
                            onClick={() => handleOpenModal(index)}
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

      <BasicModal
        open={Boolean(selectedRow)}
        handleClose={handleCloseModal}
        selectedRow={selectedRow}
        prewRow={previousRow}
      />
    </>
  )
}
