import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDeleteAdmissionsByIdMutation } from '../../__data__/service/admission.api'
import { setShowObjectsSelector } from '../../__data__/states/admission-technical'

export const useCancelCreateAdmission = () => {
  const [deleteAdmission] = useDeleteAdmissionsByIdMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cancelCreateAdmission = (id: string) => {
    try {
      deleteAdmission(id)
      dispatch(setShowObjectsSelector(true))
      navigate('/admissions')
    } catch (error) {
      console.error(error)
    }
  }

  return { cancelCreateAdmission }
}
