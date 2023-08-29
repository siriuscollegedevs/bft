import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateAdmissionsMutation, useDeleteAdmissionsByIdMutation } from '../../../__data__/service/admission.api'
import { EntityTitle } from '../../../components/entity-title'
import { Objects } from '../../../types/api'
import { EmptyAdmission } from '../../../components/admission-messages/is-empty'
import { useDispatch, useSelector } from 'react-redux'
import {
  AdmissionTechnical,
  setIsCreateFlag,
  setShowObjectsSelector
} from '../../../__data__/states/admission-technical'
import { ObjectsSelector } from '../../../components/objects-selector'

export const AdmissionCreate = () => {
  const [createAdmission, { data: createAdmissionData }] = useCreateAdmissionsMutation()
  const [deleteAdmission] = useDeleteAdmissionsByIdMutation()
  const dispatch = useDispatch()
  const showObjectsSelector = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.showObjectsSelector
  )
  const navigate = useNavigate()
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
      {showObjectsSelector ? <ObjectsSelector onSelectObject={handleObjectSelect} /> : null}
      <EntityTitle
        isSwitch={false}
        isSearchField={false}
        customTitle={createAdmissionData?.code ? `#${createAdmissionData?.code}` : 'Код заявки'}
      />
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
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            marginTop: '14px'
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              dispatch(setIsCreateFlag(true))
              navigate(`/admissions/${createAdmissionData?.id}/record/create`, {
                state: { id: createAdmissionData?.id }
              })
            }}
          >
            Добавить запись
          </Button>
        </Box>
        <Box sx={{ width: '90%', height: '100%' }}>
          <EmptyAdmission />
        </Box>
        <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
          <Button
            variant="contained"
            sx={{ marginRight: '4%' }}
            onClick={() => {
              deleteAdmission(createAdmissionData ? createAdmissionData?.id : '')
              dispatch(setShowObjectsSelector(true))
              navigate('/admissions')
            }}
          >
            Отмена
          </Button>
          <Button variant="contained" disabled>
            Сохранить
          </Button>
        </Box>
      </Box>
    </>
  )
}
