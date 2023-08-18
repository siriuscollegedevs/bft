import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllAdmissionsMutation } from '../../__data__/service/admission.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { Admissions, Objects } from '../../types/api'
import { useEffect, useMemo, useState } from 'react'
import { FiltersState } from '../../__data__/states/filters'
import { compareDates } from '../../utils/sorting'
import { SearchState } from '../../__data__/states/search'
import { Box } from '@mui/system'
import { dateParser } from '../../utils/date-parser'

export const AdmissionsPage = () => {
  const [admissionsMutation, { data: admissionsData, isLoading: admissionsLoading, isError }] =
    useGetAllAdmissionsMutation()
  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const idArray: string[] = currentAccountObjects.map(object => object.id)
  const [hasData, setHasData] = useState(false)
  const [data, setData] = useState<Admissions[]>()
  const filters = useSelector((state: { filters: FiltersState }) => state.filters)

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
    setData(filteredData(admissionsData))
  }, [admissionsData, filters])

  useEffect(() => {
    if (idArray.length > 0 && !hasData) {
      admissionsMutation(idArray)
      setHasData(true)
    }
  }, [idArray, hasData])

  const sortedRows = useMemo(() => {
    if (data) {
      return data.sort(compareDates)
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
        {admissionsLoading || isError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {filteredTableData ? (
              filteredTableData.length > 0 ? (
                <SmartTable
                  buttonNames={['edit', 'history', 'trash']}
                  size={{
                    width: '100%',
                    height: '100%'
                  }}
                  data={filteredData(filteredTableData)}
                />
              ) : (
                <Box sx={{ width: '100%' }}>
                  <p>Ничего не найдено, проверьте введенные данные.</p>
                </Box>
              )
            ) : (
              <></>
            )}
            <Sidebar isSearch={true} isObjects={true} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
