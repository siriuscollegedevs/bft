import { Box, Container } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { CustomTypography } from '../../styles/header'
import * as React from 'react'
import { SearchField } from '../search-field'
import { useNavigate, useLocation } from 'react-router-dom'

type IsSwitchProps = {
  isSearchField: boolean
  isSwitch: boolean
  customTitle?: string | number
}

type UrlTitle = [string, string][]

const urlTitle: UrlTitle = [
  ['/accounts', 'Список учетных записей'],
  ['/objects', 'Список объектов Фонда'],
  ['/history', 'История изменений'],
  ['/employees', 'Закрепление сотрудников за объектами Фонда'],
  ['/admissions', 'Заявки']
]

export const EntityTitle: React.FC<IsSwitchProps> = ({ isSearchField, isSwitch, customTitle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUrl = location.pathname
  const isArchivePage = currentUrl.includes('/archive')

  const handleChange = () => {
    navigate(isArchivePage ? currentUrl.replace('/archive', '') : currentUrl + '/archive')
  }

  const getTitleFromUrl = (url: string): string => {
    const hasHistory = url.includes('/history')

    if (url.includes('/admissions/view/')) {
      const parts = url.split('/')
      const admissionId = parts[parts.length - 1]
      return '#' + admissionId
    }

    for (const [subUrl, title] of urlTitle) {
      if (url.includes(subUrl)) {
        if (hasHistory) {
          return 'История изменений'
        } else {
          return title
        }
      }
    }

    return 'Не найдено'
  }

  const title = customTitle || getTitleFromUrl(currentUrl)

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '97%',
            height: '140px',
            borderBottom: currentUrl.startsWith('/admissions/view/') ? 'none' : '1px solid #CBCBCB'
          }}
        >
          <Box sx={{ width: '20%' }} />
          <CustomTypography sx={{ color: 'black', textAlign: 'center', margin: '0 auto' }}>{title}</CustomTypography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '20%'
            }}
          >
            {isSearchField ? (
              <>
                <SearchField />
              </>
            ) : (
              <></>
            )}
            {isSwitch ? (
              <FormControlLabel
                control={
                  <Switch checked={isArchivePage} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
                }
                label="архив записей"
              />
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Container>
    </>
  )
}
