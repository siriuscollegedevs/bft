import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Container } from '@mui/system'
import { TextField, Typography } from '@mui/material'
import React from 'react'

const admissionProperties: { [key: string]: string | object } = {
  car_number: 'Гос. номер',
  car_brand: 'Марка автомобиля',
  car_model: 'Модель автомобиля',
  object: 'ГМЦ',
  type: {
    label: 'Тип пропуска',
    values: ['Разовый', 'Временный']
  },
  fullName: 'ФИО',
  from_date: 'Дата начала пропуска',
  to_date: 'Дата окончания пропуска',
  note: 'Примечание'
}

export const AdmissionFilter = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '485px',
        height: '500px',
        flexDirection: 'column',
        paddingTop: '18%'
      }}
    >
      <FormControl>
        {Object.keys(admissionProperties).map((property: string, index: number) => (
          <>
            {property === 'type' ? (
              <>
                <TextField
                  select
                  label={(admissionProperties[property] as { label: string }).label}
                  focused
                  sx={{
                    height: '100%',
                    width: '485px',
                    alignSelf: 'center',
                    marginTop: '20px'
                  }}
                >
                  {(admissionProperties[property] as { values: string[] }).values.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <TextField
                label={admissionProperties[property] as string}
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                focused
                multiline={property === 'note'}
                color="primary"
                sx={{
                  height: '100%',
                  width: '485px',
                  alignSelf: 'center',
                  marginTop: index === 0 ? '0px' : '20px'
                }}
              />
            )}
          </>
        ))}
      </FormControl>
    </Container>
  )
}
