import { SidebarProps } from './index'

export const generateSidebarProps = (currentAccountRole: string, entityType: string): SidebarProps => {
  const rolesConfig: Record<string, Record<string, SidebarProps>> = {
    administrator: {
      account: { isSearch: true, isObjects: false, isButton: true },
      object: { isSearch: false, isObjects: false, isButton: true },
      employee: { isSearch: true, isObjects: true, isButton: true }
    },
    manager: {
      account: { isSearch: true, isObjects: false, isButton: false },
      object: { isSearch: false, isObjects: false, isButton: false },
      employee: { isSearch: true, isObjects: true, isButton: false }
    }
  }

  return rolesConfig[currentAccountRole][entityType]
}
