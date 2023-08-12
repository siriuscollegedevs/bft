import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllAdmissionsMutation } from '../../__data__/service/admission.api';
import CircularProgress from '@mui/material/CircularProgress';

export const AdmissionsPage = () => {
    const [admissionsMutation, { data: admissionsData, isLoading: admissionsLoading, isError, isSuccess}] = useGetAllAdmissionsMutation()

  return (
    <>
      <EntityTitle isSearchField={true} isSwitch={true} />

      <SideBarContainer>
          { admissionsLoading || isError ? (
              <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
          ) : (
              <>
                  <SmartTable
                      buttonNames={['edit', 'history', 'trash']}
                      size={{
                          width: '100%',
                          height: '100%'
                      }}
                  />
                  <Sidebar isSearch={true} isObjects={true} isButton={true} />
              </>
          )}
      </SideBarContainer>
    </>
  )
}
