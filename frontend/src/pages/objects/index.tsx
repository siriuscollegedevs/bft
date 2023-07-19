import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'

export const ObjectsPage = () => {
  return (
    <>
      <EntityTitle isSwitch={true} />

      <SideBarContainer>
        <SmartTable
          buttonNames={['edit', 'history', 'trash']}
          size={{
            width: '100%',
            height: '800px'
          }}
        />
        <Sidebar isSearch={false} isObjects={true} isButton={true} />
      </SideBarContainer>
    </>
  )
}
