import { styled } from '@mui/system'
import { Fab } from '@mui/material'

export const CustomFab = styled(Fab)`
  border-radius: 4px;
  position: absolute;
  left: 29px;
  top: 85px;

  && path {
    fill: white;
  }

  && svg {
    transform: rotate(180deg);
  }
`
