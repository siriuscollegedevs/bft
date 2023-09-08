import { useSelector } from 'react-redux'
import { ButtonGroup } from '../../components/button-group'
import { Account } from '../../types/api'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import { useComeback } from '../../hooks/comeback'

export const Main = () => {
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const { setComebackPage } = useComeback()
  setComebackPage(currentAccountRole === ACCOUNT_ROLES.manager.en ? '/navigation' : '/')

  return <ButtonGroup />
}
