import {ButtonName} from './index'

export const getButtonNames = (
    isArchivePage: boolean,
    currentAccountRole: string,
    entityType: string
): ButtonName[] => {
    const settings: Record<string, Record<string, ButtonName[]>> = {
        archive: {
            default: ['history'],
            employee: []
        },
        administrator: {
            default: ['edit', 'history', 'trash'],
            employee: ['edit', 'trash']
        },
        manager: {
            default: ['history']
        }
    }

    const settingKey = isArchivePage ? 'archive' : currentAccountRole
    const entityKey = entityType === 'employee' ? 'employee' : 'default'

    const buttonNames = settings[settingKey]?.[entityKey] || []

    return buttonNames
}
