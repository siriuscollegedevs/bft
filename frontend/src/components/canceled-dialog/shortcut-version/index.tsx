import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material'
import { SetStateAction } from 'react'

type ToRepayDialogPropsShortcutVersion = {
  open: boolean
  onClose: () => void
  onChange: (event: { target: { value: SetStateAction<string> } }) => void
  error: boolean
  onConfirm: () => void
  type: string
}

export const CanceledDialogShortcutVersion = ({
  open,
  onClose,
  onChange,
  error,
  onConfirm,
  type
}: ToRepayDialogPropsShortcutVersion) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Аннулирование</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Укажите причину аннулирования ${type}`}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Причина аннулирования"
            fullWidth
            variant="standard"
            onChange={e => onChange(e)}
            error={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={onConfirm}>Отправить</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
