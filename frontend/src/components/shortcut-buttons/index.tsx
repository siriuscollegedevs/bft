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
import { ToRepayDialog } from '../to-repay-dialog'
import { useUpdateAdmissionStatusMutation, useGetAllAdmissionsMutation } from '../../__data__/service/admission.api'
import { useChangeRecordStatusByIdMutation } from '../../__data__/service/record.api'
import { useSelector } from 'react-redux'
import { Objects } from '../../types/api'

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

  const [updateAdmissionStatus] = useUpdateAdmissionStatusMutation()
  const [updateRecordStatus] = useChangeRecordStatusByIdMutation()

  const currentAccountObjects = useSelector(
    (state: { currentAccount: { accountObjects: Objects[] } }) => state.currentAccount.accountObjects
  )
  const [admissionsMutation] = useGetAllAdmissionsMutation()
  const idArray: string[] = currentAccountObjects.map(object => object.id)

  const [isToRepayDialogOpen, setToRepayDialogOpen] = useState(false)
  const [toRepayType, setToRepayType] = useState('')

  const { refetch: refetchAccountData } = useGetAllAccountsQuery()
  const { refetch: refetchObjectsData } = useGetAllObjectsQuery()
  const { refetch: refetchEmployeesData } = useGetAllAccountToObjectQuery()

  const handleButtonClick = (title: ButtonName) => {
    const newPath = location.pathname.includes('/archive')
      ? location.pathname.replace('/archive', '')
      : location.pathname

    const newSearchPath = location.pathname.includes('/search')
      ? location.pathname.replace('/search', '')
      : location.pathname

    switch (title) {
      case 'edit':
        navigate(`${newSearchPath}/${id}`)
        break
      case 'trash':
        handleDelete()
        break
      case 'history':
        navigate(`${newPath}/history/${id}`)
        break
      case 'toRepay':
        handleToRepay()
        break

      default:
        break
    }
  }

  const openToRepayDialog = () => {
    setToRepayDialogOpen(true)
  }

  const closeToRepayDialog = () => {
    setToRepayDialogOpen(false)
  }

  const handleToRepay = () => {
    openToRepayDialog()
  }

  const handleToRepayConfirmed = async () => {
    if (location.pathname === '/admissions') {
      setToRepayType('заявку')
      await updateAdmissionStatus({ admissionId: id, admissionData: { status: 'closed', reason: '' } })
      await admissionsMutation(idArray)
    } else if (location.pathname.includes('/admissions')) {
      setToRepayType('запись')
      await updateRecordStatus({ recordId: id, recordStatus: { status: 'closed', reason: '' } })
      // await admissionsMutation(idArray)
    } else {
      console.error('Unknown object type')
      return
    }

    closeToRepayDialog()
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
      <ToRepayDialog
        open={isToRepayDialogOpen}
        onClose={() => {
          closeToRepayDialog()
        }}
        onConfirm={handleToRepayConfirmed}
        type={toRepayType}
      />
    </>
  )
}
