import { FormControl, Grid } from '@mui/material'
import { CustomDefaultButton } from '../../../styles/settings'
import { CustomField } from '../../../styles/search'
import React, { useMemo, useState } from 'react'
import { Account, AccountToObjectSearch, Objects } from '../../../types/api'
import MenuItem from '@mui/material/MenuItem'
import { SideBarContainer } from '../../../styles/sidebar'
import { useSelector } from 'react-redux'
import { ButtonName } from '../../../components/shortcut-buttons'
import { getButtonNames } from '../../../components/shortcut-buttons/button-names'
import {
  useAccountToObjectArchiveSearchMutation,
  useAccountToObjectSearchMutation
} from '../../../__data__/service/object-account'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { renderGridItem } from '../renderGrid'
import { SearchContainer } from '../../../components/search/search-container'
import { SearchTableContent } from '../../../components/search/search-table'
import { MenuProps } from '../../../components/sidebar'
import { sortData } from '../../../utils/sorting'
import { SearchDialog } from '../../../components/search-dialog'

export const EmployeeAdvancedSearch = () => {
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const [employeesMutation, { data: employeesData, isLoading: employeesDataLoading }] =
    useAccountToObjectSearchMutation()
  const [employeesArchiveMutation, { data: employeesArchiveData, isLoading: employeesArchiveLoading }] =
    useAccountToObjectArchiveSearchMutation()
  const [checked, setChecked] = useState('')
  const [objectName, setObjectName] = useState<string[]>([])
  const currentAccountObject = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )

  const initialEmployeesData: AccountToObjectSearch = {
    first_name: '',
    last_name: '',
    surname: '',
    objects: []
  }

  const [employeeData, setEmployeeData] = useState<AccountToObjectSearch>(initialEmployeesData)
  const [showTable, setShowTable] = useState(false)
  const isArchive = checked === 'archive'
  const buttonNames: ButtonName[] = getButtonNames(isArchive, currentAccountRole, 'employee')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const isAtLeastOneFieldFilled = (data: AccountToObjectSearch) => {
    for (const key in data) {
      const field = key as keyof AccountToObjectSearch
      const value = data[field]
      if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
        return true
      }
    }
    return false
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEmployeeData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleChangeObject = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
    setObjectName(typeof value === 'string' ? value.split(',') : value)

    if (Array.isArray(value)) {
      const selectedObjectIds = value.map((selectedName: string) => {
        const selectedObject = currentAccountObject?.find(object => object.name === selectedName)
        return selectedObject ? selectedObject.id : ''
      })

      setEmployeeData(prevFields => ({
        ...prevFields,
        objects: selectedObjectIds.filter((id: string) => id !== '')
      }))
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChecked(event.target.value)
  }

  const handleSubmit = () => {
    const cleanedEmployeeData: AccountToObjectSearch = {
      ...employeeData,
      first_name: employeeData.first_name?.trim() || '',
      last_name: employeeData.last_name?.trim() || '',
      surname: employeeData.surname?.trim() || ''
    }

    if (!isAtLeastOneFieldFilled(cleanedEmployeeData)) {
      handleOpenDialog()
      return
    } else {
      if (checked === 'actual' || !checked) {
        employeesMutation(cleanedEmployeeData)
      } else if (checked === 'archive') {
        employeesArchiveMutation(cleanedEmployeeData)
      }
      setShowTable(true)
    }
  }

  const sortedEmployeesData = useMemo(() => {
    if (employeesData) {
      return sortData(employeesData, 'last_name')
    } else {
      return []
    }
  }, [employeesData])

  const sortedEmployeesArchiveData = useMemo(() => {
    if (employeesArchiveData) {
      return sortData(employeesArchiveData, 'last_name')
    } else {
      return []
    }
  }, [employeesArchiveData])

  return (
    <>
      <SearchContainer>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {renderGridItem('Фамилия', 'last_name', handleInputChange)}
          {renderGridItem('Имя', 'first_name', handleInputChange)}
          {renderGridItem('Отчество', 'surname', handleInputChange)}

          <Grid item xs={4} sm={4}>
            <CustomField label="Объекты" variant="filled" disabled />
          </Grid>
          <Grid item xs={8} sm={6}>
            <FormControl focused fullWidth>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={objectName}
                onChange={handleChangeObject}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {currentAccountObject?.map(object => (
                  <MenuItem key={object.id} value={object.name}>
                    <Checkbox checked={objectName.indexOf(object.name) > -1} />
                    <ListItemText primary={object.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sm={4}>
            <CustomField label="Тип данных" variant="filled" disabled />
          </Grid>
          <Grid item xs={8} sm={6}>
            <FormControl fullWidth focused variant="outlined">
              <Select
                value={checked}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="">Актуальные</MenuItem>
                <MenuItem value="archive">Архивные</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <CustomDefaultButton
          variant="contained"
          color="primary"
          style={{ marginTop: '20px', width: '180px' }}
          onClick={handleSubmit}
        >
          Поиск
        </CustomDefaultButton>
      </SearchContainer>
      <SideBarContainer sx={{ padding: '50px 0 30px 0', height: '100%' }}>
        <SearchTableContent
          showTable={showTable}
          checked={checked}
          tableData={sortedEmployeesData}
          tableArchiveData={sortedEmployeesArchiveData}
          buttonNames={buttonNames}
          isLoading={employeesDataLoading}
          isLoadingArchive={employeesArchiveLoading}
        />
      </SideBarContainer>
      <SearchDialog open={isDialogOpen} onClose={handleCloseDialog} onConfirm={handleCloseDialog} />
    </>
  )
}
