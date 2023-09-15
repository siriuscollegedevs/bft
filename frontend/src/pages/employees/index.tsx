import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Account, AccountToObject } from '../../types/api'
import {
  useGetAllAccountToObjectArchiveQuery,
  useGetAllAccountToObjectQuery
} from '../../__data__/service/object-account'
import { FiltersState } from '../../__data__/states/filters'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useMemo, useState } from 'react'
import { sortData } from '../../utils/sorting'
import { getButtonNames } from '../../components/shortcut-buttons/button-names'
import { ButtonName } from '../../components/shortcut-buttons'
import { SearchState } from '../../__data__/states/search'
import { Box } from '@mui/system'
import { generateSidebarProps } from '../../components/sidebar/generate-sidebar-props'
import { setPreviousPage } from '../../__data__/states/technical'

export const EmployeesPage = () => {
  const dispatch = useDispatch()
  dispatch(setPreviousPage('/directories'))
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
  const search = useSelector((state: { search: SearchState }) => state.search)
  const splitSearchQuery = search.searchFilter.split(' ')

  const [tableData, setTableData] = useState(isArchivePage ? employeesArchiveData : employeesData)
  const buttonNames: ButtonName[] = getButtonNames(isArchivePage, currentAccountRole, 'employee')
  const sidebarProps = generateSidebarProps(currentAccountRole, 'employee')
  const [dataLoaded, setDataLoaded] = useState(false)

  const dataFilters = (data: AccountToObject[]) => {
    return data
      ? data.filter(
          employee =>
            filters.objectNameFilter.length === 0 ||
            employee.objects.some(object => filters.objectNameFilter.includes(object))
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

  useEffect(() => {
    if ((isArchivePage && employeesArchiveData) || (!isArchivePage && employeesData)) {
      setDataLoaded(true)
    }
  }, [isArchivePage, employeesArchiveData, employeesData])

  const sortedRows = useMemo(() => {
    if (tableData) {
      return sortData(tableData, 'last_name')
    } else {
      return []
    }
  }, [tableData])

  const filteredTableData = sortedRows?.filter(item => {
    return splitSearchQuery.every(
      queryPart =>
        item.first_name?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
        item.surname?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
        item.last_name.toLowerCase().startsWith(queryPart.toLowerCase())
    )
  })

  const hasData = filteredTableData && filteredTableData.length > 0

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {employeesError || employeesLoading ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {dataLoaded && !hasData ? (
              <Box sx={{ width: '100%' }}>
                {search.searchFilter.length > 0 ? (
                  <p>Ничего не найдено, проверьте введенные данные.</p>
                ) : (
                  <p>Пока тут нет данных.</p>
                )}
              </Box>
            ) : (
              <>
                {hasData && (
                  <SmartTable
                    buttonNames={buttonNames}
                    size={{
                      width: '100%',
                      height: '100%'
                    }}
                    data={dataFilters(filteredTableData)}
                  />
                )}
              </>
            )}
            <Sidebar {...sidebarProps} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
