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
  SelectChangeEvent
} from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Objects } from '../../types/api'
import { setShowObjectsSelector } from '../../__data__/states/admission-technical'

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
            Выберите объекты, для которых хотите создать заявку. Учтите, что в будущем этот выбор изменить нельзя.
          </DialogContentText>
          <FormControl fullWidth>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack} variant="outlined">
            Отмена
          </Button>
          <Button onClick={handleNext} variant="outlined" disabled={!hasSelected}>
            Продолжить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
