import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CustomFab } from '../../styles/arrow-back'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'
import { useSelector } from 'react-redux'
import { TechnicalState } from '../../__data__/states/technical'
import { AdmissionTechnical } from '../../__data__/states/admission-technical'
import { useCancelCreateAdmission } from '../../hooks/cuncelCreate'

export const BackButton = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { cancelCreateAdmission } = useCancelCreateAdmission()
  const previousPage = useSelector((state: { technical: TechnicalState }) => state.technical.previousPage)
  const idAdmission = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.idCreatedAdmissions
  )

  const createFlag = useSelector(
    (state: { admissionTechnical: AdmissionTechnical }) => state.admissionTechnical.isCreateFlag
  )

  const goBack = () => {
    if (location.pathname === `/admissions/history/${id}`) navigate(-1)
    if (
      location.pathname === '/admissions/create' ||
      (location.pathname === `/admissions/${idAdmission}` && createFlag)
    ) {
      navigate(previousPage)
      if (idAdmission) {
        cancelCreateAdmission(idAdmission)
      }
    } else {
      navigate(previousPage)
    }
  }

  return (
    <CustomFab color="primary" aria-label="back" onClick={() => goBack()}>
      <ArrowIcon />
    </CustomFab>
  )
}
