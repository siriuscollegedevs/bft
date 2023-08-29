import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material'

type SearchDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}
export const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ padding: '40px' }}>Заполните хотя бы одно поле для поиска.</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Ок
        </Button>
      </DialogActions>
    </Dialog>
  )
}
