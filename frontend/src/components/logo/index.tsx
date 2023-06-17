import { SvgIcon } from '@mui/material'
import { ReactComponent as LogoIcon } from '../../assets/sirius-logo.svg'

type LogoProps = {
  size: number
}

const Logo: React.FC<LogoProps> = ({ size }: LogoProps) => {
  return (
    <>
      <SvgIcon component={LogoIcon} style={{ fontSize: size }} />
    </>
  )
}

export default Logo
