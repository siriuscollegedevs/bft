import * as React from 'react'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Cards, CardsContainer, InfoCards, ListEntries, ModalContainer } from '../../styles/modal'
import { useLocation } from 'react-router-dom'
import { DataAccounts, DataAdmissions, DataEmployees, DataObject } from '../smart-table/history-table/smoke'

export type CommonData = DataAccounts | DataObject | DataEmployees | DataAdmissions

type Props = {
  id: string
  open: boolean
  handleClose: (flag: boolean) => void
  data: CommonData
}

const actionTranslations: { [key: string]: string } = {
  edit: 'Редактирование',
  cancel: 'Аннулирование',
  toRepay: 'Погашение'
}

const keyTranslations: { [key: string]: string } = {
  name: 'Название',
  role: 'Тип учетной записи',
  first_name: 'Имя',
  surname: 'Фамилия',
  last_name: 'Отчество',
  username: 'Логин',
  objects: 'Объект(-ы)',
  type: 'Тип',
  from_date: 'Дата',
  to_date: 'Дата',
  note: 'Примечание'
}

const getActionTranslation = (action: string): string => {
  return actionTranslations[action] || action
}

const getKeyTranslation = (key: string): string => {
  return keyTranslations[key] || key
}

export const BasicModal = ({ id, open, handleClose, data }: Props): JSX.Element => {
  const location = useLocation()
  const filteredEntries = Object.entries(data).filter(([key]) => {
    if (location.pathname.startsWith('/accounts/')) {
      return key === 'first_name' || key === 'surname' || key === 'last_name' || key === 'username'
    } else if (location.pathname.startsWith('/objects/')) {
      return key === 'name'
    } else if (location.pathname.startsWith('/employees/')) {
      return key === 'first_name' || key === 'surname' || key === 'last_name' || key === 'username' || key === 'objects'
    } else if (location.pathname.startsWith('/admissions/')) {
      return (
        key === 'first_name' ||
        key === 'surname' ||
        key === 'last_name' ||
        key === 'type' ||
        key === 'from_date' ||
        key === 'to_date' ||
        key === 'note'
      )
    }
    return key === 'name'
  })

  const objectsValue = filteredEntries.find(([key]) => key === 'objects')?.[1]
  const objectsString = Array.isArray(objectsValue) ? objectsValue.join(', ') : ''

  return (
    <Modal
      id={id}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: 'center', marginBottom: '25px' }}
        >
          {getActionTranslation(data.action)}
        </Typography>
        <CardsContainer>
          <Cards>
            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
              Данные до изменений
            </Typography>
            <InfoCards>
              {filteredEntries.map(([key, value]) => (
                <React.Fragment key={key}>
                  {data.action === 'cancel' && key === 'note' && (
                    <ListEntries>
                      {getKeyTranslation(key)}: {value}
                    </ListEntries>
                  )}
                  {data.action === 'edit' && (
                    <ListEntries>
                      {getKeyTranslation(key)}: {value}
                    </ListEntries>
                  )}
                </React.Fragment>
              ))}
            </InfoCards>
          </Cards>
          <Cards>
            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
              Данные после изменений
            </Typography>
            <InfoCards>
              {filteredEntries.map(([key, value]) => (
                <React.Fragment key={key}>
                  {data.action === 'cancel' && key === 'note' && (
                    <ListEntries>
                      {getKeyTranslation(key)}: {value}
                    </ListEntries>
                  )}
                  {data.action === 'edit' && (
                    <ListEntries>
                      {getKeyTranslation(key)}: {value}
                    </ListEntries>
                  )}
                </React.Fragment>
              ))}
            </InfoCards>
          </Cards>
        </CardsContainer>
      </ModalContainer>
    </Modal>
  )
}
