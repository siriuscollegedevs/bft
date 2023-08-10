import { Table, TableBody, TableContainer } from '@mui/material'
import { ButtonNames } from '../../shortcut-buttons'
import { Row } from './row'
import { Size } from '..'

export type myURL =
  | '/accounts'
  | '/accounts/archive'
  | '/accounts/search'
  | '/employees'
  | '/employees/search'
  | '/employees/archive'
  | '/admissions/view/:admission_id'
  | '/admissions/:admission_id'
  | '/admissions/search'

export const Collapsible = ({
  currentURL,
  buttonNames,
  size,
  data
}: { currentURL: myURL } & ButtonNames & { size: Size } & any) => {
  console.log(data)
  return (
    <TableContainer sx={{ width: size.width, height: size.height }}>
      <Table aria-label="collapsible table">
        <TableBody>
          {data && (
            <>
              {data?.map((row: any) => (
                <>
                  <Row row={row} buttonNames={buttonNames} currentURL={currentURL} />
                </>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
