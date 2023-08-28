import { ButtonName } from './index'

export const getButtonNames = (
  isArchivePage: boolean,
  currentAccountRole: string,
  entityType: string
): ButtonName[] => {
  const settings: Record<string, Record<string, ButtonName[]>> = {
    archive: {
      default: ['history'],
      employee: [],
      admission: []
    },
    administrator: {
      default: ['edit', 'history', 'trash'],
      employee: ['edit', 'trash']
    },
    manager: {
      default: ['history'],
      admission: ['edit', 'cancel', 'toRepay']
    },
    specialist: {
      admission: ['edit', 'cancel', 'toRepay']
    },
    security_officer: {
      admission: ['cancel', 'toRepay']
    }
  }

  const settingKey = isArchivePage ? 'archive' : currentAccountRole
  let entityKey = 'default'
  if (entityType === 'employee') {
    entityKey = 'employee'
  } else if (entityType === 'admission') {
    entityKey = 'admission'
  }

  const buttonNames = settings[settingKey]?.[entityKey] || []

  return buttonNames
}
