import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { EntityTitle } from '../../components/entity-title'
import { SearchField } from '../../components/search-field'
import { SmartTable } from '../../components/smart-table'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetAdmissionByIdQuery,
  useGetAdmissionsHistoryByIdQuery,
  useGetRecordOfAdmissionsQuery,
  useUpdateAdmissionStatusMutation
} from '../../__data__/service/admission.api'
import { CanceledDialog } from '../../components/canceled-dialog'
import { useEffect, useMemo, useState } from 'react'
import { sortData } from '../../utils/sorting'
import { useSelector } from 'react-redux'
import { SearchState } from '../../__data__/states/search'
import { dateParser } from '../../utils/date-parser'
import { RECORD_TYPE } from '../../__data__/consts/record'
import { AdmissionsHistory } from '../../types/api'
import { AdmissionTechnical } from '../../__data__/states/admission-technical'
import { EmptyAdmission } from '../../components/admission-messages/is-empty'

export const AdmissionViewPage = () => {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const admissionsArchiveIds = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.admissionsArchive
  )
  const isArchiveAdmission: boolean = admissionsArchiveIds.includes(id ?? '')
  const [updateStatus] = useUpdateAdmissionStatusMutation()
  const { data: RecordsOfAdmissionData, refetch: updateRecordsOfAdmissionData } = useGetRecordOfAdmissionsQuery(
    id ?? ''
  )
  const { data: admissionData, refetch: updateAdmissionData } = useGetAdmissionByIdQuery(id ?? '')
  const { data: historyAdmissionData, refetch: updateHistoryAdmissionData } = useGetAdmissionsHistoryByIdQuery(id ?? '')

  const search = useSelector((state: { search: SearchState }) => state.search)
  const splitSearchQuery = search.searchFilter.split(/[ -./]+/)
  const [archive, setArchive] = useState(false)
  const [data, setData] = useState<AdmissionsHistory[]>(RecordsOfAdmissionData ?? [])

  useEffect(() => {
    if (historyAdmissionData && RecordsOfAdmissionData) {
      setData(archive ? historyAdmissionData : RecordsOfAdmissionData)
    }
  }, [historyAdmissionData, RecordsOfAdmissionData, archive])

  useEffect(() => {
    updateRecordsOfAdmissionData()
    updateAdmissionData()
    updateHistoryAdmissionData()
  }, [id])

  const sortedData: AdmissionsHistory[] = useMemo(() => {
    if (data) {
      const people = data.filter(item => item.last_name !== null)
      const cars = data.filter(item => item.last_name === null)

      const sortedPeople = sortData(people, 'last_name')
      const sortedCars = sortData(cars, 'car_brand')

      return [...sortedCars, ...sortedPeople]
    } else {
      return []
    }
  }, [data])

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
          item.to_date?.includes(queryPart) ||
          item.note?.includes(queryPart)
      )
    }
  })

  return (
    <>
      <EntityTitle
        isSwitch={false}
        isSearchField={false}
        customTitle={admissionData?.code ? `#${admissionData?.code}` : 'Код заявки'}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
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
          <Box sx={{ height: '100%' }}>
            <SearchField />
          </Box>
          <Box>
            <Button
              variant={archive ? 'outlined' : 'contained'}
              disabled={historyAdmissionData && !isArchiveAdmission ? historyAdmissionData.length === 0 : true}
              onClick={() => setArchive(!archive)}
              sx={{ marginRight: '14px' }}
            >
              Архив
            </Button>
            <Button
              variant="contained"
              sx={{ marginRight: '14px' }}
              onClick={() => navigate(`/admissions/${id}`)}
              disabled={isArchiveAdmission}
            >
              Редактировать
            </Button>
            {id && <CanceledDialog admissionId={id} disButton={isArchiveAdmission} />}
            <Button
              variant="contained"
              sx={{ marginLeft: '14px' }}
              onClick={() => {
                if (id) {
                  updateStatus({ admissionId: id, admissionData: { status: 'closed', reason: '' } })
                }
              }}
              disabled={isArchiveAdmission}
            >
              Погасить
            </Button>
          </Box>
        </Box>
        {filteredTableData && filteredTableData.length > 0 ? (
          <SmartTable
            buttonNames={[]}
            size={{
              width: '90%',
              height: '100%'
            }}
            data={filteredTableData}
          />
        ) : (
          search.searchFilter.length === 0 && <EmptyAdmission />
        )}
      </Box>
    </>
  )
}
