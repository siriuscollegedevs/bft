import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material'

type DeleteDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}
export const DeleteDialog = ({ open, onClose, onConfirm }: DeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ padding: '40px' }}>Вы уверены, что хотите удалить?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Отмена
        </Button>
        <Button onClick={onConfirm} color="primary">
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
