import { EntityTitle } from '../../../components/entity-title'
import { HistoryTable } from '../../../components/smart-table/history-table'
import { SideBarContainer } from '../../../styles/sidebar'

export const Accounts = () => {
  return (
    <>
      <EntityTitle isSwitch={false} />
      <SideBarContainer>
        <HistoryTable />
      </SideBarContainer>
    </>
  )
}
