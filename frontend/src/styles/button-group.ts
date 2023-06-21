import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import { ListItem } from '@mui/material'

export const CustomButton = styled(Button)`
  color: black;
  min-height: 100px;
  justify-content: space-between;
  text-transform: none;

  border: 1px solid #49547d;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 34px;
  padding: 10px 20px;

  &:hover {
    background-color: #dbdde5;
    border: 1px solid transparent;
  }

  && .MuiTouchRipple-child {
    background-color: white;
  }

  &&.Mui-disabled {
    border: 1px solid #49547d;
    background: transparent;
    color: black;
  }
`

export const CustomListItem = styled(ListItem)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 34px;
  padding: 0 10px;
`
