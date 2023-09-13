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

  const isPathMatching = (path: string, pathToCheck: string) => {
    const regex = new RegExp(`^${path}`)
    return regex.test(pathToCheck)
  }

  const checkCurrentURL = (pathToCheck: string) => {
    return (
      pathsWithID.some(path => isPathMatching(path, pathToCheck)) ||
      ['/accounts/create', '/objects/create', '/employees/create', '/admissions/create'].includes(pathToCheck)
    )
  }

  const findSuccesURL = (currentPage: string) => {
    for (let index = pages.length - 1; index >= 0; index--) {
      if (pages[index] !== currentPage && !checkCurrentURL(pages[index])) {
        dispatch(setPreviousPage(pages[index]))
        return
      }
    }
  }

  const setNewPage = (currentPage: string) => {
    pages.push(currentPage)
    findSuccesURL(currentPage)
    if (pages.length > 100) {
      pages.splice(0, pages.length - 100)
    }
  }

  return { setNewPage }
}
