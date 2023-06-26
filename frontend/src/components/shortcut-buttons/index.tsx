import { ButtonGroup, IconButton, Tooltip } from '@mui/material'

import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as HistoryIcon } from '../../assets/history.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'
import { ReactComponent as ToRepayIcon } from '../../assets/toRepay.svg'

type ButtonNames = {
  buttonNames: string[]
}

type IconMapping = {
  name: string
  nameRu: string
  node: React.ReactNode
}

const iconMapping: IconMapping[] = [
  {
    name: 'edit',
    nameRu: 'Редактирование',
    node: <EditIcon />
  },
  {
    name: 'history',
    nameRu: 'История',
    node: <HistoryIcon />
  },
  {
    name: 'trash',
    nameRu: 'Удаление',
    node: <TrashIcon />
  },
  {
    name: 'cancel',
    nameRu: 'Аннулирование',
    node: <CancelIcon />
  },
  {
    name: 'toRepay',
    nameRu: 'Погашение',
    node: <ToRepayIcon />
  }
]

const checkButtonNames = ({ buttonNames }: ButtonNames) => {
  return buttonNames.length < 4 && buttonNames.length > 0
}

const filteredIcons = ({ buttonNames }: ButtonNames) => {
  return iconMapping.filter(icon => buttonNames.includes(icon.name))
}

export const ShortcutButtons = ({ buttonNames }: ButtonNames) => {
  if (!checkButtonNames({ buttonNames })) {
    return <h6>Error</h6>
  }

  return (
    <ButtonGroup>
      {filteredIcons({ buttonNames }).map(icon => (
        <Tooltip title={icon.nameRu} placement="top" key={icon.name}>
          <IconButton
            disableRipple={true}
            sx={{
              padding: 0,
              paddingLeft: '5px',
              ':first-child': {
                paddingLeft: '0px'
              }
            }}
          >
            {icon.node}
          </IconButton>
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}
