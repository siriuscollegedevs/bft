import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'

export const setDocumentTitleBasedOnRole = (role: keyof typeof ACCOUNT_ROLES) => {
  document.title = `Доступ.${ACCOUNT_ROLES[role].ru}`
}

export const clearDocumentTitle = () => {
  document.title = 'Сириус.Доступ'
}
