import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateAdmissionsMutation } from '../../../__data__/service/admission.api'
import { EntityTitle } from '../../../components/entity-title'
import { Objects } from '../../../types/api'
import { EmptyAdmission } from '../../../components/admission-messages/is-empty'
import { useDispatch, useSelector } from 'react-redux'
import {
  AdmissionTechnical,
  setIdCreatedAdmissions,
  setIsCreateFlag
} from '../../../__data__/states/admission-technical'
import { ObjectsSelector } from '../../../components/objects-selector'
import { useCancelCreateAdmission } from '../../../hooks/cuncelCreate'
import { setPreviousPage } from '../../../__data__/states/technical'

export const AdmissionCreate = () => {
  const [createAdmission, { data: createAdmissionData }] = useCreateAdmissionsMutation()
  const dispatch = useDispatch()
  dispatch(setPreviousPage('/admissions'))
  const { cancelCreateAdmission } = useCancelCreateAdmission()
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

  useEffect(() => {
    dispatch(setIdCreatedAdmissions(createAdmissionData?.id ?? '/'))
  }, [createAdmissionData])

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
              cancelCreateAdmission(createAdmissionData ? createAdmissionData?.id : '')
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
