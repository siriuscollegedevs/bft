import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { BasicModal, CommonData } from '../../modal'
import { StyledTableCell, getRowColor } from '../../../styles/history-table'
import {
  dataAccount,
  dataAdmissions,
  dataEmployees,
  dataObject,
  rowsAccount,
  rowsAdmission,
  rowsEmployee,
  rowsObject
} from './smoke'
import { useLocation } from 'react-router-dom'

type Row = {
  id: string
  date: string
  user: string
  data: string
}

const actionTranslations: { [key: string]: string } = {
  edit: 'Измененные данные',
  cancel: 'Аннулирование',
  toRepay: 'Погашение'
}

const getActionTranslation = (action: string): string => {
  return actionTranslations[action] || action
}

export const HistoryTable = () => {
  const location = useLocation()

  let rows: Row[] = []
  let data: CommonData
  if (location.pathname.startsWith('/objects/')) {
    rows = rowsObject
    data = dataObject[0]
  } else if (location.pathname.startsWith('/accounts/')) {
    rows = rowsAccount
    data = dataAccount[0]
  } else if (location.pathname.startsWith('/employees/')) {
    rows = rowsEmployee
    data = dataEmployees[0]
  } else if (location.pathname.startsWith('/admissions/')) {
    rows = rowsAdmission
    data = dataAdmissions[0]
  }

  const [currentId, setCurrentId] = useState('')

  const handleOpenModal = (id: string) => {
    setCurrentId(id)
  }

  const handleCloseModal = () => {
    setCurrentId('')
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%', height: '550px' }}>
        <Table sx={{ minWidth: 650, height: '400px' }} aria-label="simple table">
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.date} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="left">{row.user}</TableCell>
                <StyledTableCell align="center" color={getRowColor(row.data)}>
                  {getActionTranslation(row.data)}
                  {row.data === 'edit' && (
                    <Tooltip title="Посмотреть изменения" placement="top">
                      <InfoOutlinedIcon
                        sx={{
                          verticalAlign: 'bottom',
                          ml: '5px',
                          '&:hover': {
                            cursor: 'pointer'
                          }
                        }}
                        color="primary"
                        onClick={() => handleOpenModal(row.id)}
                      ></InfoOutlinedIcon>
                    </Tooltip>
                  )}

                  {row.data === 'cancel' && (
                    <Tooltip title="Посмотреть примечание" placement="top">
                      <InfoOutlinedIcon
                        sx={{
                          verticalAlign: 'bottom',
                          ml: '5px',
                          '&:hover': {
                            cursor: 'pointer'
                          }
                        }}
                        color="primary"
                        onClick={() => handleOpenModal(row.id)}
                      ></InfoOutlinedIcon>
                    </Tooltip>
                  )}
                  <BasicModal open={currentId === row.id} handleClose={handleCloseModal} id={row.id} data={data} />
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
