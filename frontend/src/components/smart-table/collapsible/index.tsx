import { Table, TableBody, TableContainer } from '@mui/material'

import { ButtonNames } from '../../shortcut-buttons'

import { rowsAccounts, rowsEmployees, rowsAdmissions, DataAccount, DataAdmission, DataEmployee } from './smoke'
import { Row } from './row'
import { Size } from '..'

export type myURL =
  | '/accounts'
  | '/accounts/search'
  | '/employees'
  | '/employees/search'
  | '/admissions/view/:admission_id'
  | '/admissions/:admission_id'
  | '/admissions/search'

export type CommonData = DataAccount | DataEmployee | DataAdmission

export const itsAcccount = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL === '/accounts' || currentURL === '/accounts/search'

export const itsEmployees = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL === '/employees' || currentURL === '/employees/search'

export const itsAdmissions = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL.startsWith('/admissions/') || currentURL === '/admissions/search'

export const itsAdmissionsView = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL.startsWith('/admissions/view')

export const Collapsible = ({
  currentURL,
  buttonNames,
  size
}: { currentURL: myURL } & ButtonNames & { size: Size }) => {
  const filteredRows: CommonData[] = itsAcccount({ currentURL })
    ? rowsAccounts
    : itsEmployees({ currentURL })
    ? rowsEmployees
    : itsAdmissions({ currentURL })
    ? rowsAdmissions
    : []

  return (
    
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="collapsible table">
        <TableBody>
          {filteredRows.map(row => (
            <Row key={row.name} row={row} buttonNames={buttonNames} currentURL={currentURL} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
