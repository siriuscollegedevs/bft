import { Table, TableBody, TableContainer } from '@mui/material'

import { ButtonNames } from '../../shortcut-buttons'

import { rowsAdmissions, DataAdmission } from './smoke'
import { Row } from './row'
import { Size } from '..'
import {
  useGetAllAccountToObjectArchiveQuery,
  useGetAllAccountToObjectQuery
} from '../../../__data__/service/object-account'
import { Accounts, AccountToObject } from '../../../types/api'
import { useGetAllAccountsQuery } from '../../../__data__/service/account.api'

export type myURL =
  | '/accounts'
  | '/accounts/archive'
  | '/accounts/search'
  | '/employees'
  | '/employees/search'
  | '/employees/archive'
  | '/admissions/view/:admission_id'
  | '/admissions/:admission_id'
  | '/admissions/search'

export type CommonData = Accounts | AccountToObject | DataAdmission

export const itsAcccount = ({ currentURL }: { currentURL: myURL }): boolean =>
  currentURL === '/accounts' || currentURL === '/accounts/search'

export const itsAccountsArchive = ({ currentURL }: { currentURL: myURL }): boolean => currentURL === '/accounts/archive'

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

  const { data: accountsData, error: accountsError, isLoading: accountsLoading } = useGetAllAccountsQuery()
  const {
    data: accountsArchiveData,
    error: accountsArchiveError,
    isLoading: accountsArchiveLoading
  } = useGetAllAccountToObjectArchiveQuery()

  const filteredRows: CommonData[] = itsAcccount({ currentURL })
    ? accountsData ?? []
    : itsAccountsArchive({ currentURL })
    ? accountsArchiveData ?? []
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
