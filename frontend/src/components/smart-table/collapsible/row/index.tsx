import { TableRow, TableCell, IconButton, Collapse, Table, TableBody } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { ButtonNames, ShortcutButtons } from '../../../shortcut-buttons'
import { value, AdmissionsValue } from '../smoke'
import { itsAcccount, itsEmployees, itsAdmissions, itsAdmissionsView, myURL, itsEmployeesArchive } from '..'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { ReactComponent as HumanIcon } from '../../../../assets/human.svg'
import { ReactComponent as CarIcon } from '../../../../assets/car.svg'
import { ObjectInArray } from '../../../../types/api'

export const Row = ({ row, buttonNames, currentURL }: any & ButtonNames & { currentURL: myURL }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
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
            <TableCell align="left" sx={{ height: '47px', width: '100%' }}>
              {row.last_name} {row.first_name} {row.surname}
            </TableCell>
            <TableCell align="right">
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <ShortcutButtons buttonNames={buttonNames} />
              </Box>
            </TableCell>
          </>
        )}
        {itsEmployeesArchive({ currentURL }) && (
          <>
            <TableCell align="left" sx={{ height: '47px', width: '100%' }}>
              {row.last_name} {row.first_name} {row.surname}
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
            {itsAdmissionsView({ currentURL }) ? (
              <>
                <TableCell align="right"></TableCell>
              </>
            ) : (
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
            <Box sx={{ margin: 0 }}>
              <Table size="small">
                <TableBody>
                  {itsAcccount({ currentURL }) &&
                    row.value.map((valueRow: value) => (
                      <TableRow key={valueRow.email}>
                        <TableCell align="left">{valueRow.email}</TableCell>
                      </TableRow>
                    ))}
                  {itsEmployees({ currentURL }) && (
                    <TableRow>
                      <TableCell align="left">
                        {row.objects?.map((valueRow: ObjectInArray) => valueRow.name).join(', ')}
                      </TableCell>
                    </TableRow>
                  )}
                  {itsEmployeesArchive({ currentURL }) && (
                    <TableRow>
                      <TableCell align="left">
                        {row.objects?.map((valueRow: ObjectInArray) => valueRow.name).join(', ')}
                      </TableCell>
                    </TableRow>
                  )}
                  {itsAdmissions({ currentURL }) &&
                    row.value.map((valueRow: AdmissionsValue) => (
                      <>
                        <TableRow>
                          <TableCell align="left" padding={'checkbox'}>
                            {valueRow.passType}
                          </TableCell>
                          <TableCell align="left" sx={{ width: '200px' }}>
                            {valueRow.dete}
                          </TableCell>
                          <TableCell align="left">{'Примечание: ' + valueRow.note}</TableCell>
                          {!itsAdmissionsView({ currentURL }) && (
                            <TableCell align="right">
                              <Box display="flex" alignItems="center" justifyContent="flex-end">
                                <ShortcutButtons buttonNames={['history']} />
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      </>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
