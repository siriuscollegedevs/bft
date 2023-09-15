import { useDispatch, useSelector } from 'react-redux'
import { UserSettings } from '../../components/settings'
import { TechnicalState, setPreviousPage } from '../../__data__/states/technical'

export const Settings = () => {
  const startPage = useSelector((state: { technical: TechnicalState }) => state.technical.startPage)
  const dispatch = useDispatch()
  dispatch(setPreviousPage(startPage))

  return (
    <>
      <UserSettings />
    </>
  )
}
