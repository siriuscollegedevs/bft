import { TableRow, TableCell, IconButton, Collapse, Table, TableBody, TableContainer } from '@mui/material'
import { Box } from '@mui/system'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import React from 'react'
import { ButtonNames, ShortcutButtons } from '../../shortcut-buttons'

import { ReactComponent as HumanIcon } from '../../../assets/human.svg'
import { ReactComponent as CarIcon } from '../../../assets/car.svg'

const rows = [
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Ice cream sandwich', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin'),
  createDataAccounts('Frozen yoghurt', 'admin')
]

function createDataAccounts(name: string, role: string) {
  return {
    name,
    role,
    value: [
      {
        email: 'abc@example.com'
      },
      {
        email: 'abc@example.com'
      }
    ]
  }
}

type value = {
  email: string
}

const rowsEmployees = [
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Ice cream sandwich'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt'),
  createDataEmployees('Frozen yoghurt')
]

function createDataEmployees(name: string) {
  return {
    name,
    Objects: [
      {
        objects: ['гмц', 'гмц']
      },
      {
        objects: ['гмц', 'гмц']
      }
    ]
  }
}

type Objects = {
  objects: string[]
}

const rowsAdmissions = [
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt'),
  createDataAdmissions('man', 'Frozen yoghurt')
]

function createDataAdmissions(type: string, name: string) {
  return {
    type,
    name,
    value: [
      {
        passType: 'Временный',
        dete: '01.01.2023-01.01.2024',
        note: 'хороший человек'
      }
    ]
  }
}

type AdmissionsValue = {
  passType: string
  dete: string
  note: string
}

export type URL =
  | '/accounts'
  | '/accounts/search'
  | '/employees'
  | '/employees/search'
  | '/admissions/view/:admission_id'
  | '/admissions/:admission_id'
  | '/admissions/search'

const itsAcccount = ({ currentURL }: { currentURL: URL }): boolean =>
  currentURL === '/accounts' || currentURL === '/accounts/search'

const itsEmployees = ({ currentURL }: { currentURL: URL }): boolean =>
  currentURL === '/employees' || currentURL === '/employees/search'

const itsAdmissions = ({ currentURL }: { currentURL: URL }): boolean =>
  currentURL.startsWith('/admissions/') || currentURL === '/admissions/search'

const itsAdmissionsView = ({ currentURL }: { currentURL: URL }): boolean => currentURL.startsWith('/admissions/view/')

export const Collapsible = ({ currentURL, buttonNames }: { currentURL: URL } & ButtonNames) => {
  return (
    <>
      <TableContainer sx={{ width: '1008px', height: '491px' }}>
        <Table aria-label="collapsible table">
          <TableBody>
            {itsAcccount({ currentURL }) && (
              <>
                {rows.map(row => (
                  <Row key={row.name} row={row} buttonNames={buttonNames} currentURL={currentURL} />
                ))}
              </>
            )}
            {itsEmployees({ currentURL }) && (
              <>
                {rowsEmployees.map(row => (
                  <Row key={row.name} row={row} buttonNames={buttonNames} currentURL={currentURL} />
                ))}
              </>
            )}
            {itsAdmissions({ currentURL }) && (
              <>
                {rowsAdmissions.map(row => (
                  <Row key={row.name} row={row} buttonNames={buttonNames} currentURL={currentURL} />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const Row = ({ row, buttonNames, currentURL }: any & ButtonNames & { currentURL: URL }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding={'checkbox'}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {itsAcccount({ currentURL }) && (
          <>
            <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
              {row.name}
            </TableCell>
            <TableCell align="left">{row.role}</TableCell>
            <TableCell align="right">
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <ShortcutButtons buttonNames={buttonNames} />
              </Box>
            </TableCell>
          </>
        )}
        {itsEmployees({ currentURL }) && (
          <>
            <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
              {row.name}
            </TableCell>
            <TableCell align="right">
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <ShortcutButtons buttonNames={buttonNames} />
              </Box>
            </TableCell>
          </>
        )}
        {itsAdmissions({ currentURL }) && (
          <>
            <TableCell align="left" padding={'checkbox'}>
              {'name' in row ? (
                <>
                  <HumanIcon style={{ height: '42px', width: '42px' }} />
                </>
              ) : (
                <>
                  <CarIcon style={{ height: '42px', width: '42px' }} />
                </>
              )}
            </TableCell>
            <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
              {row.name}
            </TableCell>
            {itsAdmissionsView({ currentURL }) ? null : (
              <>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <ShortcutButtons buttonNames={buttonNames} />
                  </Box>
                </TableCell>
              </>
            )}
          </>
        )}
      </TableRow>
      <TableRow>
        <TableCell sx={{ padding: 0, margin: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, marginRight: 0 }}>
              <Table size="small">
                <TableBody>
                  {itsAcccount({ currentURL }) && (
                    <>
                      {row.value.map((valueRow: value) => (
                        <TableRow key={valueRow.email}>
                          <TableCell align="left">{valueRow.email}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                  {itsEmployees({ currentURL }) && (
                    <>
                      {row.Objects.map((valueRow: Objects) => (
                        <>
                          <TableRow>
                            <TableCell align="left">{valueRow.objects.join(', ')}</TableCell>
                          </TableRow>
                        </>
                      ))}
                    </>
                  )}
                  {itsAdmissions({ currentURL }) && (
                    <>
                      {row.value.map((valueRow: AdmissionsValue) => (
                        <>
                          <TableRow className="ooooooooooooooooooooo">
                            <TableCell align="left" padding={'checkbox'}>
                              {valueRow.passType}
                            </TableCell>
                            <TableCell align="left" sx={{ width: '200px' }}>
                              {valueRow.dete}
                            </TableCell>
                            <TableCell align="left">{'Примичание: ' + valueRow.note}</TableCell>
                            {itsAdmissionsView({ currentURL }) ? null : (
                              <>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <ShortcutButtons buttonNames={['history']} />
                                  </Box>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        </>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
