import { styled } from '@mui/system'
import { TextField } from '@mui/material'

export const CustomField = styled(TextField)`
  & .MuiInputBase-root.Mui-disabled {
    background-color: #49547dd1;
  }

  & label.Mui-disabled {
    -webkit-text-fill-color: white;
    font-size: 17px;
  }
`
