import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllArchiveObjectsQuery, useGetAllObjectsQuery } from '../../__data__/service/object.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useLocation } from 'react-router-dom'
import {useEffect, useMemo, useState} from 'react'
import { Account } from '../../types/api';
import { useSelector } from 'react-redux';
import {getComparator, Order, stableSort} from '../../components/smart-table/sorting';

type ButtonName = 'edit' | 'history' | 'trash'

export const ObjectsPage = () => {
  const location = useLocation()
  const isArchivePage = location.pathname === '/objects/archive'
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
  const [tableData, setTableData] = useState(isArchivePage ? objectsArchiveData : objectsData)

  const sortingField = 'name'

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState(sortingField)

  useEffect(() => {
    if (isArchivePage) {
      refetchObjectsArchiveData()
      setTableData(objectsArchiveData)
    } else {
      refetchObjectsData()
      setTableData(objectsData)
    }
  }, [objectsData, objectsArchiveData, isArchivePage])

  const visibleRows = useMemo(() => {
    if (tableData) {
      return stableSort(tableData, getComparator(order, orderBy));
    } else {
      return [];
    }
  }, [order, orderBy, tableData]);

  let buttonNames: ButtonName[] = []

  if (isArchivePage) {
    buttonNames = ['history']
  } else if (currentAccountRole === 'administrator') {
    buttonNames = ['edit', 'history', 'trash']
  } else if (currentAccountRole === 'manager') {
    buttonNames = ['history']
  }
  return (
      <>
          <EntityTitle isSwitch={true} isSearchField={true} />

          <SideBarContainer>
              {objectsError || objectsLoading || objectsArchiveLoading || objectsArchiveError ? (
                  <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
              ) : (
                  <>
                      {visibleRows ? (
                          <SmartTable
                              buttonNames={buttonNames}
                              size={{
                                  width: '100%',
                                  height: '100%'
                              }}
                              data={visibleRows}
                          />
                      ) : (
                          <></>
                      )}
                      <Sidebar isSearch={true} isObjects={false} isButton={true} />
                  </>
              )}
          </SideBarContainer>
      </>
  )
}
