import { useLocation } from 'react-router-dom'
import { Basic, CurrentURL } from './basic'
import { Collapsible, myURL } from './collapsible'
import { ButtonNames } from '../shortcut-buttons'

const basicURLs = ['/objects', '/objects/archive', '/admissions', '/admissions/archive']
const collapsibleURLs = ['/accounts', '/employees', '/admissions/']

export type Size = {
  width: string
  height: string
}

export const SmartTable = ({ buttonNames, size, data = {} }: ButtonNames & { size: Size } & any) => {
  const currentURL = useLocation().pathname

  switch (true) {
    case basicURLs.includes(currentURL):
      return (
        <>
          <Basic
            key={JSON.stringify(data)}
            currentURL={currentURL as CurrentURL}
            buttonNames={buttonNames}
            size={size}
            data={data}
          />
        </>
      )
    case collapsibleURLs.some(url => currentURL.startsWith(url)):
      return (
        <>
          <Collapsible
            key={JSON.stringify(data)}
            currentURL={currentURL as myURL}
            buttonNames={buttonNames}
            size={size}
            data={data}
          />
        </>
      )
    default:
      return <h6>Error urls</h6>
  }
}
