import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Account } from '../../types/api'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import { useGetAllAccountsQuery, useGetAllArchiveAccountsQuery } from '../../__data__/service/account.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useMemo, useState } from 'react'
import { sortData } from '../../utils/sorting'
import { SearchState } from '../../__data__/states/search'
import { Box } from '@mui/system'
import { getButtonNames } from '../../components/shortcut-buttons/button-names'
import { ButtonName } from '../../components/shortcut-buttons'

export const AccountsPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/accounts/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const search = useSelector((state: { search: SearchState }) => state.search)
  const splitSearchQuery = search.searchFilter.split(' ')

  const {
    data: accountsData,
    error: accountsError,
    isLoading: accountsLoading,
    refetch: accountRefetch
  } = useGetAllAccountsQuery()
  const { data: accountsArchiveData, refetch: accountArchiveRefetch } = useGetAllArchiveAccountsQuery()

  const [tableData, setTableData] = useState(isArchivePage ? accountsArchiveData : accountsData)
  const buttonNames: ButtonName[] = getButtonNames(isArchivePage, currentAccountRole)

  useEffect(() => {
    if (isArchivePage) {
      accountArchiveRefetch()
      setTableData(accountsArchiveData)
    } else {
      accountRefetch()
      setTableData(accountsData)
    }
  }, [accountsData, accountsArchiveData, isArchivePage])

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
        item.first_name.toLowerCase().startsWith(queryPart.toLowerCase()) ||
        item.surname.toLowerCase().startsWith(queryPart.toLowerCase()) ||
        item.last_name.toLowerCase().startsWith(queryPart.toLowerCase()) ||
        item.username.toLowerCase().includes(queryPart.toLowerCase()) ||
        ACCOUNT_ROLES[item.role as keyof typeof ACCOUNT_ROLES].ru.toLowerCase().startsWith(queryPart.toLowerCase())
    )
  })

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {accountsError || accountsLoading ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {filteredTableData ? (
              filteredTableData.length > 0 ? (
                <SmartTable
                  buttonNames={buttonNames}
                  size={{
                    width: '100%',
                    height: '100%'
                  }}
                  data={filteredTableData}
                />
              ) : (
                <Box sx={{ width: '100%' }}>
                  <p>Ничего не найдено, проверьте введенные данные.</p>
                </Box>
              )
            ) : (
              <></>
            )}
            <Sidebar isSearch={true} isObjects={false} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
