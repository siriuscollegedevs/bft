import { Grid, TextField } from '@mui/material'
import { CustomField } from '../../styles/search'
import React from 'react'
import MenuItem from '@mui/material/MenuItem'

export const renderGridItem = (
  label: string,
  name: string,
  data = false,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
) => (
  <>
    {name === 'data' && data ? (
      <>
        <Grid item xs={4} sm={4}>
          <CustomField label="Тип данных" variant="filled" disabled />
        </Grid>
        <Grid item xs={8} sm={6}>
          <TextField name={name} select label="" fullWidth focused variant="outlined" onChange={onChange}>
            <MenuItem value="actual">Актуальные</MenuItem>
            <MenuItem value="archive">Архивные</MenuItem>
          </TextField>
        </Grid>
      </>
    ) : (
      <>
        <Grid item xs={4} sm={4}>
          <CustomField label={label} variant="filled" disabled />
        </Grid>
        <Grid item xs={8} sm={6}>
          <TextField name={name} label="" fullWidth focused variant="outlined" onChange={onChange} />
        </Grid>
      </>
    )}
  </>
)
