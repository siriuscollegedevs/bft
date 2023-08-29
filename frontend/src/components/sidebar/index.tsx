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
import { useLocation, useNavigate } from 'react-router-dom'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import { useSelector, useDispatch } from 'react-redux'
import { Account, Objects } from '../../types/api'
import { CurrentAccountId, setAccountObjects } from '../../__data__/states/account'
import { useGetAccountToObjectsQuery } from '../../__data__/service/object-account'
import { setObjectNamesFilter } from '../../__data__/states/filters'
import { useEffect } from 'react'

export type SidebarProps = {
  isSearch: boolean
  isObjects: boolean
  isButton: boolean
}

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      width: 250
    }
  }
}

export const Sidebar: React.FC<SidebarProps> = ({ isSearch, isObjects, isButton }) => {
  const [objectName, setObjectName] = React.useState<string[]>([])
  const location = useLocation()
  const isArchive = location.pathname.includes('/archive')
  const searchPath = isArchive ? location.pathname.replace('/archive', '/search') : `${location.pathname}/search`
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentAccountId = useSelector((state: { currentAccount: CurrentAccountId }) => state.currentAccount.id)
  const currentAccountObject = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )

  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)

  const {
    data: currentAccountObjectsData,
    isLoading: currentAccountObjectsLoading,
    isError: currentAccountObjectsError
  } = useGetAccountToObjectsQuery(currentAccountId)

  if (currentAccountObjectsData) {
    dispatch(setAccountObjects(currentAccountObjectsData))
  }

  useEffect(() => {
    dispatch(setObjectNamesFilter([]))
  }, [])

  const handleChange = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
    const selectedObjects = typeof value === 'string' ? value.split(',') : value
    setObjectName(selectedObjects)
    dispatch(setObjectNamesFilter(selectedObjects))
  }

  const handleCreate = () => {
    const pathToCreateMapping: { [key: string]: string } = {
      '/accounts': '/accounts/create',
      '/objects': '/objects/create',
      '/employees': '/employees/create',
      '/admissions': '/admissions/create'
    }
    const currentPath = location.pathname
    const createPath = pathToCreateMapping[currentPath]

    navigate(createPath)
  }

  const shouldHideSidebar = !isSearch && !isObjects && !isButton

  return (
    <Box
      sx={{
        width: '320px',
        display: shouldHideSidebar ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '35px',
            width: '100%'
          }}
        >
          {isSearch && (
            <SidebarButton variant="outlined" color="primary" onClick={() => navigate(searchPath)}>
              Расширенный поиск
            </SidebarButton>
          )}
          {isObjects && (
            <>
              {currentAccountRole === ACCOUNT_ROLES.security_officer.en ? (
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
                  {currentAccountObject[0]?.name}
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
        {isButton && currentAccountRole !== ACCOUNT_ROLES.security_officer.en ? (
          <SidebarButton variant="contained" color="primary" onClick={handleCreate}>
            {location.pathname.startsWith('/admissions') ? 'Создать заявку' : 'Создать запись'}
          </SidebarButton>
        ) : (
          <></>
        )}
      </>
    </Box>
  )
}
