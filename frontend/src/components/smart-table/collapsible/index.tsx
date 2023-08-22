import { Paper, Table, TableBody, TableContainer } from '@mui/material'
import { ButtonNames } from '../../shortcut-buttons'
import { Row } from './row'
import { Size } from '..'
import React from 'react'
import { CustomTypography } from '../../../styles/header'
import { SearchOfAdmissionsResponse } from '../../../types/api'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const groupedData: { [key: string]: SearchOfAdmissionsResponse[] } = data.reduce(
    (groups: { [key: string]: SearchOfAdmissionsResponse[] }, item: SearchOfAdmissionsResponse) => {
      const groupId = item.code
      if (!groups[groupId]) {
        groups[groupId] = []
      }
      groups[groupId].push(item)
      return groups
    },
    {} as { [key: string]: SearchOfAdmissionsResponse[] }
  )

  return currentURL === '/admissions/search' ? (
    <>
      {Object.keys(groupedData).map(groupId => (
        <React.Fragment key={groupId}>
          <CustomTypography
            sx={{ color: '#4F4F4F', textAlign: 'start', fontSize: '16px', m: '20px 0', cursor: 'pointer' }}
            onClick={() => navigate(`/admissions/view/${groupedData[groupId][0].request_id}`)}
          >
            #{groupId}
          </CustomTypography>
          <Paper elevation={1}>
            <Table>
              <TableBody>
                {groupedData[groupId].map(item => (
                  <>
                    <Row row={item} buttonNames={buttonNames} currentURL={currentURL} />
                  </>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </React.Fragment>
      ))}
    </>
  ) : (
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
