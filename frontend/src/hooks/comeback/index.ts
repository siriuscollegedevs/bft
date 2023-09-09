import { useDispatch } from 'react-redux'
import { setPreviousPage } from '../../__data__/states/technical'

export const useComeback = () => {
  const dispatch = useDispatch()
  const pages: string[] = []
  const pathsWithID = [
    '/accounts/[^/]*$',
    '/objects/[^/]*$',
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
      ['/accounts/create', '/objects/create', '/employees/create'].includes(currentURL)
    )
  }

  const setNewPage = (currentPage: string) => {
    if (!checkCurrentURL(currentPage) && pages[1] !== currentPage) {
      pages.push(currentPage)
      if (pages.length > 2) {
        pages.splice(0, pages.length - 2)
      }
      if (pages[0] !== currentPage) {
        dispatch(setPreviousPage(pages[0]))
      }
    }
  }

  return { setNewPage }
}
