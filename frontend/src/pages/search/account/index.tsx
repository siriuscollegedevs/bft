import { FormControl, Grid, TextField } from '@mui/material'
import { CustomDefaultButton } from '../../../styles/settings'
import { CustomField } from '../../../styles/search'
import React, { useMemo, useState } from 'react'
import { Account, AccountExpandSearch } from '../../../types/api'
import { ACCOUNT_ROLES } from '../../../__data__/consts/account-roles'
import MenuItem from '@mui/material/MenuItem'
import { useAccountArchiveSearchMutation, useAccountSearchMutation } from '../../../__data__/service/account.api'
import { SideBarContainer } from '../../../styles/sidebar'
import { useSelector } from 'react-redux'
import { ButtonName } from '../../../components/shortcut-buttons'
import { getButtonNames } from '../../../components/shortcut-buttons/button-names'
import { renderGridItem } from '../renderGrid'
import { SearchTableContent } from '../../../components/search/search-table'
import { SearchContainer } from '../../../components/search/search-container'
import { sortData } from '../../../utils/sorting'
import { SearchDialog } from '../../../components/search-dialog'
import Select, { SelectChangeEvent } from '@mui/material/Select'

export const AccountAdvancedSearch = () => {
  const currentAccountRole = useSelector((state: { currentAccount: Account }) => state.currentAccount.role)
  const [accountsMutation, { data: accountsData, isLoading: accountDataLoading }] = useAccountSearchMutation()
  const [accountsArchiveMutation, { data: accountsArchiveData, isLoading: accountArchiveLoading }] =
    useAccountArchiveSearchMutation()
  const [checked, setChecked] = useState('')

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const initialAccountData: AccountExpandSearch = {
    first_name: '',
    last_name: '',
    role: '',
    surname: '',
    username: ''
  }

  const [accountData, setAccountData] = useState<AccountExpandSearch>(initialAccountData)
  const [showTable, setShowTable] = useState(false)
  const isArchive = checked === 'archive'
  const buttonNames: ButtonName[] = getButtonNames(isArchive, currentAccountRole, 'account')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setAccountData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChecked(event.target.value)
  }

  const isAtLeastOneFieldFilled = (data: AccountExpandSearch) => {
    for (const key in data) {
      const field = key as keyof AccountExpandSearch
      if (data[field]) {
        return true
      }
    }
    return false
  }

  const handleSubmit = () => {
    const cleanedAccountData: AccountExpandSearch = { ...accountData }

    for (const key in cleanedAccountData) {
      if (typeof cleanedAccountData[key as keyof AccountExpandSearch] === 'string') {
        cleanedAccountData[key as keyof AccountExpandSearch] = (
          cleanedAccountData[key as keyof AccountExpandSearch] as string
        ).trim()
      }
    }

    if (!isAtLeastOneFieldFilled(cleanedAccountData)) {
      handleOpenDialog()
      return
    } else {
      if (checked === 'actual' || !checked) {
        accountsMutation(cleanedAccountData)
      } else if (checked === 'archive') {
        accountsArchiveMutation(cleanedAccountData)
      }
      setShowTable(true)
    }
  }

  const sortedAccountsData = useMemo(() => {
    if (accountsData) {
      return sortData(accountsData, 'last_name')
    } else {
      return []
    }
  }, [accountsData])

  const sortedAccountsArchiveData = useMemo(() => {
    if (accountsArchiveData) {
      return sortData(accountsArchiveData, 'last_name')
    } else {
      return []
    }
  }, [accountsArchiveData])

  return (
    <>
      <SearchContainer>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {renderGridItem('Фамилия', 'last_name', handleInputChange)}
          {renderGridItem('Имя', 'first_name', handleInputChange)}
          {renderGridItem('Отчество', 'surname', handleInputChange)}

          <Grid item xs={4} sm={4}>
            <CustomField label="Тип учетной записи" variant="filled" disabled />
          </Grid>
          <Grid item xs={8} sm={6}>
            <TextField name="role" select label="" fullWidth focused variant="outlined" onChange={handleInputChange}>
              {Object.entries(ACCOUNT_ROLES).map(([roleValue, roleLabel]) => (
                <MenuItem key={roleValue} value={roleValue}>
                  {roleLabel.ru}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {renderGridItem('Логин', 'username', handleInputChange)}

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
                <MenuItem value={'archive'}>Архивные</MenuItem>
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
          tableData={sortedAccountsData}
          tableArchiveData={sortedAccountsArchiveData}
          buttonNames={buttonNames}
          isLoading={accountDataLoading}
          isLoadingArchive={accountArchiveLoading}
        />
      </SideBarContainer>
      <SearchDialog open={isDialogOpen} onClose={handleCloseDialog} onConfirm={handleCloseDialog} />
    </>
  )
}
