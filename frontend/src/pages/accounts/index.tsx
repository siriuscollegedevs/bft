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
import { useEffect, useState } from 'react'
import { SearchState } from '../../__data__/states/search';
import { Box } from '@mui/system';

type ButtonName = 'edit' | 'history' | 'trash'

export const AccountsPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/accounts/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const search = useSelector((state: { search: SearchState }) => state.search)
const splitSearchQuery = search.searchFilter.split(' ');

  const { data: accountsData, error: accountsError, isLoading: accountsLoading, refetch: accountRefetch } = useGetAllAccountsQuery()
  const {
    data: accountsArchiveData,
    error: accountsArchiveError,
    isLoading: accountsArchiveLoading, refetch: accountArchiveRefetch
  } = useGetAllArchiveAccountsQuery()

  const [tableData, setTableData] = useState(isArchivePage ? accountsArchiveData : accountsData);

  useEffect(() => {
    if (isArchivePage) {
      accountArchiveRefetch()
      setTableData(accountsArchiveData);
    } else {
      accountRefetch()
      setTableData(accountsData);
    }
  }, [accountsData, accountsArchiveData, isArchivePage]);

  let buttonNames: ButtonName[] = []

  if (isArchivePage) {
    buttonNames = ['history']
  } else if (currentAccountRole === Object.keys(ACCOUNT_ROLES)[0]) {
    buttonNames = ['edit', 'history', 'trash']
  } else if (currentAccountRole === Object.keys(ACCOUNT_ROLES)[1]) {
    buttonNames = ['history']
  }

  const filteredTableData = tableData?.filter((item) => {
    return (
        splitSearchQuery.every((queryPart) =>
            item.first_name.toLowerCase().includes(queryPart.toLowerCase()) ||
            item.surname.toLowerCase().includes(queryPart.toLowerCase()) ||
            item.last_name.toLowerCase().includes(queryPart.toLowerCase()) ||
            item.username.toLowerCase().includes(queryPart.toLowerCase()) ||
            ACCOUNT_ROLES[item.role].toLowerCase().includes(queryPart.toLowerCase())
        )
    );
});


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
                          height: '100%',
                        }}
                        data={filteredTableData}
                    />
                ) : (
                    <Box sx={{ width: '100%'}}>
                      <p>Ничего не найдено, проверьте введенные данные.</p>
                    </Box>
                )
            ) : (
                <></>
            )}
            {/*{tableData ? (*/}
            {/*    <SmartTable*/}
            {/*        buttonNames={buttonNames}*/}
            {/*        size={{*/}
            {/*          width: '100%',*/}
            {/*          height: '100%'*/}
            {/*        }}*/}
            {/*        data={tableData}*/}
            {/*    />*/}
            {/*) : (*/}
            {/*    <></>*/}
            {/*)}*/}
            <Sidebar isSearch={true} isObjects={false} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
