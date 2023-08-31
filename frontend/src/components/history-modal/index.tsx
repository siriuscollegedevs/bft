import * as React from 'react'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Cards, CardsContainer, InfoCards, ModalContainer, StyledListEntries } from '../../styles/modal'
import { useLocation } from 'react-router-dom'
import { formatValue, getActionTranslation, getKeyTranslation } from '../../__data__/consts/history'
import { AccountHistory, AdmissionsHistory, ObjectHistory } from '../../types/api'
import { CommonHistoryData } from '../smart-table/history-table'

type ModalProps = {
  open: boolean
  handleClose: () => void
  selectedRow: CommonHistoryData | null
  prewRow: CommonHistoryData | null
}

export const BasicModal = ({ open, handleClose, selectedRow, prewRow }: ModalProps) => {
  const differences: { [key: string]: boolean } = {}
  if (selectedRow && prewRow) {
    const keys = Object.keys(selectedRow) as (keyof CommonHistoryData)[]

    keys.forEach(key => {
      const selectedValue = selectedRow[key]
      const prewValue = prewRow[key]
      differences[key] = selectedValue !== prewValue
    })
  }

  const desiredFields: { [key: string]: string[] } = {
    '/accounts/': ['last_name', 'first_name', 'surname', 'username', 'role'],
    '/objects/': ['name'],
    '/admissions/': ['car_brand', 'car_model', 'car_number', 'type', 'from_date', 'to_date', 'note']
  }

  const location = useLocation()
  const urlPath = location.pathname

  const matchingPaths = Object.keys(desiredFields).filter(path => urlPath.startsWith(path))

  if (!selectedRow) {
    return <></>
  }

  if (selectedRow) {
    const { car_number, car_brand, car_model } = selectedRow as AdmissionsHistory
    if (car_number === '' || car_brand === '' || car_model === '') {
      desiredFields['/admissions/'] = ['last_name', 'first_name', 'surname', 'type', 'from_date', 'to_date', 'note']
    }
  }

  const fieldsToDisplay = matchingPaths.length > 0 ? desiredFields[matchingPaths[0]] : []

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
                {prewRow &&
                  fieldsToDisplay.map(key => {
                    const prewValue =
                      (prewRow as AccountHistory)[key as keyof AccountHistory] ||
                      (prewRow as ObjectHistory)[key as keyof ObjectHistory] ||
                      (prewRow as AdmissionsHistory)[key as keyof AdmissionsHistory]

                    const shouldHighlight = differences[key]
                    return (
                      <React.Fragment key={key}>
                        {selectedRow.action === 'canceled' && key === 'note' && (
                          <StyledListEntries isDifferent={shouldHighlight}>
                            {getKeyTranslation(key)}: {formatValue(prewValue, key)}
                          </StyledListEntries>
                        )}
                        {(prewRow.action === 'modified' || prewRow.action === 'created') &&
                          selectedRow.action !== 'canceled' && (
                            <StyledListEntries isDifferent={shouldHighlight}>
                              {getKeyTranslation(key)}: {formatValue(prewValue, key)}
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
                {selectedRow &&
                  fieldsToDisplay.map(key => {
                    const value =
                      (selectedRow as AccountHistory)[key as keyof AccountHistory] ||
                      (selectedRow as ObjectHistory)[key as keyof ObjectHistory] ||
                      (selectedRow as AdmissionsHistory)[key as keyof AdmissionsHistory]

                    const shouldHighlight = differences[key]
                    return (
                      <React.Fragment key={key}>
                        {selectedRow.action === 'canceled' && key === 'note' && (
                          <StyledListEntries isDifferent={shouldHighlight}>
                            {getKeyTranslation(key)}: {formatValue(value, key)}
                          </StyledListEntries>
                        )}
                        {selectedRow.action === 'modified' && (
                          <StyledListEntries isDifferent={shouldHighlight}>
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
