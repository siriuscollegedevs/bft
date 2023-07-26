import * as React from 'react'
import Box from '@mui/material/Box'
import ListItemText from '@mui/material/ListItemText'
import { FormControl } from '@mui/material'
import { SidebarButton } from '../../styles/sidebar'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ACCOUNT_ROLES } from '../../consts/account-roles'

type SidebarProps = {
  isSearch: boolean
  isObjects: boolean
  isButton: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isSearch, isObjects, isButton }) => {
  const location = useLocation()
  const [role, setRole] = React.useState('')

  useEffect(() => {
    setRole(ACCOUNT_ROLES.administrator)
  }, [])

  const fundObjectsName = [
    { id: 1, name: 'Наименование 1' },
    { id: 2, name: 'Наименование 2' },
    { id: 3, name: 'Наименование 3' },
    { id: 4, name: 'Наименование 4' },
    { id: 5, name: 'Наименование 5' },
    { id: 6, name: 'Наименование 6' },
    { id: 7, name: 'Наименование 7' }
  ]

  const [objectName, setObjectName] = React.useState<string[]>([])

  const handleChange = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
    setObjectName(typeof value === 'string' ? value.split(',') : value)
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 224,
        width: 250
      }
    }
  }

  return (
    <Box
      sx={{
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '550px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '35px'
        }}
      >
        {isSearch && (
          <SidebarButton variant="outlined" color="primary">
            Расширенный поиск
          </SidebarButton>
        )}
        {isObjects && (
          <>
            {role === ACCOUNT_ROLES.security ? (
              <SidebarButton
                variant="outlined"
                color="primary"
                disableRipple
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                    cursor: 'auto'
                  }
                }}
              >
                Наименование объекта
              </SidebarButton>
            ) : (
              <FormControl
                sx={{
                  m: 0,
                  height: '40px',
                  width: '265px',
                  '& .MuiInputBase-root': {
                    '& fieldset': {
                      borderWidth: '1.5px'
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: '1.5px'
                    }
                  }
                }}
                focused
              >
                <InputLabel id="demo-multiple-checkbox-label">Выбор объекта(-ов)</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={objectName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Выбор объекта(-ов)" />}
                  renderValue={selected => selected.join(', ')}
                  MenuProps={MenuProps}
                  sx={{ height: '45px' }}
                >
                  {fundObjectsName.map(object => (
                    <MenuItem key={object.id} value={object.name}>
                      <Checkbox checked={objectName.indexOf(object.name) > -1} />
                      <ListItemText primary={object.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}
      </Box>
      {isButton && role !== ACCOUNT_ROLES.security ? (
        <SidebarButton variant="contained" color="primary">
          {location.pathname.startsWith('/admissions') ? 'Создать заявку' : 'Создать запись'}
        </SidebarButton>
      ) : (
        <></>
      )}
    </Box>
  )
}
