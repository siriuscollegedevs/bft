import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllArchiveObjectsQuery, useGetAllObjectsQuery } from '../../__data__/service/object.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Account } from '../../types/api'
import { useSelector } from 'react-redux'
import { sortData } from '../../utils/sorting'
import { SearchState } from '../../__data__/states/search'
import { Box } from '@mui/system'
import { getButtonNames } from '../../components/shortcut-buttons/button-names'
import { ButtonName } from '../../components/shortcut-buttons'

export const ObjectsPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/objects/archive'
  const search = useSelector((state: { search: SearchState }) => state.search)
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const {
    data: objectsData,
    error: objectsError,
    isLoading: objectsLoading,
    refetch: refetchObjectsData
  } = useGetAllObjectsQuery()
  const {
    data: objectsArchiveData,
    error: objectsArchiveError,
    isLoading: objectsArchiveLoading,
    refetch: refetchObjectsArchiveData
  } = useGetAllArchiveObjectsQuery()

  const buttonNames: ButtonName[] = getButtonNames(isArchivePage, currentAccountRole)
  const [tableData, setTableData] = useState(isArchivePage ? objectsArchiveData : objectsData)

  useEffect(() => {
    if (isArchivePage) {
      refetchObjectsArchiveData()
      setTableData(objectsArchiveData)
    } else {
      refetchObjectsData()
      setTableData(objectsData)
    }
  }, [objectsData, objectsArchiveData, isArchivePage])

  const sortedRows = useMemo(() => {
    if (tableData) {
      return sortData(tableData, 'name')
    } else {
      return []
    }
  }, [tableData])

  const filteredTableData = sortedRows?.filter(item =>
    item.name.toLowerCase().includes(search.searchFilter.toLowerCase())
  )

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {objectsError || objectsLoading || objectsArchiveLoading || objectsArchiveError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {filteredTableData ? (
              filteredTableData.length > 0 ? (
                <SmartTable
                  buttonNames={buttonNames}
                  size={{
                    width: '100%',
                    height: '100%'
                  }}
                  data={filteredTableData}
                />
              ) : (
                <Box sx={{ width: '100%' }}>
                  <p>Ничего не найдено, проверьте введенные данные.</p>
                </Box>
              )
            ) : (
              <></>
            )}
            <Sidebar isSearch={false} isObjects={false} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
