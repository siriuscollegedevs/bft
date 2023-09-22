import { Typography } from '@mui/material'
import { Box } from '@mui/system'

type EmptyAdmissionProps = {
  admission?: boolean
}

export const EmptyAdmission = ({ admission }: EmptyAdmissionProps) => {
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
        {admission ? (
          <>
            <Typography variant="h6">Для закрепленных за вами объектах нет заявок</Typography>
            <Typography variant="body1">Добавьте новые заявки, чтобы увидеть их здесь.</Typography>
          </>
        ) : (
          <>
            <Typography variant="h6">В заявке нет записей</Typography>
            <Typography variant="body1">Добавьте новые записи, чтобы увидеть их здесь.</Typography>
          </>
        )}
      </Box>
    </>
  )
}
