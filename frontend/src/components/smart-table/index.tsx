import { useLocation } from 'react-router-dom'
import { Basic, CurrentURL } from './basic'
import { Collapsible, myURL } from './collapsible'
import { ButtonNames } from '../shortcut-buttons'

const basicURLs = ['/objects', '/admissions']
const collapsibleURLs = ['/accounts', '/employees', '/admissions/']

export type Size = {
  width: string
  height: string
}

export const SmartTable = ({ buttonNames, size }: ButtonNames & { size: Size }) => {
  const currentURL = useLocation().pathname

  switch (true) {
    case basicURLs.includes(currentURL):
      return <Basic currentURL={currentURL as CurrentURL} buttonNames={buttonNames} size={size} />
    case collapsibleURLs.some(url => currentURL.startsWith(url)):
      return <Collapsible currentURL={currentURL as myURL} buttonNames={buttonNames} size={size} />
    default:
      return <h6>Error urls</h6>
  }
}
