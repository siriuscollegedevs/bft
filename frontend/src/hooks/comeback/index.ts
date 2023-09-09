import { useDispatch } from 'react-redux'
import { setPreviousPage } from '../../__data__/states/technical'

export const useComeback = () => {
  const dispatch = useDispatch()
  const pages: string[] = []
  const pathsWithID = [
    '/accounts/[^/]*$',
    '/objects/[^/]*$',
    '/employees/[^/]*$',
    '/admissions/[^/]*$',
    '/admissions/[^/]*/record/create$',
    '/admissions/[^/]*/record/edit$'
  ]

  const isCurrentPathMatching = (path: string) => {
    const regex = new RegExp(`^${path}`)
    return regex.test(location.pathname)
  }

  const checkCurrentURL = (currentURL: string) => {
    return (
      pathsWithID.some(isCurrentPathMatching) ||
      ['/accounts/create', '/objects/create', '/employees/create', 'admissions/create'].includes(currentURL)
    )
  }

  const findSuccesURL = () => {
    for (let index = pages.length - 1; index >= 0; index--) {
      if (pages.length > 3) {
        if (pages[index] !== pages[index - 2]) {
          dispatch(setPreviousPage(pages[index - 1]))
          return
        } else {
          dispatch(setPreviousPage(pages[index - 3]))
          return
        }
      } else {
        dispatch(setPreviousPage(pages[index - 1]))
        return
      }
    }
  }

  const setNewPage = (currentPage: string) => {
    if (!checkCurrentURL(currentPage) && pages[pages.length - 1] !== currentPage) {
      pages.push(currentPage)
      findSuccesURL()
      if (pages.length > 100) {
        pages.splice(0, pages.length - 100)
      }
    }
  }

  return { setNewPage }
}
