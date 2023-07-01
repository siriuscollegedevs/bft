import { useLocation } from 'react-router-dom'
import { Basic, CurrentURL } from './basic'
import { Collapsible } from './collapsible'

const basicURLs = ['/objects', '/admissions']
const collapsibleURLs = ['/accounts', '/employees', '/admissions/']

export const SmartTabel = () => {
  const currentURL = useLocation().pathname

  switch (true) {
    case basicURLs.includes(currentURL):
      return <Basic currentURL={currentURL as CurrentURL} />
    case collapsibleURLs.some(url => currentURL.startsWith(url)):
      return <Collapsible />
    default:
      return <h6>Error urls</h6>
  }
}
