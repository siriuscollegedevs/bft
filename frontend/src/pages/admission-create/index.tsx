import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  useUpdateAdmissionStatusMutation,
  useGetRecordOfAdmissionsQuery,
  useCreateAdmissionsMutation
} from '../../__data__/service/admission.api'
import { SearchState } from '../../__data__/states/search'
import { CanceledDialog } from '../../components/canceled-dialog'
import { EntityTitle } from '../../components/entity-title'
import { Objects } from '../../types/api'
import { ObjectsSelector } from './objects-selector'
import { AdmissionTechnical } from '../../__data__/states/admission-technical'
import { EmptyAdmission } from '../../components/admission-messages/is-empty'

export const AdmissionCreate = () => {
  const [createAdmission, { data: createAdmissionData }] = useCreateAdmissionsMutation()
  const navigate = useNavigate()
  const shouldDisplayObjectSelector = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.showObjectsSelector
  )
  const [updateStatus] = useUpdateAdmissionStatusMutation()
  const { data: RecordsOfAdmissionData, refetch: RecordsOfAdmissionRefetchData } = useGetRecordOfAdmissionsQuery(
    createAdmissionData?.id ?? ''
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

  return (
    <>
      <ObjectsSelector onSelectObject={handleObjectSelect} />
      <EntityTitle isSwitch={false} isSearchField={false} customTitle={createAdmissionData?.code || 'Код заявки'} />
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
              onClick={() =>
                navigate(`/admissions/${createAdmissionData?.id}/record/create`, {
                  state: { showObjectSelector: true }
                })
              }
            >
              Добавить запись
            </Button>
          </Box>
          <Box>
            {createAdmissionData?.id && <CanceledDialog admissionId={createAdmissionData?.id} />}
            <Button
              variant="contained"
              sx={{ marginLeft: '14px' }}
              onClick={() => {
                if (createAdmissionData?.id) {
                  updateStatus({
                    admissionId: createAdmissionData?.id,
                    admissionData: { status: 'closed', reason: '' }
                  })
                }
              }}
            >
              Погасить
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: '90%', height: '100%' }}>
          <EmptyAdmission />
        </Box>
      </Box>
    </>
  )
}
