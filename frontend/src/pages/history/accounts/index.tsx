import { EntityTitle } from '../../../components/entity-title'
import { HistoryTable } from '../../../components/smart-table/history-table'
import { SideBarContainer } from '../../../styles/sidebar'
import { useGetAccountHistoryByIdQuery } from '../../../__data__/service/account.api'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useMemo } from 'react'
import { compareDates } from '../../../utils/sorting'

export const AccountsHistory = () => {
  const { id } = useParams()
  const {
    data: accountsHistoryData,
    error: accountsHistoryError,
    isLoading: accountsHistoryLoading,
    refetch: accountHistoryRefetch
  } = useGetAccountHistoryByIdQuery(id ?? '')

  useEffect(() => {
    accountHistoryRefetch()
  }, [accountsHistoryData])

  const sortedRows = useMemo(() => {
    if (accountsHistoryData) {
      return [...accountsHistoryData].sort(compareDates)
    } else {
      return []
    }
  }, [accountsHistoryData])

  return (
    <>
      <EntityTitle isSwitch={false} isSearchField={false} />
      <SideBarContainer>
        {accountsHistoryLoading || accountsHistoryError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>{sortedRows ? <HistoryTable size={{ width: '100%', height: '100%' }} data={sortedRows} /> : <></>}</>
        )}
      </SideBarContainer>
    </>
  )
}
