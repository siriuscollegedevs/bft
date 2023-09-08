import { useNavigate } from 'react-router-dom'
import { CustomFab } from '../../styles/arrow-back'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'
import { useSelector } from 'react-redux'
import { TechnicalState } from '../../__data__/states/technical'

export const BackButton = () => {
  const navigate = useNavigate()
  const previousPage = useSelector((state: { technical: TechnicalState }) => state.technical.previousPage)

  return (
    <CustomFab color="primary" aria-label="back" onClick={() => navigate(previousPage)}>
      <ArrowIcon />
    </CustomFab>
  )
}
