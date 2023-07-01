import { useLocation } from 'react-router-dom'
import { Basic } from './basic'
import { Collapsible } from './collapsible'

const basicTable = (currentURL: string) => {
  const basicURLs = ['/objects', '/admissions']
  return basicURLs.includes(currentURL)
}

const collapsibleTable = (currentURL: string) => {
  const collapsibleURLs = ['/accounts', '/employees', '/admissions/']
  return collapsibleURLs.some(url => currentURL.startsWith(url))
}

export const SmartTable = () => {
  const currentURL = useLocation().pathname

  switch (true) {
    case basicTable(currentURL):
      return <Basic />
    case collapsibleTable(currentURL):
      return <Collapsible />
    default:
      return <h6>Error + {currentURL}</h6>
  }
}
