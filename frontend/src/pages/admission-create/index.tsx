import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { RECORD_TYPE } from '../../__data__/consts/record'
import {
  useUpdateAdmissionStatusMutation,
  useGetRecordOfAdmissionsQuery,
  useCreateAdmissionsMutation
} from '../../__data__/service/admission.api'
import { SearchState } from '../../__data__/states/search'
import { CanceledDialog } from '../../components/canceled-dialog'
import { EntityTitle } from '../../components/entity-title'
import { SearchField } from '../../components/search-field'
import { SmartTable } from '../../components/smart-table'
import { AdmissionsHistory, Objects } from '../../types/api'
import { dateParser } from '../../utils/date-parser'
import { sortData } from '../../utils/sorting'
import { ObjectsSelector } from './objects-selector'

export const AdmissionCreate = () => {
  const [createAdmission, { data: createAdmissionData }] = useCreateAdmissionsMutation()
  const { id } = useParams<string>()
  const [admissionCode, setAdmissionCode] = useState<number | string>(createAdmissionData?.timestamp || 'Код заявки')
  const navigate = useNavigate()
  const [updateStatus] = useUpdateAdmissionStatusMutation()
  const { data: RecordsOfAdmissionData, refetch: RecordsOfAdmissionRefetchData } = useGetRecordOfAdmissionsQuery(
    id ?? ''
  )
  const search = useSelector((state: { search: SearchState }) => state.search)
  const splitSearchQuery = search.searchFilter.split(' ')
  const [selectedObject, setSelectedObject] = useState<string[]>([])

  const handleObjectSelect = (selected: Objects[]) => {
    setSelectedObject(selected.map(obj => obj.id))
  }

  useEffect(() => {
    if (selectedObject.length > 0) {
      createAdmission(selectedObject)
    }
  }, [selectedObject])

  useEffect(() => {
    if (createAdmissionData) {
      setAdmissionCode(createAdmissionData?.timestamp)
    }
  }, [])

  const sortedData: AdmissionsHistory[] = useMemo(() => {
    if (RecordsOfAdmissionData) {
      const people = RecordsOfAdmissionData.filter(item => item.last_name !== null)
      const cars = RecordsOfAdmissionData.filter(item => item.last_name === null)

      const sortedPeople = sortData(people, 'last_name')
      const sortedCars = sortData(cars, 'car_brand')

      return [...sortedPeople, ...sortedCars]
    } else {
      return []
    }
  }, [RecordsOfAdmissionData])

  const filteredTableData: AdmissionsHistory[] = sortedData?.filter(item => {
    if (item !== null) {
      return splitSearchQuery.every(
        queryPart =>
          dateParser(item.timestamp).includes(queryPart) ||
          (RECORD_TYPE as Record<string, string>)[item.type].toLowerCase().startsWith(queryPart.toLowerCase()) ||
          item.car_number?.toLowerCase().includes(queryPart.toLowerCase()) ||
          item.car_brand?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
          item.car_model?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
          item.first_name?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
          item.surname?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
          item.last_name?.toLowerCase().startsWith(queryPart.toLowerCase()) ||
          item.from_date?.includes(queryPart) ||
          item.to_date?.includes(queryPart)
      )
    }
  })

  return (
    <>
      <ObjectsSelector onSelectObject={handleObjectSelect} />
      <EntityTitle isSwitch={false} isSearchField={false} customTitle={admissionCode} />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          height: '70vh'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            marginBottom: '30px'
          }}
        >
          <Box>
            <Button
              variant="contained"
              sx={{ marginRight: '14px' }}
              onClick={() => navigate(`/admissions/${id}/record/create`)}
            >
              Добавить запись
            </Button>
          </Box>
          <Box>
            {id && <CanceledDialog admissionId={id} />}
            <Button
              variant="contained"
              sx={{ marginLeft: '14px' }}
              onClick={() => {
                if (id) {
                  updateStatus({ admissionId: id, admissionData: { status: 'closed', reason: '' } })
                }
              }}
            >
              Погасить
            </Button>
          </Box>
        </Box>
        {filteredTableData ? (
          filteredTableData.length > 0 ? (
            <SmartTable
              buttonNames={[]}
              size={{
                width: '90%',
                height: '100%'
              }}
              data={filteredTableData}
            />
          ) : (
            <Box sx={{ width: '90%', height: '100%' }}>
              <p>Ничего не найдено, проверьте введенные данные.</p>
            </Box>
          )
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}
