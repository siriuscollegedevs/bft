import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { EntityTitle } from '../../components/entity-title'
import { SearchField } from '../../components/search-field'
import { SmartTable } from '../../components/smart-table'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetRecordOfAdmissionsQuery, useUpdateAdmissionStatusMutation } from '../../__data__/service/admission.api'
import { CanceledDialog } from '../../components/canceled-dialog'
import { useMemo } from 'react'
import { sortData } from '../../components/smart-table/sorting'

export const AdmissionViewPage = () => {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const [updateStatus] = useUpdateAdmissionStatusMutation()
  const { data: RecordsOfAdmissionData } = useGetRecordOfAdmissionsQuery(id ?? '')

  const sortedData = useMemo(() => {
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
            <SearchField />
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{ marginRight: '14px' }}
              onClick={() => navigate(`/admissions/${id}/entries/create`)}
            >
              Добавить запись
            </Button>
            <Button variant="contained" sx={{ marginRight: '14px' }} onClick={() => navigate(`/admissions/${id}`)}>
              Редактировать
            </Button>
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
        {RecordsOfAdmissionData ? (
          <SmartTable
            buttonNames={[]}
            size={{
              width: '90%',
              height: '100%'
            }}
            data={sortedData}
          />
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}
