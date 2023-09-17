import { FormControl, Grid, TextField } from '@mui/material'
import { CustomDefaultButton } from '../../../styles/settings'
import { CustomField } from '../../../styles/search'
import React, { useMemo, useState } from 'react'
import { Account, Objects, SearchOfAdmissions } from '../../../types/api'
import MenuItem from '@mui/material/MenuItem'
import { SideBarContainer } from '../../../styles/sidebar'
import { useSelector } from 'react-redux'
import { ButtonName } from '../../../components/shortcut-buttons'
import { getButtonNames } from '../../../components/shortcut-buttons/button-names'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  useAdmissionsArchiveSearchMutation,
  useAdmissionsSearchMutation
} from '../../../__data__/service/admission.api'
import { RECORD_TYPE } from '../../../__data__/consts/record'
import { SearchTableContent } from '../../../components/search/search-table'
import { SearchContainer } from '../../../components/search/search-container'
import { MenuProps } from '../../../components/sidebar'
import { renderGridItem } from '../renderGrid'
import { SearchDialog } from '../../../components/search-dialog'
import { sortData } from '../../../utils/sorting'

export const AdmissionsAdvancedSearch = () => {
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const [admissionsMutation, { data: admissionsData, isLoading: admissionsDataLoading }] = useAdmissionsSearchMutation()
  const [admissionsArchiveMutation, { data: admissionsArchiveData, isLoading: admissionsArchiveLoading }] =
    useAdmissionsArchiveSearchMutation()
  const [checked, setChecked] = useState('')
  const [objectName, setObjectName] = useState<string[]>([])
  const currentAccountObject = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )

  const isArchive = checked === 'archive'
  const buttonNames: ButtonName[] = getButtonNames(isArchive, currentAccountRole, 'admission')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const initialAdmissionData: SearchOfAdmissions = {
    car_number: '',
    car_brand: '',
    car_model: '',
    objects: [],
    type: '',
    first_name: '',
    surname: '',
    last_name: '',
    from_date: '',
    to_date: '',
    note: ''
  }

  const [admissionData, setAdmissionData] = useState<SearchOfAdmissions>(initialAdmissionData)
  const [showTable, setShowTable] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setAdmissionData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleTypeChange = (event: SelectChangeEvent) => {
    setAdmissionData(prevFields => ({
      ...prevFields,
      type: event.target.value
    }))
  }

  const handleStartDateChange = (event: { target: { value: string } }) => {
    setAdmissionData(prevData => ({
      ...prevData,
      from_date: event.target.value
    }))
  }

  const handleEndDateChange = (event: { target: { value: string } }) => {
    setAdmissionData(prevData => ({
      ...prevData,
      to_date: event.target.value
    }))
  }

  const handleChangeObject = ({ target: { value } }: SelectChangeEvent<typeof objectName>) => {
    setObjectName(typeof value === 'string' ? value.split(',') : value)

    if (Array.isArray(value)) {
      const selectedObjectIds = value.map((selectedName: string) => {
        const selectedObject = currentAccountObject?.find(object => object.name === selectedName)
        return selectedObject ? selectedObject.id : ''
      })

      setAdmissionData(prevFields => ({
        ...prevFields,
        objects: selectedObjectIds.filter((id: string) => id !== '')
      }))
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChecked(event.target.value)
  }

  const isAtLeastOneFieldFilled = (data: SearchOfAdmissions) => {
    for (const key in data) {
      const field = key as keyof SearchOfAdmissions
      const value = data[field]
      if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
        return true
      }
    }
    return false
  }

  const handleSubmit = () => {
    const cleanedAdmissionData: SearchOfAdmissions = {
      ...admissionData,
      car_number: admissionData.car_number.trim(),
      car_brand: admissionData.car_brand.trim(),
      car_model: admissionData.car_model.trim(),
      first_name: admissionData.first_name.trim(),
      surname: admissionData.surname.trim(),
      last_name: admissionData.last_name.trim(),
      note: admissionData.note.trim()
    }

    if (!isAtLeastOneFieldFilled(cleanedAdmissionData)) {
      handleOpenDialog()
      return
    } else {
      if (checked === 'actual' || !checked) {
        admissionsMutation(cleanedAdmissionData)
      } else if (checked === 'archive') {
        admissionsArchiveMutation(cleanedAdmissionData)
      }
      setShowTable(true)
    }
  }

  const sortedData: SearchOfAdmissions[] = useMemo(() => {
    if (admissionsData) {
      const people = admissionsData.filter(item => item.last_name !== null)
      const cars = admissionsData.filter(item => item.last_name === null)

      const sortedPeople = sortData(people, 'last_name')
      const sortedCars = sortData(cars, 'car_brand')

      return [...sortedCars, ...sortedPeople]
    } else {
      return []
    }
  }, [admissionsData])

  const sortedArchiveData: SearchOfAdmissions[] = useMemo(() => {
    if (admissionsArchiveData) {
      const people = admissionsArchiveData.filter(item => item.last_name !== null)
      const cars = admissionsArchiveData.filter(item => item.last_name === null)

      const sortedPeople = sortData(people, 'last_name')
      const sortedCars = sortData(cars, 'car_brand')

      return [...sortedCars, ...sortedPeople]
    } else {
      return []
    }
  }, [admissionsArchiveData])

  return (
    <>
      <SearchContainer>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {renderGridItem('Фамилия', 'last_name', handleInputChange)}
          {renderGridItem('Имя', 'first_name', handleInputChange)}
          {renderGridItem('Отчество', 'surname', handleInputChange)}

          {renderGridItem('Марка', 'car_brand', handleInputChange)}
          {renderGridItem('Модель', 'car_model', handleInputChange)}
          {renderGridItem('Гос.номер', 'car_number', handleInputChange)}

          <Grid item xs={4} sm={4}>
            <CustomField label="Тип" variant="filled" disabled />
          </Grid>
          <Grid item xs={8} sm={6}>
            <FormControl focused fullWidth variant="outlined">
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={admissionData.type}
                onChange={handleTypeChange}
              >
                <MenuItem value={'for_once'}>{RECORD_TYPE.for_once}</MenuItem>
                <MenuItem value={'for_long_time'}>{RECORD_TYPE.for_long_time}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

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
            <CustomField label="Дата(с)" variant="filled" disabled />
          </Grid>
          <Grid item xs={8} sm={6}>
            <TextField
              type="date"
              focused
              fullWidth
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>

          <Grid item xs={4} sm={4}>
            <CustomField label="Дата(по)" variant="filled" disabled />
          </Grid>
          <Grid item xs={8} sm={6}>
            <TextField
              type="date"
              focused
              fullWidth
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>

          {renderGridItem('Примечание', 'note', handleInputChange)}
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
          tableData={sortedData}
          tableArchiveData={sortedArchiveData}
          buttonNames={buttonNames}
          isLoading={admissionsDataLoading}
          isLoadingArchive={admissionsArchiveLoading}
        />
      </SideBarContainer>
      <SearchDialog open={isDialogOpen} onClose={handleCloseDialog} onConfirm={handleCloseDialog} />
    </>
  )
}
