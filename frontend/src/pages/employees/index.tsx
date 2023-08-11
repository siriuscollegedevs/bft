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
import * as React from 'react'

type ButtonName = 'edit' | 'history' | 'trash'

export const EmployeesPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/employees/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const { data: employeesData, error: employeesError, isLoading: employeesLoading } = useGetAllAccountToObjectQuery()
  const {
    data: employeesArchiveData,
    error: employeesArchiveError,
    isLoading: employeesArchiveLoading
  } = useGetAllAccountToObjectArchiveQuery()

  const filters = useSelector((state: { filters: FiltersState }) => state.filters)

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

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {employeesError || employeesLoading ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {isArchivePage ? (
              employeesArchiveData ? (
                <SmartTable
                  buttonNames={buttonNames}
                  size={{
                    width: '100%',
                    height: '100%'
                  }}
                  data={dataFilters(employeesArchiveData)}
                />
              ) : (
                <></>
              )
            ) : employeesData ? (
              <SmartTable
                buttonNames={buttonNames}
                size={{
                  width: '100%',
                  height: '100%'
                }}
                data={dataFilters(employeesData)}
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
