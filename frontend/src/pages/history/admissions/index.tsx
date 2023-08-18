import { EntityTitle } from '../../../components/entity-title'
import { HistoryTable } from '../../../components/smart-table/history-table'
import { SideBarContainer } from '../../../styles/sidebar'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useMemo } from 'react'
import { compareDates } from '../../../utils/sorting'
import { useGetAdmissionsHistoryByIdQuery } from '../../../__data__/service/admission.api'

export const AdmissionsHistory = () => {
  const { id } = useParams()
  const {
    data: admissionsHistoryData,
    error: admissionsHistoryError,
    isLoading: admissionsHistoryLoading,
    refetch: admissionsHistoryRefetch
  } = useGetAdmissionsHistoryByIdQuery(id ?? '')

  useEffect(() => {
    admissionsHistoryRefetch()
  }, [admissionsHistoryData])

  const sortedRows = useMemo(() => {
    if (admissionsHistoryData) {
      return [...admissionsHistoryData].sort(compareDates)
    } else {
      return []
    }
  }, [admissionsHistoryData])

  return (
    <>
      <EntityTitle isSwitch={false} isSearchField={false} />
      <SideBarContainer>
        {admissionsHistoryLoading || admissionsHistoryError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>{sortedRows ? <HistoryTable size={{ width: '100%', height: '100%' }} data={sortedRows} /> : <></>}</>
        )}
      </SideBarContainer>
    </>
  )
}
