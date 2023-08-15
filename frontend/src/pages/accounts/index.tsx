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
import {useEffect, useMemo, useState} from 'react'
import {getComparator, Order, stableSort} from '../../components/smart-table/sorting';

type ButtonName = 'edit' | 'history' | 'trash'

export const AccountsPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/accounts/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const { data: accountsData, error: accountsError, isLoading: accountsLoading, refetch: accountRefetch } = useGetAllAccountsQuery()
  const {
    data: accountsArchiveData,
    error: accountsArchiveError,
    isLoading: accountsArchiveLoading, refetch: accountArchiveRefetch
  } = useGetAllArchiveAccountsQuery()

  const [tableData, setTableData] = useState(isArchivePage ? accountsArchiveData : accountsData);

  const sortingField = 'last_name'

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState(sortingField)

  useEffect(() => {
    if (isArchivePage) {
      accountArchiveRefetch()
      setTableData(accountsArchiveData);
    } else {
      accountRefetch()
      setTableData(accountsData);
    }
  }, [accountsData, accountsArchiveData, isArchivePage]);

  const visibleRows = useMemo(() => {
    if (tableData) {
      return stableSort(tableData, getComparator(order, orderBy));
    } else {
      return [];
    }
  }, [order, orderBy, tableData]);

  let buttonNames: ButtonName[] = []

  if (isArchivePage) {
    buttonNames = ['history']
  } else if (currentAccountRole === Object.keys(ACCOUNT_ROLES)[0]) {
    buttonNames = ['edit', 'history', 'trash']
  } else if (currentAccountRole === Object.keys(ACCOUNT_ROLES)[1]) {
    buttonNames = ['history']
  }

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {accountsError || accountsLoading ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {visibleRows ? (
                <SmartTable
                    buttonNames={buttonNames}
                    size={{
                      width: '100%',
                      height: '100%'
                    }}
                    data={visibleRows}
                />
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
