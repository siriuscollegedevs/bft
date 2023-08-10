import { TableRow, TableCell, IconButton, Collapse, Table, TableBody } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { ButtonNames, ShortcutButtons } from '../../../shortcut-buttons'
import { myURL } from '..'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { ReactComponent as HumanIcon } from '../../../../assets/human.svg'
import { ReactComponent as CarIcon } from '../../../../assets/car.svg'
import { RECORD_FIELDS, RECORD_TYPE, getObjectValueByKey } from '../../../../__data__/consts/record'
import { Accounts, AccountToObject, AdmissionsHistory, ObjectInArray } from '../../../../types/api'
import { ACCOUNT_ROLES } from '../../../../__data__/consts/account-roles'

type CommonData = AdmissionsHistory | Accounts | AccountToObject | ObjectInArray

export const Row = ({ row, buttonNames, currentURL }: { row: CommonData } & ButtonNames & { currentURL: myURL }) => {
  const [open, setOpen] = useState(false)

  const itsAcccount = ({ currentURL }: { currentURL: myURL }): boolean =>
    currentURL === '/accounts' || currentURL === '/accounts/search'

  const itsAccountsArchive = ({ currentURL }: { currentURL: myURL }): boolean => currentURL === '/accounts/archive'

  const itsEmployees = ({ currentURL }: { currentURL: myURL }): boolean =>
    currentURL === '/employees' || currentURL === '/employees/search'

  const itsEmployeesArchive = ({ currentURL }: { currentURL: myURL }): boolean => currentURL === '/employees/archive'

  const itsAdmissions = ({ currentURL }: { currentURL: myURL }): boolean =>
    currentURL.startsWith('/admissions/') || currentURL === '/admissions/search'

  const itsAdmissionsView = ({ currentURL }: { currentURL: myURL }): boolean =>
    currentURL.startsWith('/admissions/view')

  const dateParser = (str: string) => {
    const date = new Date(str)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding={'checkbox'}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {(itsAcccount({ currentURL }) || itsAccountsArchive({ currentURL })) && 'role' in row && (
          <>
            <TableCell align="left" sx={{ height: '47px', width: '40%' }}>
              {row.last_name} {row.first_name} {row.surname}
            </TableCell>
            <TableCell align="left">{ACCOUNT_ROLES[row?.role]}</TableCell>
            <TableCell align="right">
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <ShortcutButtons buttonNames={buttonNames} />
              </Box>
            </TableCell>
          </>
        )}
        {(itsEmployees({ currentURL }) || itsEmployeesArchive({ currentURL })) && 'objects' in row && (
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
        {itsAdmissions({ currentURL }) && 'type' in row && (
          <>
            <TableCell align="left" padding={'checkbox'}>
              {row.first_name !== null ? (
                <>
                  <HumanIcon style={{ height: '42px', width: '42px' }} />
                </>
              ) : (
                <>
                  <CarIcon style={{ height: '42px', width: '42px' }} />
                </>
              )}
            </TableCell>
            {row.first_name !== null ? (
              <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
                {row.first_name + ' ' + row.last_name}
              </TableCell>
            ) : (
              <TableCell align="left" sx={{ height: '47px', width: '200px' }}>
                {row.car_brand + ' ' + row.car_model + ' ' + row.car_number}
              </TableCell>
            )}
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
                  {(itsAcccount({ currentURL }) || itsAccountsArchive({ currentURL })) && 'role' in row && (
                    <TableRow key={row.id} sx={{ height: '47px' }}>
                      <TableCell align="left" sx={{ paddingLeft: '70px' }}>
                        {row.username}
                      </TableCell>
                    </TableRow>
                  )}
                  {(itsEmployees({ currentURL }) || itsEmployeesArchive({ currentURL })) && 'objects' in row && (
                    <TableRow sx={{ height: '47px' }}>
                      <TableCell align="left" sx={{ paddingLeft: '70px' }}>
                        {Array.isArray(row.objects) && row.objects.map(valueRow => valueRow.name).join(', ')}
                      </TableCell>
                    </TableRow>
                  )}
                  {itsAdmissions({ currentURL }) && 'type' in row && (
                    <>
                      <TableRow>
                        <TableCell align="left" padding={'checkbox'}>
                          {getObjectValueByKey(row.type, RECORD_TYPE)}
                        </TableCell>
                        {row.from_date !== null && row.type === 'for_long_time' ? (
                          <>
                            <TableCell align="left" sx={{ width: '200px' }}>
                              {RECORD_FIELDS.from_date +
                                ' ' +
                                dateParser(row.from_date) +
                                ' ' +
                                RECORD_FIELDS.to_date +
                                ' ' +
                                dateParser(row.to_date)}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <>
                              <TableCell align="left" sx={{ width: '200px' }}>
                                {RECORD_FIELDS.to_date + ' ' + dateParser(row.to_date)}
                              </TableCell>
                            </>
                          </>
                        )}
                        {row.note === null ? (
                          <TableCell align="left">{'Примечание: '}</TableCell>
                        ) : (
                          <TableCell align="left">{'Примечание: ' + row.note}</TableCell>
                        )}
                        {!itsAdmissionsView({ currentURL }) && (
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              <ShortcutButtons buttonNames={['history']} />
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
