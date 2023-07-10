import { Box, styled } from '@mui/system'

export const ModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  //height: 55%;
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
  gap: 20px;
  justify-content: space-around;
`

export const Cards = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 40%;
`

export const InfoCards = styled(Box)`
  background-color: white;
  border-radius: 25px;
  //height: 270px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`

export const ListEntries = styled(Box)`
  color: #000;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
