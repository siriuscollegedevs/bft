import { ButtonGroup, IconButton } from '@mui/material'

import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as HistoryIcon } from '../../assets/history.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'
import { ReactComponent as ToRepayIcon } from '../../assets/toRepay.svg'

type IconMapping = {
  [key: string]: React.ReactNode
}
type ButtonNames = {
  buttonNames: string[]
}

const iconMapping: IconMapping = {
  edit: <EditIcon />,
  history: <HistoryIcon />,
  trash: <TrashIcon />,
  cancel: <CancelIcon />,
  toRepay: <ToRepayIcon />
}

const checkButtonNames = ({ buttonNames }: ButtonNames) => {
  return buttonNames.length < 4 && buttonNames.length > 0
}

export const ShortcutButtons = ({ buttonNames }: ButtonNames) => {
  if (!checkButtonNames({ buttonNames })) {
    return <h6>Error</h6>
  }

  return (
    <ButtonGroup>
      {buttonNames.map(name => (
        <IconButton key={name} disableRipple={true} sx={{ padding: 0, paddingLeft: '5px' }}>
          {iconMapping[name]}
        </IconButton>
      ))}
    </ButtonGroup>
  )
}
