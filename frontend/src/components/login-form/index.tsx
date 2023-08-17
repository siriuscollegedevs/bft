import { CircularProgress, FormControl } from '@mui/material'
import { useState } from 'react'
import { useLoginMutation, useRefreshMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { LoginButton, PasswordTextField, SignInContainer, SignInTextField, TitleTypography } from '../../styles/login'
import { setAccessToken, setCSRFToken, setTimeAccessToken } from '../../__data__/states/auth'
import { useDispatch } from 'react-redux'
import { setAccountId } from '../../__data__/states/account'
import { getCookie } from '../../utils/cookie-parser'

export let intervalId: NodeJS.Timer
export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const navigate = useNavigate()
  const [loginMutation, { isLoading: loginLoading, isError: loginError }] = useLoginMutation()
  const [refreshTokenMutation] = useRefreshMutation()
  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      setShowLoader(true)
      const response = await loginMutation({ username: login, password: password }).unwrap()
      dispatch(setAccessToken(response.access))
      dispatch(setAccountId({ id: response.account_id }))
      dispatch(setTimeAccessToken(response.access_exp))
      dispatch(setCSRFToken(getCookie('csrftoken')))

      intervalId = setInterval(refreshToken, response.access_exp / 2)

      return response ? navigate('/navigation') : null
    } catch (error) {
      console.log(error)
    } finally {
      setShowLoader(false)
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

  return (
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
        <LoginButton
          type="submit"
          onClick={handleLogin}
          variant="contained"
          color="primary"
          disabled={loginLoading || showLoader}
        >
          {loginLoading || showLoader ? <CircularProgress size={20} color="inherit" /> : 'Войти'}
        </LoginButton>
      </FormControl>
    </SignInContainer>
  )
}
