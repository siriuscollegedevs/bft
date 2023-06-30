import { useNavigate } from 'react-router-dom'
import { CustomFab } from '../../styles/arrow-back'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'

export const BackButton = () => {
  const navigate = useNavigate()

  return (
    <CustomFab color="primary" aria-label="back" onClick={() => navigate(-1)}>
      <ArrowIcon />
    </CustomFab>
  )
}
