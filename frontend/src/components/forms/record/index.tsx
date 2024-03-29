import { Human } from './human'
import { Transport } from './transport'

type FormRecordProps = {
  gender: string
}

export const FormRecord = ({ gender }: FormRecordProps) => {
  switch (gender) {
    case 'Человек':
      return <Human />
    case 'Транспорт':
      return <Transport />
    default:
      return <>Error</>
  }
}
