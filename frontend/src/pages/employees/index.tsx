import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Account } from '../../types/api'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import {
  useGetAllAccountToObjectArchiveQuery,
  useGetAllAccountToObjectQuery
} from '../../__data__/service/object-account'

type ButtonName = 'edit' | 'history' | 'trash'

export const EmployeesPage = () => {
  //TODO вынести это отдельно, тк используется в 3 справочниках
  const location = useLocation()
  const isArchivePage = location.pathname === '/employees/archive'
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const { data: employeesData, error: employeesError, isLoading: employeesLoading } = useGetAllAccountToObjectQuery()
  const {
    data: employeesArchiveData,
    error: employeesArchiveError,
    isLoading: employeesArchiveLoading
  } = useGetAllAccountToObjectArchiveQuery()

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
          employeesArchiveData ? (
            <SmartTable
              buttonNames={buttonNames}
              size={{
                width: '100%',
                height: '800px'
              }}
              data={employeesArchiveData}
            />
          ) : (
            <></>
          )
        ) : employeesData ? (
          <SmartTable
            buttonNames={buttonNames}
            size={{
              width: '100%',
              height: '800px'
            }}
            data={employeesData}
          />
        ) : (
          <></>
        )}
        <Sidebar isSearch={true} isObjects={true} isButton={true} />
      </SideBarContainer>
    </>
  )
}
