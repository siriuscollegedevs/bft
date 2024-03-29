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
import { SetStateAction, useEffect, useState } from 'react'
import { DeleteDialog } from '../delete-dialog'
import { ToRepayDialog } from '../to-repay-dialog'
import { useUpdateAdmissionStatusMutation } from '../../__data__/service/admission.api'
import { useChangeRecordStatusByIdMutation } from '../../__data__/service/record.api'
import { useDispatch } from 'react-redux'
import { CanceledDialogShortcutVersion } from '../canceled-dialog/shortcut-version'
import { useRefreshabilityCheck } from '../../hooks/refreshability-check'
import { setNeedUpdate, setRequestStatus, setShowSnackBar } from '../../__data__/states/technical'

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
  const dispatch = useDispatch()
  const refreshabilityCheck = useRefreshabilityCheck()

  const [deleteAccountMutation] = useDeleteAccountByIdMutation()
  const [deleteObjectMutation] = useDeleteObjectByIdMutation()
  const [deleteEmployeesMutation] = useDeleteAccountToObjectByIdMutation()
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [updateAdmissionStatus] = useUpdateAdmissionStatusMutation()
  const [updateRecordStatus] = useChangeRecordStatusByIdMutation()

  const [isToRepayDialogOpen, setToRepayDialogOpen] = useState(false)
  const [toRepayType, setToRepayType] = useState('')

  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [canceInputValue, setCanceInputValue] = useState('')
  const [cancelError, setCancelError] = useState(false)
  const [cancelType, setCancelType] = useState('')

  const { refetch: refetchAccountData } = useGetAllAccountsQuery()
  const { refetch: refetchObjectsData } = useGetAllObjectsQuery()
  const { refetch: refetchEmployeesData } = useGetAllAccountToObjectQuery()

  const handleButtonClick = (title: ButtonName) => {
    let newPath = location.pathname.includes('/archive') ? location.pathname.replace('/archive', '') : location.pathname

    const newSearchPath = location.pathname.includes('/search')
      ? location.pathname.replace('/search', '')
      : location.pathname

    switch (title) {
      case 'edit':
        if (location.pathname.includes('/admissions/')) {
          navigate(`/admissions/${id}/record/edit`, {
            state: { edit: true }
          })
        } else {
          navigate(`${newSearchPath}/${id}`)
        }
        break
      case 'trash':
        handleDelete()
        break
      case 'history':
        newPath = newPath.includes('/search') ? newPath.replace('/search', '') : newPath
        if (location.pathname.includes('/admissions/')) {
          navigate(`/admissions/history/${id}`)
        } else {
          navigate(`${newPath}/history/${id}`)
        }
        break
      case 'toRepay':
        handleToRepay()
        break
      case 'cancel':
        handleCancel()
        break

      default:
        break
    }
  }

  const openCancelDialog = () => {
    setCancelDialogOpen(true)
  }

  const closeCancelDialog = () => {
    setCancelDialogOpen(false)
  }

  const handleCancel = () => {
    openCancelDialog()
  }

  const handleCancelInputChange = (event: { target: { value: SetStateAction<string> } }) => {
    setCanceInputValue(event.target.value)
    setCancelError(false)
  }

  const handleCancelConfirmed = async () => {
    if (canceInputValue === '') {
      setCancelError(true)
    } else {
      let res
      if (location.pathname === '/admissions') {
        setCancelType('заявку')
        res = await updateAdmissionStatus({
          admissionId: id,
          admissionData: { status: 'canceled', reason: canceInputValue }
        })
      } else if (location.pathname.includes('/admissions')) {
        setCancelType('запись')
        res = await updateRecordStatus({
          recordId: id,
          recordStatus: { status: 'canceled', reason: canceInputValue }
        })
      } else {
        console.error('Unknown object type')
        return
      }

      if ('error' in res) {
        dispatch(setRequestStatus('error'))
      } else {
        dispatch(setRequestStatus('success'))
      }

      closeCancelDialog()
      dispatch(setNeedUpdate(true))
      dispatch(setShowSnackBar(true))
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
    let res
    if (location.pathname === '/admissions') {
      setToRepayType('заявку')
      res = await updateAdmissionStatus({ admissionId: id, admissionData: { status: 'closed', reason: '' } })
    } else if (location.pathname.includes('/admissions')) {
      setToRepayType('запись')
      res = await updateRecordStatus({ recordId: id, recordStatus: { status: 'closed', reason: '' } })
    } else {
      console.error('Unknown object type')
      return
    }

    if ('error' in res) {
      dispatch(setRequestStatus('error'))
    } else {
      dispatch(setRequestStatus('success'))
    }

    closeToRepayDialog()
    dispatch(setNeedUpdate(true))
    dispatch(setShowSnackBar(true))
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

  useEffect(() => {
    refreshabilityCheck()
  }, [])

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
      <CanceledDialogShortcutVersion
        open={isCancelDialogOpen}
        onClose={() => {
          closeCancelDialog()
        }}
        onChange={handleCancelInputChange}
        error={cancelError}
        onConfirm={handleCancelConfirmed}
        type={cancelType}
      />
    </>
  )
}
