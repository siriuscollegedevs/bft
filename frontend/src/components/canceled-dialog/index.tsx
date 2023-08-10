import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material'
import { SetStateAction, useState } from 'react'
import { useUpdateAdmissionStatusMutation } from '../../__data__/service/admission.api'

type CanceledDialogProps = {
  admissionId: string
}

export const CanceledDialog = ({ admissionId }: CanceledDialogProps) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)
  const [updateStatus] = useUpdateAdmissionStatusMutation()

  const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
    setInputValue(event.target.value)
    setError(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpdate = () => {
    if (inputValue === '') {
      setError(true)
    } else {
      updateStatus({ admissionId: admissionId, admissionData: { status: 'canceled', reason: 'inputValue' } })
      setOpen(false)
      console.log('Значение:', inputValue)
    }
  }

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Аннулировать
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Аннулирование</DialogTitle>
        <DialogContent>
          <DialogContentText>Укажите причину аннулирования заявки</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Причина аннулирования"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
            error={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleUpdate}>Отправить</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
