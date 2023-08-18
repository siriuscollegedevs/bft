import { EntityTitle } from '../../../components/entity-title'
import { HistoryTable } from '../../../components/smart-table/history-table'
import { SideBarContainer } from '../../../styles/sidebar'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useMemo } from 'react'
import { compareDates } from '../../../utils/sorting'
import { useGetObjectHistoryByIdQuery } from '../../../__data__/service/object.api'

export const ObjectsHistory = () => {
  const { id } = useParams()
  const {
    data: objectsHistoryData,
    error: objectsHistoryError,
    isLoading: objectsHistoryLoading,
    refetch: objectsHistoryRefetch
  } = useGetObjectHistoryByIdQuery(id ?? '')

  useEffect(() => {
    objectsHistoryRefetch()
  }, [objectsHistoryData])

  const sortedRows = useMemo(() => {
    if (objectsHistoryData) {
      return [...objectsHistoryData].sort(compareDates)
    } else {
      return []
    }
  }, [objectsHistoryData])

  return (
    <>
      <EntityTitle isSwitch={false} isSearchField={false} />
      <SideBarContainer>
        {objectsHistoryLoading || objectsHistoryError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>{sortedRows ? <HistoryTable size={{ width: '100%', height: '100%' }} data={sortedRows} /> : <></>}</>
        )}
      </SideBarContainer>
    </>
  )
}
