import { SvgIcon } from '@mui/material'
import { ReactComponent as LogoIcon } from '../../assets/sirius-logo.svg'
import PropTypes from 'prop-types'

type LogoProps = {
  size: number
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  return (
    <>
      <SvgIcon component={LogoIcon} style={{ fontSize: size }} />
    </>
  )
}

Logo.propTypes = {
  size: PropTypes.number.isRequired
}

export default Logo
