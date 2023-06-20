import { SvgIcon } from '@mui/material'
import { ReactComponent as LogoIcon } from '../../assets/sirius-logo.svg'

type LogoProps = {
  size: number
}

export const Logo = ({ size }: LogoProps) => {
  return (
    <>
      <SvgIcon component={LogoIcon} style={{ fontSize: size }} />
    </>
  )
}
