import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllArchiveObjectsQuery, useGetAllObjectsQuery } from '../../__data__/service/object.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Account } from '../../types/api'
import { useDispatch, useSelector } from 'react-redux'
import { sortData } from '../../utils/sorting'
import { SearchState } from '../../__data__/states/search'
import { Box } from '@mui/system'
import { getButtonNames } from '../../components/shortcut-buttons/button-names'
import { ButtonName } from '../../components/shortcut-buttons'
import { generateSidebarProps } from '../../components/sidebar/generate-sidebar-props'
import { setPreviousPage } from '../../__data__/states/technical'

export const ObjectsPage = () => {
  const dispatch = useDispatch()
  dispatch(setPreviousPage('/directories'))
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

  const buttonNames: ButtonName[] = getButtonNames(isArchivePage, currentAccountRole, 'object')
  const sidebarProps = generateSidebarProps(currentAccountRole, 'object')
  const [tableData, setTableData] = useState(isArchivePage ? objectsArchiveData : objectsData)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (isArchivePage) {
      refetchObjectsArchiveData()
      setTableData(objectsArchiveData)
    } else {
      refetchObjectsData()
      setTableData(objectsData)
    }
  }, [objectsData, objectsArchiveData, isArchivePage])

  useEffect(() => {
    if ((isArchivePage && objectsArchiveData) || (!isArchivePage && objectsData)) {
      setDataLoaded(true)
    }
  }, [isArchivePage, objectsArchiveData, objectsData])

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

  const hasData = filteredTableData && filteredTableData.length > 0

  return (
    <>
      <EntityTitle isSwitch={true} isSearchField={true} />

      <SideBarContainer>
        {objectsError || objectsLoading || objectsArchiveLoading || objectsArchiveError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {dataLoaded && !hasData ? (
              <Box sx={{ width: '100%' }}>
                {search.searchFilter.length > 0 ? (
                  <p>Ничего не найдено, проверьте введенные данные.</p>
                ) : (
                  <p>Пока тут нет данных.</p>
                )}
              </Box>
            ) : (
              <>
                {hasData && (
                  <SmartTable
                    buttonNames={buttonNames}
                    size={{
                      width: '100%',
                      height: '100%'
                    }}
                    data={filteredTableData}
                  />
                )}
              </>
            )}
            <Sidebar {...sidebarProps} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
