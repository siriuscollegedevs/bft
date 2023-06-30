import { styled } from '@mui/system'
import { FormControl, TextField } from '@mui/material'
import Button from '@mui/material/Button'

export const CustomFormControl = styled(FormControl)`
  display: flex;
  align-items: center;
  width: 50%;
  margin: auto;
  border: 1.5px solid;
  border-color: #49547d;
  border-radius: 20px;
  flex-direction: column;
  padding: 25px 15px;
  gap: 35px;
`

export const CustomTextField = styled(TextField)`
  width: 85%;
  color: white;
`

export const CustomDefaultButton = styled(Button)`
  height: 40px;
  width: 150px;
`
