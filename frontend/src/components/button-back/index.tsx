import { useNavigate } from 'react-router-dom'
import { CustomFab } from '../../styles/arrow-back'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'

export const BackButton = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <CustomFab color="primary" aria-label="back" onClick={handleGoBack}>
      <ArrowIcon />
    </CustomFab>
  )
}
