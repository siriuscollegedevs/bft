import { Dialog, DialogTitle, DialogActions, Button, DialogContent, DialogContentText } from '@mui/material'

type ToRepayDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  type: string
}

export const ToRepayDialog = ({ open, onClose, onConfirm, type }: ToRepayDialogProps) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Погашение</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Вы уверены, что хотите погасить ${type}?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Отмена
          </Button>
          <Button onClick={onConfirm} color="primary">
            Погасить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
