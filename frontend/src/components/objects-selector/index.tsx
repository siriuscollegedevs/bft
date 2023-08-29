import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  CircularProgress,
  Input
} from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Objects } from '../../types/api'
import { setIsCreateFlag, setShowObjectsSelector } from '../../__data__/states/admission-technical'
import { useCreateAdmissionVieExcelMutation } from '../../__data__/service/admission.api'

type ObjectsSelectorProps = {
  onSelectObject: (selected: Objects[]) => void
}

export const ObjectsSelector: React.FC<ObjectsSelectorProps> = ({ onSelectObject }) => {
  const [open, setOpen] = useState(true)
  const [hasSelected, setHasSelected] = useState(false)
  const [selectedObjects, setSelectedObjects] = useState<Objects[]>([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const [uploadFile, { isError: uploadFileError, isLoading: uploadFileLoading }] = useCreateAdmissionVieExcelMutation()
  const [uploading, setUploading] = useState(false)
  const [uploadingError, setUploadingError] = useState(false)

  const handleBack = () => {
    setOpen(false)
    navigate('/admissions')
  }

  const handleNext = () => {
    setOpen(false)
    onSelectObject(selectedObjects)
    dispatch(setShowObjectsSelector(false))
  }

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedObjectNames = event.target.value as string[]
    const selectedObjects = currentAccountObjects.filter(obj => selectedObjectNames.includes(obj.name))
    setSelectedObjects(selectedObjects)
    setHasSelected(selectedObjects.length > 0)
  }

  const hendlerExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('excel_file', file)
        console.log(formData)
        const uploadFileRespons = await uploadFile(formData)
        setUploading(false)
        if ('data' in uploadFileRespons && !uploadFileError) {
          setUploadingError(false)
          dispatch(setIsCreateFlag(true))
          navigate(`/admissions/${uploadFileRespons.data?.request_id}`, {
            state: { create: true }
          })
        } else {
          setUploadingError(true)
        }
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error)
        setUploading(false)
      }
    }
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Выбор объектов</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              marginBottom: '4%'
            }}
          >
            <Typography variant="body1">
              Выберите объекты, для которых хотите создать заявку. Учтите, что в будущем этот выбор изменить нельзя.
            </Typography>
          </DialogContentText>
          <FormControl
            fullWidth
            sx={{
              marginBottom: '4%'
            }}
          >
            <InputLabel id="object-label-id">Объекты</InputLabel>
            <Select
              labelId="object-label-id"
              value={selectedObjects.map(obj => obj.name)}
              multiple
              label="Объекты"
              onChange={handleChange}
            >
              {currentAccountObjects.map(accountObject => (
                <MenuItem key={accountObject.id} value={accountObject.name}>
                  {accountObject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogContentText
            sx={{
              marginBottom: '4%'
            }}
          >
            <Typography variant="body1" align="center">
              или
            </Typography>
          </DialogContentText>
          <FormControl
            fullWidth
            sx={{
              marginBottom: '2%'
            }}
          >
            <Button
              variant="contained"
              component="label"
              sx={{ height: '46px' }}
              disabled={hasSelected}
              color={uploadingError ? 'error' : 'primary'}
            >
              {uploading || uploadFileLoading ? <CircularProgress size={20} color="inherit" /> : 'Импортировать excel'}
              <input type="file" accept=".xlsx, .xls" hidden onChange={hendlerExcel} />
            </Button>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack} variant="contained">
            Отмена
          </Button>
          <Button onClick={handleNext} variant="contained" disabled={!hasSelected}>
            Продолжить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
