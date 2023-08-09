import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { EntityTitle } from '../../components/entity-title'
import { SearchField } from '../../components/search-field'
import { SmartTable } from '../../components/smart-table'
import { useNavigate } from 'react-router-dom'

export const AdmissionViewPage = () => {
  const navigate = useNavigate()
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
            <Button variant="contained" sx={{ marginRight: '14px' }} onClick={() => navigate('')}>
              Добавить запись
            </Button>
            <Button variant="contained" sx={{ marginRight: '14px' }}>
              Редактировать
            </Button>
            <Button variant="contained">Аннулировать</Button>
            <Button variant="contained" sx={{ marginLeft: '14px' }}>
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
