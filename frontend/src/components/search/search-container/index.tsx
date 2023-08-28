import React, { ReactNode } from 'react'
import { Container, Box, Typography, Grid } from '@mui/material'

type SearchContainerProps = {
  children: ReactNode
}

export const SearchContainer: React.FC<SearchContainerProps> = ({ children }) => {
  return (
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
          {children}
        </Grid>
      </Box>
    </Container>
  )
}
