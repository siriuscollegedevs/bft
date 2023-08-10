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
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import { useSelector, useDispatch } from 'react-redux'
import { Account } from '../../types/api'
import { CurrentAccountId, setAccountObjects } from '../../states/account'
import { useGetAccountToObjectsQuery } from '../../__data__/service/object-account'
import CircularProgress from '@mui/material/CircularProgress'
import { setObjectNamesFilter } from '../../states/filters'

type SidebarProps = {
  isSearch: boolean
  isObjects: boolean
  isButton: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isSearch, isObjects, isButton }) => {
  const [objectName, setObjectName] = React.useState<string[]>([])
  const location = useLocation()
  const dispatch = useDispatch()
  const currentAccountId = useSelector((state: { currentAccount: CurrentAccountId }) => state.currentAccount.id)
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const {
    data: currentAccountObjectsData,
    isLoading: currentAccountObjectsLoading,
    isError: currentAccountObjectsError
  } = useGetAccountToObjectsQuery(currentAccountId)

  if (currentAccountObjectsData) {
    dispatch(setAccountObjects(currentAccountObjectsData))
  }

  const handleChange = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
    const selectedObjects = typeof value === 'string' ? value.split(',') : value
    setObjectName(selectedObjects)
    dispatch(setObjectNamesFilter(selectedObjects))
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
        alignItems: 'center'
      }}
    >
      {currentAccountObjectsLoading || currentAccountObjectsError ? (
        <>
          <CircularProgress size={'100px'} />
        </>
      ) : (
        <>
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
                {currentAccountRole === ACCOUNT_ROLES.security ? (
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
                      {currentAccountObjectsData?.map(object => (
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
          {isButton && currentAccountRole !== ACCOUNT_ROLES.security ? (
            <SidebarButton variant="contained" color="primary">
              {location.pathname.startsWith('/admissions') ? 'Создать заявку' : 'Создать запись'}
            </SidebarButton>
          ) : (
            <></>
          )}
        </>
      )}
    </Box>
  )
}
