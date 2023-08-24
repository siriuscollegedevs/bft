import { Typography } from '@mui/material'
import { Box } from '@mui/system'

export const EmptyAdmission = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <Typography variant="h6">В заявке нет записей</Typography>
        <Typography variant="body1">Добавьте новые записи, чтобы увидеть их здесь.</Typography>
      </Box>
    </>
  )
}
