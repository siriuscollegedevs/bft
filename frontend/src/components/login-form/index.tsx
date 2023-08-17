import { CircularProgress, FormControl } from '@mui/material'
import { useState } from 'react'
import { useLoginMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { LoginButton, PasswordTextField, SignInContainer, SignInTextField, TitleTypography } from '../../styles/login'
import {
  setAccessToken,
  setCSRFToken,
  setIntervalId,
  setLoginData,
  setTimeAccessToken,
  setUpdateProcess
} from '../../__data__/states/auth'
import { useDispatch } from 'react-redux'
import { setAccountId } from '../../__data__/states/account'
import { getCookie } from '../../utils/cookie-parser'
import { useRefreshToken } from '../../hooks/refresh-token'

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const navigate = useNavigate()
  const [loginMutation, { isLoading: loginLoading, isError: loginError }] = useLoginMutation()
  const dispatch = useDispatch()
  const refresh = useRefreshToken()

  const handleLogin = async () => {
    try {
      setShowLoader(true)
      const response = await loginMutation({ username: login, password: password }).unwrap()
      dispatch(setAccountId({ id: response.account_id }))
      dispatch(
        setLoginData({
          access: response.access,
          accessTokenUpdateInterval: response.access_exp,
          csrf: getCookie('csrftoken')
        })
      )

      const intervalId = setInterval(async () => {
        const newToken = await refresh()
        if (newToken) {
          dispatch(setAccessToken(newToken))
        }
      }, response.access_exp / 2)
      dispatch(setIntervalId(intervalId))
      dispatch(setUpdateProcess(true))

      return response ? navigate('/navigation') : null
    } catch (error) {
      console.log(error)
    } finally {
      setShowLoader(false)
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
