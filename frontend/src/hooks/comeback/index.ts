import { useDispatch } from 'react-redux'
import { setPreviousPage } from '../../__data__/states/technical'
import { useParams } from 'react-router-dom'

export const useComeback = () => {
  const dispatch = useDispatch()
  const { id } = useParams<string>()
  const pages: string[] = []

  const checkCurrentURL = (currentURL: string) => {
    if (id !== undefined) {
      return [
        `/accounts/${id}`,
        `/objects/${id}`,
        `/admissions/${id}`,
        `admissions/${id}/record/create`,
        `admissions/${id}/record/edit`
      ].includes(currentURL)
    }
    return ['/accounts/create', '/objects/create', '/employees/create'].includes(currentURL)
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
      console.log(pages)
    }
  }

  return { setNewPage }
}
