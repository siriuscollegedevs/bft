import { Table, TableBody, TableContainer } from '@mui/material'

import { ButtonNames } from '../../shortcut-buttons'

import { rowsAccounts, rowsAdmissions, DataAccount, DataAdmission } from './smoke'
import { Row } from './row'
import { Size } from '..'
import {
  useGetAllAccountToObjectArchiveQuery,
  useGetAllAccountToObjectQuery
} from '../../../__data__/service/object-account'
import { AccountToObject } from '../../../types/api'

export type myURL =
  | '/accounts'
  | '/accounts/search'
  | '/employees'
  | '/employees/search'
  | '/employees/archive'
  | '/admissions/view/:admission_id'
  | '/admissions/:admission_id'
  | '/admissions/search'

export type CommonData = DataAccount | AccountToObject | DataAdmission

export const itsAcccount = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL === '/accounts' || currentURL === '/accounts/search'

export const itsEmployees = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL === '/employees' || currentURL === '/employees/search'

export const itsEmployeesArchive = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL === '/employees/archive'

export const itsAdmissions = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL.startsWith('/admissions/') || currentURL === '/admissions/search'

export const itsAdmissionsView = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL.startsWith('/admissions/view')

export const Collapsible = ({
  currentURL,
  buttonNames,
  size
}: { currentURL: myURL } & ButtonNames & { size: Size }) => {
  const { data: employeesData, error: employeesError, isLoading: employeesLoading } = useGetAllAccountToObjectQuery()
  const {
    data: employeesArchiveData,
    error: employeesArchiveError,
    isLoading: employeesArchiveLoading
  } = useGetAllAccountToObjectArchiveQuery()

  const filteredRows: CommonData[] = itsAcccount({ currentURL })
    ? rowsAccounts
    : itsEmployees({ currentURL })
    ? employeesData ?? []
    : itsEmployeesArchive({ currentURL })
    ? employeesArchiveData ?? []
    : itsAdmissions({ currentURL })
    ? rowsAdmissions
    : []

  return (
    
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="collapsible table">
        <TableBody>
          {filteredRows?.map(row => (
            <Row key={'name' in row ? row.name : row.id} row={row} buttonNames={buttonNames} currentURL={currentURL} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
