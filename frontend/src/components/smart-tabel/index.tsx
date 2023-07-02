import { useLocation } from 'react-router-dom'
import { Basic, CurrentURL } from './basic'
import { Collapsible } from './collapsible'
import { ButtonNames } from '../shortcut-buttons'

const basicURLs = ['/objects', '/admissions']
const collapsibleURLs = ['/accounts', '/employees', '/admissions/']

export const SmartTabel = ({ buttonNames }: ButtonNames) => {
  const currentURL = useLocation().pathname

  switch (true) {
    case basicURLs.includes(currentURL):
      return <Basic currentURL={currentURL as CurrentURL} buttonNames={buttonNames} />
    case collapsibleURLs.some(url => currentURL.startsWith(url)):
      return <Collapsible />
    default:
      return <h6>Error urls</h6>
  }
}
