import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllAdmissionsMutation, useGetAllArchiveAdmissionsMutation } from '../../__data__/service/admission.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { Account, Admissions, Objects } from '../../types/api'
import { useEffect, useMemo, useState } from 'react'
import { FiltersState } from '../../__data__/states/filters'
import { compareDates } from '../../utils/sorting'
import { SearchState } from '../../__data__/states/search'
import { Box } from '@mui/system'
import { dateParser } from '../../utils/date-parser'
import { useLocation } from 'react-router-dom'
import { getButtonNames } from '../../components/shortcut-buttons/button-names'
import { ButtonName } from '../../components/shortcut-buttons'
import { setAdmissionsArchive } from '../../__data__/states/admission-technical'

export const AdmissionsPage = () => {
  const dispatch = useDispatch()
  const [admissionsMutation, { data: admissionsData, isLoading: admissionsLoading, isError }] =
    useGetAllAdmissionsMutation()
  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const [
    admissionsArchiveMutation,
    { data: admissionsArchiveData, isLoading: admissionsArchiveLoading, isError: admissionsArchiveError }
  ] = useGetAllArchiveAdmissionsMutation()
  const idArray: string[] = currentAccountObjects.map(object => object.id)
  const [hasData, setHasData] = useState(false)
  const [hasArchiveData, setHasArchiveData] = useState(false)
  const [data, setData] = useState<Admissions[]>()
  const filters = useSelector((state: { filters: FiltersState }) => state.filters)
  const location = useLocation()
  const isArchivePage = location.pathname.includes('/archive')
  const buttonNames: ButtonName[] = getButtonNames(isArchivePage, currentAccountRole, 'admission')
  const search = useSelector((state: { search: SearchState }) => state.search)
  const splitSearchQuery = search.searchFilter.split(' ')
  const filteredObjectIds = currentAccountObjects
    .filter(obj => filters.objectNameFilter.includes(obj.name))
    .map(obj => obj.id)

  const filteredData = (data: Admissions[] | undefined) => {
    return data
      ? data?.filter(
          admission =>
            filters.objectNameFilter.length === 0 || admission.object_ids.some(id => filteredObjectIds.includes(id))
        )
      : []
  }

  useEffect(() => {
    setData(isArchivePage ? admissionsArchiveData : admissionsData)
    const admissionsArchive = admissionsArchiveData?.map((object: Admissions) => object.id)
    if (admissionsArchive) {
      dispatch(setAdmissionsArchive(admissionsArchive))
    }
  }, [admissionsData, admissionsArchiveData, filters, isArchivePage])

  useEffect(() => {
    if (idArray.length > 0 && !hasData) {
      if (!isArchivePage) {
        admissionsMutation(idArray)
        setHasData(true)
      }
    }
  }, [idArray, hasData, isArchivePage])

  useEffect(() => {
    if (idArray.length > 0 && !hasArchiveData) {
      if (isArchivePage) {
        admissionsArchiveMutation(idArray)
        setHasArchiveData(true)
      }
    }
  }, [idArray, hasArchiveData, isArchivePage])

  const sortedRows = useMemo(() => {
    if (data) {
      return [...data].sort(compareDates)
    } else {
      return []
    }
  }, [data])

  const filteredTableData = sortedRows?.filter(item => {
    return splitSearchQuery.every(
      queryPart => dateParser(item.timestamp).includes(queryPart) || item.code.includes(queryPart)
    )
  })

  return (
    <>
      <EntityTitle isSearchField={true} isSwitch={true} />

      <SideBarContainer>
        {admissionsLoading || isError || admissionsArchiveLoading || admissionsArchiveError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {filteredTableData && filteredTableData.length > 0 ? (
              <SmartTable
                buttonNames={buttonNames}
                size={{
                  width: '100%',
                  height: '100%'
                }}
                data={filteredData(filteredTableData)}
              />
            ) : (
              <Box sx={{ width: '100%' }}>
                {search.searchFilter.length > 0 ? (
                  <p>Ничего не найдено, проверьте введенные данные.</p>
                ) : (
                  <p>Пока тут нет данных.</p>
                )}
              </Box>
            )}
            <Sidebar isSearch={true} isObjects={true} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
