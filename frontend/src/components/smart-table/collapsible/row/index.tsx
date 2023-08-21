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
import {
  Account,
  Accounts,
  AccountToObject,
  AdmissionsHistory,
  ObjectInArray,
  SearchOfAdmissionsResponse
} from '../../../../types/api'
import { ACCOUNT_ROLES } from '../../../../__data__/consts/account-roles'
import { CustomCollapseCell } from '../../../../styles/table'
import { useSelector } from 'react-redux'
import { dateParser } from '../../../../utils/date-parser'

type CommonData = AdmissionsHistory | Accounts | AccountToObject | ObjectInArray | SearchOfAdmissionsResponse

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

  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

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
            <TableCell align="left">{ACCOUNT_ROLES[row?.role as keyof typeof ACCOUNT_ROLES].ru}</TableCell>
            <TableCell align="right" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <ShortcutButtons buttonNames={buttonNames} id={row.id} />
              </Box>
            </TableCell>
          </>
        )}
        {(itsEmployees({ currentURL }) || itsEmployeesArchive({ currentURL })) && 'objects' in row && (
          <>
            <TableCell align="left" sx={{ height: '47px', width: '100%' }}>
              {row.last_name} {row.first_name} {row.surname}
            </TableCell>
            <TableCell align="right" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <ShortcutButtons buttonNames={buttonNames} id={row.id} />
              </Box>
            </TableCell>
          </>
        )}
        {itsAdmissions({ currentURL }) && 'type' in row && (
          <>
            <TableCell align="left" padding={'checkbox'}>
              {row.last_name !== null ? (
                <>
                  <HumanIcon style={{ height: '42px', width: '42px' }} />
                </>
              ) : (
                <>
                  <CarIcon style={{ height: '42px', width: '42px' }} />
                </>
              )}
            </TableCell>
            {currentAccountRole === 'security_officer' ? (
              row.last_name !== null ? (
                <TableCell align="left" sx={{ height: '47px' }}>
                  {row.last_name + ' ' + row.first_name}
                </TableCell>
              ) : (
                <TableCell align="left" sx={{ height: '47px' }}>
                  {row.car_brand + ' ' + row.car_model + ' ' + row.car_number}
                </TableCell>
              )
            ) : (
              <TableCell align="left" sx={{ height: '47px' }}>
                {row.last_name !== null
                  ? row.last_name + ' ' + row.first_name + ' ' + row.surname
                  : row.car_brand + ' ' + row.car_model + ' ' + row.car_number}
              </TableCell>
            )}
            {itsAdmissionsView({ currentURL }) ? (
              <>
                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
              </>
            ) : (
              <>
                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <ShortcutButtons buttonNames={buttonNames} id={row.id} />
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
                      <CustomCollapseCell align="left">{row.username}</CustomCollapseCell>
                    </TableRow>
                  )}
                  {(itsEmployees({ currentURL }) || itsEmployeesArchive({ currentURL })) && 'objects' in row && (
                    <TableRow sx={{ height: '47px' }}>
                      <CustomCollapseCell align="left" sx={{ padding: '6px 0 6px 54px' }}>
                        {Array.isArray(row.objects) && row.objects.map(valueRow => valueRow).join(', ')}
                      </CustomCollapseCell>
                    </TableRow>
                  )}
                  {itsAdmissions({ currentURL }) && 'type' in row && (
                    <>
                      <TableRow>
                        <TableCell align="left" padding={'checkbox'} sx={{ height: '47px' }}>
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
                              <TableCell align="left" sx={{ width: '200px', height: '47px' }}>
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
                              <ShortcutButtons buttonNames={['history']} id={row.id} />
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
