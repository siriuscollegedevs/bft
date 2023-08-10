import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Account } from '../../types/api'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import { useGetAllAccountsQuery, useGetAllArchiveAccountsQuery } from '../../__data__/service/account.api'

type ButtonName = 'edit' | 'history' | 'trash'

export const AccountsPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/accounts/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const { data: accountsData, error: accountsError, isLoading: accountsLoading } = useGetAllAccountsQuery()
  const {
    data: accountsArchiveData,
    error: accountsArchiveError,
    isLoading: accountsArchiveLoading
  } = useGetAllArchiveAccountsQuery()

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
        {isArchivePage ? (
          accountsArchiveData ? (
            <SmartTable
              buttonNames={buttonNames}
              size={{
                width: '100%',
                height: '800px'
              }}
              data={accountsArchiveData}
            />
          ) : (
            <></>
          )
        ) : accountsData ? (
          <SmartTable
            buttonNames={buttonNames}
            size={{
              width: '100%',
              height: '800px'
            }}
            data={accountsData}
          />
        ) : (
          <></>
        )}
        <Sidebar isSearch={true} isObjects={true} isButton={true} />
      </SideBarContainer>
    </>
  )
}
