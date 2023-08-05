import { FormControl, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLoginMutation, useRefreshMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { LoginButton, PasswordTextField, SignInContainer, SignInTextField, TitleTypography } from '../../styles/login'
import { AuthState, setAccessToken, setCSRFToken, setTimeAccessToken } from '../../states/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setAccountId } from '../../states/account'
import { getCookie } from '../../utils/cookie-parser'

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [loginMutation, { isLoading: loginLoading, isError: loginError }] = useLoginMutation()
  const [refreshTokenMutation, { isLoading: refreshTokenLoading, isError: refreshTokenError }] = useRefreshMutation()
  const dispatch = useDispatch()

  const accessTokenUpdateInterval = useSelector((state: { auth: AuthState }) => state.auth.accessTokenUpdateInterval)

  const handleLogin = async () => {
    try {
      const response = await loginMutation({ username: login, password: password }).unwrap()
      dispatch(setAccessToken(response.access))
      dispatch(setAccountId({ id: response.account_id }))
      dispatch(setTimeAccessToken(response.access_exp))
      dispatch(setCSRFToken(getCookie('csrftoken')))

      refreshToken()
      const refreshInterval = 60 * 20
      setInterval(refreshToken, refreshInterval)

      return response ? navigate('/navigation') : null
    } catch (error) {
      console.log(error)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await refreshTokenMutation()
      if ('data' in response) {
        dispatch(setAccessToken(response.data.access))
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  // useEffect(() => {
  //   if (accessToken) {
  //     const refreshInterval = 29
  //     // const refreshInterval = (accessTokenUpdateInterval * 1000);
  //     const intervalId = setInterval(refreshToken, refreshInterval)
  //     return () => clearInterval(intervalId)
  //   }
  // }, [accessToken])

  return (
    <>
      {loginLoading ? <Typography>error</Typography> : null}
      {loginError ? (
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
              error={loginError}
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
              error={loginError}
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
