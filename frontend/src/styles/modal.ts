import { Box, css, styled } from '@mui/system'

export const ModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45%;
  background-color: #dbdde5;
  border-radius: 30px;
  padding: 46px 32px;
  &:focus {
    outline: none;
  }
`

export const CardsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-evenly;
`

export const Cards = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 45%;
  padding-bottom: 20px;
`

export const InfoCards = styled(Box)`
  background-color: white;
  border-radius: 25px;
  padding: 25px 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
`

export const ListEntries = styled(Box)`
  color: #000;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding: 3px;
`

export const StyledListEntries = styled(ListEntries)<{ isDifferent: boolean }>`
  ${({ isDifferent }) =>
    isDifferent &&
    css`
      background-color: rgba(255, 199, 0, 0.38);
    `}
`
