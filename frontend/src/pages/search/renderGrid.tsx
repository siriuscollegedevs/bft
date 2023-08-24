import { Grid, TextField } from '@mui/material'
import { CustomField } from '../../styles/search'
import React from 'react'

export const renderGridItem = (label: string, name: string, onChange: (event: any) => void) => (
  <>
    <Grid item xs={4} sm={4}>
      <CustomField label={label} variant="filled" disabled />
    </Grid>
    <Grid item xs={8} sm={6}>
      <TextField name={name} label="" fullWidth focused variant="outlined" onChange={onChange} />
    </Grid>
  </>
)
