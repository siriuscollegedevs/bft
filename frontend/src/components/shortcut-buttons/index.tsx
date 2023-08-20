import { ButtonGroup, IconButton, Tooltip } from '@mui/material'
import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as HistoryIcon } from '../../assets/history.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'
import { ReactComponent as ToRepayIcon } from '../../assets/toRepay.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeleteAccountByIdMutation, useGetAllAccountsQuery } from '../../__data__/service/account.api'
import { useDeleteObjectByIdMutation, useGetAllObjectsQuery } from '../../__data__/service/object.api'
import {
  useDeleteAccountToObjectByIdMutation,
  useGetAllAccountToObjectQuery
} from '../../__data__/service/object-account'
import { useState } from 'react'
import { DeleteDialog } from '../delete-dialog'

export type ButtonName = 'edit' | 'history' | 'trash' | 'cancel' | 'toRepay'

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

  const [deleteAccountMutation] = useDeleteAccountByIdMutation()
  const [deleteObjectMutation] = useDeleteObjectByIdMutation()
  const [deleteEmployeesMutation] = useDeleteAccountToObjectByIdMutation()
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { refetch: refetchAccountData } = useGetAllAccountsQuery()
  const { refetch: refetchObjectsData } = useGetAllObjectsQuery()
  const { refetch: refetchEmployeesData } = useGetAllAccountToObjectQuery()

  const handleButtonClick = (title: ButtonName) => {
    if (title === 'edit') {
      navigate(`${location.pathname}/${id}`)
    } else if (title === 'trash') {
      handleDelete()
    } else if (title === 'history') {
      const newPath = location.pathname.includes('/archive')
        ? location.pathname.replace('/archive', '')
        : location.pathname
      navigate(`${newPath}/history/${id}`)
    }
  }

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleDelete = () => {
    openDeleteDialog()
  }

  const handleDeleteConfirmed = async () => {
    let deleteMutation
    let refetchData
    if (location.pathname.includes('/objects')) {
      deleteMutation = deleteObjectMutation
      refetchData = refetchObjectsData
    } else if (location.pathname.includes('/accounts')) {
      deleteMutation = deleteAccountMutation
      refetchData = refetchAccountData
    } else if (location.pathname.includes('/employees')) {
      deleteMutation = deleteEmployeesMutation
      refetchData = refetchEmployeesData
    } else {
      console.error('Unknown object type')
      return
    }

    await deleteMutation(id)
    closeDeleteDialog()
    await refetchData()
  }

  if (buttonNames.length > 3) {
    return <h6>Error</h6>
  }

  return (
    <>
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
              onClick={() => handleButtonClick(title)}
            >
              {iconMapping[title].node}
            </IconButton>
          </Tooltip>
        ))}
      </ButtonGroup>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          closeDeleteDialog()
        }}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  )
}
