import { Button, Container, TextField, Typography, styled } from '@mui/material'

export const SignInContainer = styled(Container)`
  display: flex;
  align-items: center;
  height: 450px;
  width: 600px;
  margin: auto;
  border: 1.5px solid;
  border-color: #49547d;
  border-radius: 20px;
  flex-direction: column;
  margin-top: 220px;
`

export const TitleTypography = styled(Typography)`
  margin-top: 30px;
  margin-bottom: 62px;
`

export const SignInTextField = styled(TextField)`
  width: 485px;
  margin-bottom: 45px;
  color: white;
`

export const PasswordTextField = styled(TextField)`
  width: 485px;
  margin-bottom: 67px;
`

export const LoginButton = styled(Button)`
  height: 50px;
  width: 170px;
`
