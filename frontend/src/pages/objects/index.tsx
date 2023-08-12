import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllObjectsQuery } from '../../__data__/service/object.api'
import CircularProgress from '@mui/material/CircularProgress'

export const ObjectsPage = () => {
  const { data: objectsData, error: objectsError, isLoading: objectsLoading } = useGetAllObjectsQuery()
  return (
    <>
      <EntityTitle isSearchField={true} isSwitch={true} />

      <SideBarContainer>
        {objectsError || objectsLoading ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            <SmartTable
              buttonNames={['edit', 'history', 'trash']}
              size={{
                width: '100%',
                height: '100%'
              }}
              data={objectsData}
            />
            <Sidebar isSearch={false} isObjects={false} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
