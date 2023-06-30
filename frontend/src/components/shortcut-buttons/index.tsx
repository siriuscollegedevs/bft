import { ButtonGroup, IconButton, Tooltip } from '@mui/material'

import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as HistoryIcon } from '../../assets/history.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'
import { ReactComponent as ToRepayIcon } from '../../assets/toRepay.svg'

type ButtonName = 'edit' | 'history' | 'trash' | 'cancel' | 'toRepay'

type ButtonNames = {
  buttonNames: ButtonName[]
}

type IconMappingItem = {
  nameRu: string
  node: React.ReactNode
}

type IconMapping = {
  [key in ButtonName]: IconMappingItem
}

const iconMapping: IconMapping = {
  edit: {
    nameRu: 'Редактирование',
    node: <EditIcon />
  },
  history: {
    nameRu: 'История',
    node: <HistoryIcon />
  },
  trash: {
    nameRu: 'Удаление',
    node: <TrashIcon />
  },
  cancel: {
    nameRu: 'Аннулирование',
    node: <CancelIcon />
  },
  toRepay: {
    nameRu: 'Погашение',
    node: <ToRepayIcon />
  }
}

const filteredIcons = ({ buttonNames }: ButtonNames) => {
  return Object.keys(iconMapping)
    .filter(key => buttonNames.includes(key as ButtonName))
    .map(key => ({ ...iconMapping[key as ButtonName], name: key }))
}

export const ShortcutButtons = ({ buttonNames }: ButtonNames) => {

  if (buttonNames.length === 0 || buttonNames.length > 3) {
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
