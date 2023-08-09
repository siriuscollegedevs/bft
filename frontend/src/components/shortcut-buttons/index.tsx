import { ButtonGroup, IconButton, Tooltip } from '@mui/material'

import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as HistoryIcon } from '../../assets/history.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { ReactComponent as CancelIcon } from '../../assets/cancel.svg'
import { ReactComponent as ToRepayIcon } from '../../assets/toRepay.svg'
import { useNavigate } from 'react-router-dom';

type ButtonName = 'edit' | 'history' | 'trash' | 'cancel' | 'toRepay'

export type ButtonNames = {
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

export const ShortcutButtons = ({ buttonNames }: ButtonNames) => {
  const navigate = useNavigate()
  if (buttonNames.length === 0 || buttonNames.length > 3) {
    return <h6>Error</h6>
  }

  return (
    <ButtonGroup>
      {buttonNames.map(title => (
        <Tooltip title={iconMapping[title].nameRu} placement="top" key={title}>
          <IconButton
            disableRipple={true}
            sx={{
              padding: 0,
              marginLeft: '5px',
              ':first-child': {
                marginLeft: '0px'
              },
              height: '35px',
              width: '35px'
            }}
            onClick={() => {
              if (title === 'edit') {
                const id = 'id';
                const newPath = `${location.pathname}/${id}`;
                navigate(newPath);
              }
            }}
          >
            {iconMapping[title].node}
          </IconButton>
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}
