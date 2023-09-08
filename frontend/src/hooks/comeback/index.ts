import { useDispatch, useSelector } from 'react-redux'
import { Account } from '../../types/api'
import { setPreviousPage } from '../../__data__/states/technical'
import { useLocation, useParams } from 'react-router-dom'

export const useComeback = () => {
  const dispatch = useDispatch()
  // const currentURL = useLocation().pathname
  const { id } = useParams<string>()
  const pages = ['/', '']

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
    // if (!checkCurrentURL(currentPage)) {
    //   pages[0] = pages[1]
    //   pages[1] = currentPage
    //   dispatch(setPreviousPage(currentPage))
    // }
    console.log(pages)
  }

  const setComebackPage = (page: string) => {
    dispatch(setPreviousPage(page))
    return true
  }

  return { setComebackPage, setNewPage }
}
