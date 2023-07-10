import * as React from 'react'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Cards, CardsContainer, InfoCards, ListEntries, ModalContainer } from '../../styles/modal'
import { Row } from '../smart-table/history-table'


type Props = {
  open: boolean
  handleClose: () => void
  selectedRow: Row
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
  object: 'Объект(-ы)',
  type: 'Тип',
  from_date: 'Дата',
  to_date: 'Дата',
  note: 'Примечание',
  car_number: 'Гос.номер',
  car_brand: 'Марка',
  car_model: 'Модель'
}

const getActionTranslation = (action: string): string => {
  return actionTranslations[action] || action
}

const getKeyTranslation = (key: string): string => {
  return keyTranslations[key] || key
}

const formatValue = (value: string | string[]) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value
}

export const BasicModal = ({ open, handleClose, selectedRow }: Props): JSX.Element => {
  if (!selectedRow) {
    return <></>
  }
  return (
    <Modal
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
          {getActionTranslation(selectedRow.action)}
        </Typography>
        <CardsContainer>
          <Cards>
            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
              Данные до изменений
            </Typography>
            <InfoCards>
              <>
                {selectedRow.data &&
                  Object.entries(selectedRow.data).map(([key, value]) => (
                    <React.Fragment key={key}>
                      {selectedRow.action === 'cancel' && key === 'note' && (
                        <ListEntries>
                          {getKeyTranslation(key)}: {formatValue(value)}
                        </ListEntries>
                      )}
                        {selectedRow.action === 'edit' && (
                            <ListEntries>
                                {getKeyTranslation(key)}: {formatValue(value)}
                            </ListEntries>
                        )}
                    </React.Fragment>
                  ))}
              </>
            </InfoCards>
          </Cards>
          <Cards>
            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
              Данные после изменений
            </Typography>
            <InfoCards>
              <>
                {selectedRow.data &&
                  Object.entries(selectedRow.data).map(([key, value]) => (
                    <React.Fragment key={key}>
                        {selectedRow.action === 'cancel' && key === 'note' && (
                            <ListEntries>
                                {getKeyTranslation(key)}: {formatValue(value)}
                            </ListEntries>
                        )}
                        {selectedRow.action === 'edit' && (
                            <ListEntries>
                                {getKeyTranslation(key)}: {formatValue(value)}
                            </ListEntries>
                        )}
                    </React.Fragment>
                  ))}
              </>
            </InfoCards>
          </Cards>
        </CardsContainer>
      </ModalContainer>
    </Modal>
  )
}
