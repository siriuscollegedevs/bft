import { Box, styled } from '@mui/system'
import Button from '@mui/material/Button'

export const SidebarButton = styled(Button)`
  height: 45px;
  width: 100%;
  text-transform: none;
  color: ${({ variant }) => (variant === 'contained' ? 'white' : 'black')};
  border: ${({ variant }) => (variant === 'contained' ? '0px' : '1.5px solid #49547D')};
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`

export const SideBarContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 97%;
  justify-content: center;
  margin: 0 auto;
  padding-top: 15px;
  gap: 15px;
  height: 72vh;
`
