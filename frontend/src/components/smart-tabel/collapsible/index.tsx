import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material'
import { Box } from '@mui/system'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import React from 'react'
import { ButtonNames, ShortcutButtons } from '../../shortcut-buttons'

const rows = [
  createData('Frozen yoghurt', 159),
  createData('Ice cream sandwich', 237),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159),
  createData('Frozen yoghurt', 159)
]

type history = {
  email: string
}

function createData(name: string, calories: number) {
  return {
    name,
    calories,
    history: [
      {
        email: 'abc@example.com'
      },
      {
        email: 'abc@example.com'
      }
    ]
  }
}

export const Collapsible = ({ buttonNames }: ButtonNames) => {
  return (
    <>
      <TableContainer sx={{ width: '1008px', height: '491px' }}>
        <Table aria-label="collapsible table">
          <TableBody>
            {rows.map(row => (
              <Row key={row.name} row={row} buttonNames={buttonNames} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const Row = ({ row, buttonNames }: any & ButtonNames) => {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding={'checkbox'}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
          {row.name}
        </TableCell>
        <TableCell align="left">{row.calories}</TableCell>
        <TableCell align="right">
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <ShortcutButtons buttonNames={buttonNames} />
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row.history.map((historyRow: history) => (
                    <TableRow key={historyRow.email}>
                      <TableCell align="left">{historyRow.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
