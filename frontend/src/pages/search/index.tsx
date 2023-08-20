import { Box, Container, Grid, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { CustomDefaultButton } from '../../styles/settings'
import { CustomField } from '../../styles/search'
import React, { useState } from 'react'
import { AccountExpandSearch } from '../../types/api'
import { ACCOUNT_ROLES } from '../../__data__/consts/account-roles'
import MenuItem from '@mui/material/MenuItem'
import { SmartTable } from '../../components/smart-table'
import { useAccountArchiveSearchMutation, useAccountSearchMutation } from '../../__data__/service/account.api'
import { SideBarContainer } from '../../styles/sidebar'
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

//TODO сделать с архивными записями и связать с правами
export const AdvancedSearch = () => {
  const [accountsMutation, { data: accountsData }] = useAccountSearchMutation()
  const [accountsArchiveMutation, { data: accountsArchiveData }] = useAccountArchiveSearchMutation()
  const [checked, setChecked] = React.useState(false)

  const initialAccountData: AccountExpandSearch = {
    first_name: '',
    last_name: '',
    role: '',
    surname: '',
    username: ''
  }

  const [accountData, setAccountData] = useState<AccountExpandSearch>(initialAccountData)
  const [showTable, setShowTable] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setAccountData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    accountsMutation(accountData)
    accountsArchiveMutation(accountData)
    setShowTable(true)
  }

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '85px' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            width: '45%'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Расширенный поиск
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid item xs={4} sm={4}>
              <CustomField label="Фамилия" variant="filled" disabled />
            </Grid>
            <Grid item xs={8} sm={6}>
              <TextField
                name="last_name"
                label=""
                fullWidth
                focused
                variant="outlined"
                placeholder="Введите фамилию"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <CustomField label="Имя" variant="filled" disabled />
            </Grid>
            <Grid item xs={8} sm={6}>
              <TextField
                name="first_name"
                label=""
                fullWidth
                focused
                variant="outlined"
                placeholder="Введите имя"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <CustomField label="Отчество" variant="filled" disabled />
            </Grid>
            <Grid item xs={8} sm={6}>
              <TextField
                name="surname"
                label=""
                fullWidth
                focused
                variant="outlined"
                placeholder="Введите отчество"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <CustomField label="Тип учетной записи" variant="filled" disabled />
            </Grid>
            <Grid item xs={8} sm={6}>
              <TextField
                name="role"
                select
                label=""
                fullWidth
                focused
                variant="outlined"
                placeholder="Введите тип"
                onChange={handleInputChange}
              >
                {Object.entries(ACCOUNT_ROLES).map(([roleValue, roleLabel]) => (
                  <MenuItem key={roleValue} value={roleValue}>
                    {roleLabel.ru}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4} sm={4}>
              <CustomField label="Логин" variant="filled" disabled />
            </Grid>
            <Grid item xs={8} sm={6}>
              <TextField
                name="username"
                label=""
                fullWidth
                focused
                variant="outlined"
                placeholder="Введите логин"
                onChange={handleInputChange}
              />
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
        </Box>
      </Container>
      <SideBarContainer sx={{ padding: '50px 0 30px 0', height: '100%' }}>
        {showTable ? (
          accountsData ? (
            <Paper elevation={1} sx={{ width: '100%' }}>
              <FormControlLabel
                  control={
                    <Switch checked={checked} onChange={handleSwitch} inputProps={{ 'aria-label': 'controlled' }} />
                  }
                  label="архив записей"
              />
              <SmartTable
                buttonNames={['edit', 'history', 'trash']}
                size={{
                  width: '100%',
                  height: '100%'
                }}
                data={checked ? accountsArchiveData : accountsData}
              />
            </Paper>
          ) : (
            <Box>
              <p>Ничего не найдено, проверьте введенные данные.</p>
            </Box>
          )
        ) : (
          <></>
        )}
      </SideBarContainer>
    </>
  )
}
