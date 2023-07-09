import { FormControl, Typography } from '@mui/material'
import { useState } from 'react'
import { useLoginMutation } from '../../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import {
  LoginButton,
  PasswordTextField,
  SignInContainer,
  SignInTextField,
  TitleTypography
} from '../../../styles/login'

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [loginMutation, { isLoading, isError }] = useLoginMutation()

  const handleLogin = async () => {
    try {
      const response = await loginMutation({ username: login, password: password }).unwrap()
      return response ? navigate('/main-page') : null
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {isError ? <Typography>error</Typography> : null}
      {isLoading ? (
        <Typography>Loading</Typography>
      ) : (
        <SignInContainer fixed>
          <FormControl className="sign-in" color="primary" sx={{ alignItems: 'center' }}>
            <TitleTypography variant="h4">Авторизация</TitleTypography>
            <SignInTextField
              id="sign-in-login"
              label="Логин"
              InputLabelProps={{
                shrink: true
              }}
              margin="dense"
              color="primary"
              focused
              error={isError}
              onChange={e => setLogin(e.target.value)}
              placeholder="Введите логин"
            />
            <PasswordTextField
              id="sign-in-password"
              label="Пароль"
              InputLabelProps={{
                shrink: true
              }}
              margin="dense"
              color="primary"
              focused
              error={isError}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
            <LoginButton type="submit" onClick={handleLogin} variant="contained" color="primary">
              Войти
            </LoginButton>
          </FormControl>
        </SignInContainer>
      )}
    </>
  )
}
