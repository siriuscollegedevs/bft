import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Account, AccountToObject } from '../../types/api'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import {
  useGetAllAccountToObjectArchiveQuery,
  useGetAllAccountToObjectQuery
} from '../../__data__/service/object-account'
import { FiltersState } from '../../__data__/states/filters'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useMemo, useState } from 'react'
import { sortData } from '../../components/smart-table/sorting'

type ButtonName = 'edit' | 'history' | 'trash'

export const EmployeesPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/employees/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const {
    data: employeesData,
    error: employeesError,
    isLoading: employeesLoading,
    refetch: employeesRefetch
  } = useGetAllAccountToObjectQuery()
  const { data: employeesArchiveData, refetch: employeesArchiveRefetch } = useGetAllAccountToObjectArchiveQuery()

  const filters = useSelector((state: { filters: FiltersState }) => state.filters)
  const [tableData, setTableData] = useState(isArchivePage ? employeesArchiveData : employeesData)

  let buttonNames: ButtonName[] = []

  if (isArchivePage) {
    buttonNames = ['history']
  } else if (currentAccountRole === Object.keys(ACCOUNT_ROLES)[0]) {
    buttonNames = ['edit', 'history', 'trash']
  } else if (currentAccountRole === Object.keys(ACCOUNT_ROLES)[1]) {
    buttonNames = ['history']
  }

  const dataFilters = (data: AccountToObject[]) => {
    return data
      ? data.filter(
          employee =>
            filters.objectNameFilter.length === 0 ||
            employee.objects.some(object => filters.objectNameFilter.includes(object.name))
        )
      : []
  }

  useEffect(() => {
    if (isArchivePage) {
      employeesArchiveRefetch()
      setTableData(employeesArchiveData)
    } else {
      employeesRefetch()
      setTableData(employeesData)
    }
  }, [employeesData, employeesArchiveData, isArchivePage])

  const sortedRows = useMemo(() => {
    if (tableData) {
      return sortData(tableData, 'last_name')
    } else {
      return []
    }
  }, [tableData])

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {employeesError || employeesLoading ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {sortedRows ? (
              <SmartTable
                buttonNames={buttonNames}
                size={{
                  width: '100%',
                  height: '100%'
                }}
                data={dataFilters(sortedRows)}
              />
            ) : (
              <></>
            )}
            <Sidebar isSearch={true} isObjects={true} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
