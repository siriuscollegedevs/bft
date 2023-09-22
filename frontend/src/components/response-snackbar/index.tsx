import { Alert, Snackbar } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TechnicalState, setShowSnackBar } from '../../__data__/states/technical'

export const ResponseSnackBar = () => {
  const showSnackBar = useSelector((state: { technical: TechnicalState }) => state.technical.showSnackBar)
  const requestStatus = useSelector((state: { technical: TechnicalState }) => state.technical.requestStatus)

  const [statusOpen, setStatusOpen] = useState<boolean>(showSnackBar)
  const dispatch = useDispatch()

  const handleClose = () => {
    setStatusOpen(false)
    dispatch(setShowSnackBar(false))
  }

  const handleCloseAlert = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    handleClose()
  }

  useEffect(() => {
    setStatusOpen(showSnackBar)
  }, [showSnackBar])

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={statusOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        key={'top' + 'right'}
      >
        {requestStatus === 'success' ? (
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
            Операция успешна
          </Alert>
        ) : (
          <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
            Произошла ошибка
          </Alert>
        )}
      </Snackbar>
    </>
  )
}
