import { EntityTitle } from '../../components/entity-title'
import { Sidebar } from '../../components/sidebar'
import { SmartTable } from '../../components/smart-table'
import { SideBarContainer } from '../../styles/sidebar'
import { useGetAllAdmissionsMutation } from '../../__data__/service/admission.api'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { Admissions, Objects } from '../../types/api'
import { useEffect, useState } from 'react'
import { FiltersState } from '../../__data__/states/filters'

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

  return (
    <>
      <EntityTitle isSearchField={true} isSwitch={true} />

      <SideBarContainer>
        {admissionsLoading || isError ? (
          <CircularProgress size={'55px'} sx={{ margin: 'auto' }} />
        ) : (
          <>
            {admissionsData && (
              <SmartTable
                buttonNames={['edit', 'history', 'trash']}
                size={{
                  width: '100%',
                  height: '100%'
                }}
                data={filteredData(data)}
              />
            )}
            <Sidebar isSearch={true} isObjects={true} isButton={true} />
          </>
        )}
      </SideBarContainer>
    </>
  )
}
