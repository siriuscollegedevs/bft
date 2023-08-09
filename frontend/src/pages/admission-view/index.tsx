import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { EntityTitle } from '../../components/entity-title'
import { SearchField } from '../../components/search-field'
import { SmartTable } from '../../components/smart-table'
import { useNavigate, useParams } from 'react-router-dom'
import { useUpdateAdmissionStatusMutation } from '../../__data__/service/admission.api'
import { CanceledDialog } from '../../components/canceled-dialog'

export const AdmissionViewPage = () => {
  const { id } = useParams<string>()
  const navigate = useNavigate()
  const [updateStatus] = useUpdateAdmissionStatusMutation()

  return (
    <>
      <EntityTitle isSwitch={false} isSearchField={false} />
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '1148px',
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
        <SmartTable
          buttonNames={[]}
          size={{
            width: '1148px',
            height: '540px'
          }}
        />
      </Box>
    </>
  )
}
