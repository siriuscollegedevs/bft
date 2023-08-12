import { ButtonGroup, IconButton, Tooltip } from '@mui/material'
import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as HistoryIcon } from '../../assets/history.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'
import { ReactComponent as ToRepayIcon } from '../../assets/toRepay.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeleteAccountByIdMutation } from '../../__data__/service/account.api'
import { useDeleteObjectByIdMutation } from '../../__data__/service/object.api'
import { useDeleteAccountToObjectByIdMutation } from '../../__data__/service/object-account'
import { useEffect } from 'react'

type ButtonName = 'edit' | 'history' | 'trash' | 'cancel' | 'toRepay'

export type ButtonNames = {
  buttonNames: ButtonName[]
}

type IconMappingItem = {
  nameRu: string
  node: React.ReactNode
}

type IconMapping = {
  [key in ButtonName]: IconMappingItem
}

const iconMapping: IconMapping = {
  edit: {
    nameRu: 'Редактирование',
    node: <EditIcon />
  },
  history: {
    nameRu: 'История',
    node: <HistoryIcon />
  },
  trash: {
    nameRu: 'Удаление',
    node: <TrashIcon />
  },
  cancel: {
    nameRu: 'Аннулирование',
    node: <CancelIcon />
  },
  toRepay: {
    nameRu: 'Погашение',
    node: <ToRepayIcon />
  }
}

export const ShortcutButtons = ({ buttonNames, id }: ButtonNames & { id: string }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [deleteAccountMutation, { isLoading: deleteLoading, isError: deleteError, isSuccess: deleteSuccess }] =
    useDeleteAccountByIdMutation()
  const [
    deleteObjectMutation,
    { isLoading: deleteObjectLoading, isError: deleteObjectError, isSuccess: deleteObjectSuccess }
  ] = useDeleteObjectByIdMutation()
  const [
    deleteEmployeesMutation,
    { isLoading: deleteEmployeesLoading, isError: deleteEmployeesError, isSuccess: deleteEmployeesSuccess }
  ] = useDeleteAccountToObjectByIdMutation()

  const handleClickEdit = () => {
    navigate(`${location.pathname}/${id}`)
  }

  const handleDelete = async () => {
    try {
      let deleteMutation
      if (location.pathname.includes('/objects')) {
        deleteMutation = deleteObjectMutation
      } else if (location.pathname.includes('/accounts')) {
        deleteMutation = deleteAccountMutation
      } else if (location.pathname.includes('/employees')) {
        deleteMutation = deleteEmployeesMutation
      } else {
        console.error('Unknown object type')
        return
      }
      await deleteMutation(id)
    } catch (error) {
      console.error(error)
    }
  }

  //TODO потом естественно это все надо красиво выводить, но пока логи

  useEffect(() => {
    if (deleteSuccess || deleteObjectSuccess || deleteEmployeesSuccess) {
      console.log('Успешно удалено')
    } else {
      console.log('Ошибка')
    }
  }, [deleteSuccess, deleteObjectSuccess, deleteEmployeesSuccess])

  if (buttonNames.length === 0 || buttonNames.length > 3) {
    return <h6>Error</h6>
  }

  return (
    <ButtonGroup>
      {buttonNames.map(title => (
        <Tooltip title={iconMapping[title].nameRu} placement="top" key={title}>
          <IconButton
            disableRipple={true}
            sx={{
              padding: 0,
              marginLeft: '5px',
              ':first-child': {
                marginLeft: '0px'
              },
              height: '35px',
              width: '35px'
            }}
            onClick={title === 'edit' ? handleClickEdit : title === 'trash' ? handleDelete : undefined}
          >
            {iconMapping[title].node}
          </IconButton>
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}
