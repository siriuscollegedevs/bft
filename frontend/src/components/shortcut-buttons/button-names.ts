import { ButtonName } from './index'

export const getButtonNames = (isArchivePage: boolean, currentAccountRole: string): ButtonName[] => {
  if (isArchivePage) {
    return ['history']
  } else if (currentAccountRole === 'administrator') {
    return ['edit', 'history', 'trash']
  } else if (currentAccountRole === 'manager') {
    return ['history']
  }
  return []
}
