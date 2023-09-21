import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { RECORD_TYPE } from '../../../__data__/consts/record'
import { useGetRecordOfAdmissionsQuery, useDeleteAdmissionsByIdMutation } from '../../../__data__/service/admission.api'
import { SearchState } from '../../../__data__/states/search'
import { EntityTitle } from '../../../components/entity-title'
import { SmartTable } from '../../../components/smart-table'
import { Account, AdmissionsHistory } from '../../../types/api'
import { dateParser } from '../../../utils/date-parser'
import { sortData } from '../../../utils/sorting'
import {
  AdmissionTechnical,
  clearAdmissionTechnical,
  setShowObjectsSelector
} from '../../../__data__/states/admission-technical'
import { useDeleteMultipleRecordsMutation } from '../../../__data__/service/record.api'
import { ButtonName } from '../../../components/shortcut-buttons'
import { getButtonNames } from '../../../components/shortcut-buttons/button-names'
import { setPreviousPage } from '../../../__data__/states/technical'
import { EmptyAdmission } from '../../../components/admission-messages/is-empty'

export const AdmissionViewEdit = () => {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isCreateFlag = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.isCreateFlag
  )
  !isCreateFlag ? dispatch(setPreviousPage(`/admissions/view/${id}`)) : null
  const { data: recordsOfAdmissionData, refetch: updateRecordsOfAdmissionData } = useGetRecordOfAdmissionsQuery(
    id ?? ''
  )
  const location = useLocation()
  const isArchivePage = location.pathname.includes('/archive')
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const buttonNames: ButtonName[] = getButtonNames(isArchivePage, currentAccountRole, 'admission')
  const [deleteAdmission] = useDeleteAdmissionsByIdMutation()
  const [deleteMultipleRecords] = useDeleteMultipleRecordsMutation()
  const search = useSelector((state: { search: SearchState }) => state.search)
  const deleteMultipleRecordsIds = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.idsOfCreatedAdmissions
  )
  const splitSearchQuery = search.searchFilter.split(' ')

  useEffect(() => {
    updateRecordsOfAdmissionData()
  }, [id])

  const sortedData: AdmissionsHistory[] = useMemo(() => {
    if (recordsOfAdmissionData) {
      const people = recordsOfAdmissionData.filter(item => item.last_name !== null)
      const cars = recordsOfAdmissionData.filter(item => item.last_name === null)

      const sortedPeople = sortData(people, 'last_name')
      const sortedCars = sortData(cars, 'car_brand')

      return [...sortedCars, ...sortedPeople]
    } else {
      return []
    }
  }, [recordsOfAdmissionData])

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
      <EntityTitle isSwitch={false} isSearchField={false} />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          gap: '20px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            marginTop: '14px'
          }}
        >
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/admissions/${id}/record/create`, {
                state: { create: true, id: id }
              })
            }
          >
            Добавить запись
          </Button>
        </Box>
        <Box sx={{ width: '90%', height: '59vh', display: 'flex', justifyContent: 'center', mt: '15px' }}>
          {filteredTableData && filteredTableData.length > 0 ? (
            <SmartTable
              buttonNames={buttonNames}
              size={{
                width: '100%',
                height: '100%'
              }}
              data={filteredTableData}
            />
          ) : (
            <Box sx={{ width: '90%', height: '100%' }}>
              <EmptyAdmission />
            </Box>
          )}
        </Box>
        <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
          <Button
            variant="contained"
            sx={{ marginRight: '4%' }}
            onClick={() => {
              if (isCreateFlag) {
                deleteAdmission(id ? id : '')
              } else {
                deleteMultipleRecords(deleteMultipleRecordsIds)
              }
              dispatch(setShowObjectsSelector(true))
              navigate('/admissions')
            }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            disabled={recordsOfAdmissionData ? recordsOfAdmissionData.length === 0 : true}
            onClick={() => {
              dispatch(clearAdmissionTechnical())
              navigate('/admissions')
            }}
          >
            Сохранить
          </Button>
        </Box>
      </Box>
    </>
  )
}
