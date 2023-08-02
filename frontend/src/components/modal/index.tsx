import * as React from 'react'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Cards, CardsContainer, InfoCards, ModalContainer, StyledListEntries } from '../../styles/modal'
import { Row } from '../smart-table/history-table'
import { useLocation } from 'react-router-dom'

//TODO если данные отличаются выделять цветом

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
  from_date: 'Дата(от)',
  to_date: 'Дата(до)',
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

const formatValue = (value: string | string[], key: string) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  } else if (value === '') {
    return '-'
  } else if (key === 'to_date' || key === 'from_date') {
    return value.split('.')[0]
  }
  return value
}

export const BasicModal = ({ open, handleClose, selectedRow }: Props): JSX.Element => {
  const desiredFields: { [key: string]: string[] } = {
    '/accounts/': ['first_name', 'surname', 'last_name', 'username', 'role'],
    '/objects/': ['name'],
    '/employees/': ['first_name', 'surname', 'last_name', 'username', 'role', 'objects'],
    '/admissions/': ['car_number', 'car_brand', 'car_model', 'object', 'type', 'from_date', 'to_date', 'note']
  }

  const location = useLocation()
  const urlPath = location.pathname

  const matchingPaths = Object.keys(desiredFields).filter(path => urlPath.startsWith(path))

  if (!selectedRow) {
    return <></>
  }

  if (selectedRow.data) {
    const { car_number, car_brand, car_model } = selectedRow.data as Record<string, string>
    if (
      car_number === '' ||
      car_number === '-' ||
      car_brand === '' ||
      car_brand === '-' ||
      car_model === '' ||
      car_model === '-'
    ) {
      desiredFields['/admissions/'] = [
        'first_name',
        'surname',
        'last_name',
        'object',
        'type',
        'from_date',
        'to_date',
        'note'
      ]
    }
  }

  const fieldsToDisplay = matchingPaths.length > 0 ? desiredFields[matchingPaths[0]] : []
  const isDifferent = false

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
                  fieldsToDisplay.map(key => {
                    const value = (selectedRow.data as Record<string, string[]>)[key]
                    return (
                      <React.Fragment key={key}>
                        {selectedRow.action === 'cancel' && key === 'note' && (
                          <StyledListEntries isDifferent={isDifferent}>
                            {getKeyTranslation(key)}: {formatValue(value, key)}
                          </StyledListEntries>
                        )}
                        {selectedRow.action === 'edit' && (
                          <StyledListEntries isDifferent={isDifferent}>
                            {getKeyTranslation(key)}: {formatValue(value, key)}
                          </StyledListEntries>
                        )}
                      </React.Fragment>
                    )
                  })}
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
                  fieldsToDisplay.map(key => {
                    const value = (selectedRow.data as Record<string, string[]>)[key]
                    return (
                      <React.Fragment key={key}>
                        {selectedRow.action === 'cancel' && key === 'note' && (
                          <StyledListEntries isDifferent={isDifferent}>
                            {getKeyTranslation(key)}: {formatValue(value, key)}
                          </StyledListEntries>
                        )}
                        {selectedRow.action === 'edit' && (
                          <StyledListEntries isDifferent={isDifferent}>
                            {getKeyTranslation(key)}: {formatValue(value, key)}
                          </StyledListEntries>
                        )}
                      </React.Fragment>
                    )
                  })}
              </>
            </InfoCards>
          </Cards>
        </CardsContainer>
      </ModalContainer>
    </Modal>
  )
}
