import { CircularProgress, FormControl } from '@mui/material'
import {useEffect, useState} from 'react'
import {useClearCookieQuery, useLoginMutation} from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { LoginButton, PasswordTextField, SignInContainer, SignInTextField, TitleTypography } from '../../styles/login'
import { setAccessToken, setLoginData } from '../../__data__/states/auth'
import { useDispatch } from 'react-redux'
import { setAccountId } from '../../__data__/states/account'
import {deleteCookie, getCookie} from '../../utils/cookie-parser'
import { useRefreshToken } from '../../hooks/refresh-token'
import { AlertDialog } from './alert-dialog'
import {useLogout} from '../../hooks/logout';

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const navigate = useNavigate()
  const [loginMutation, { isLoading: loginLoading, isError: loginError, error: loginErrorStatus }] = useLoginMutation()
  const dispatch = useDispatch()
  const refresh = useRefreshToken()
  const { data: clearCookieData, error: clearCookieError, refetch: clearCookieRefetch } = useClearCookieQuery();
  const logout = useLogout(navigate)

  const handleLogin = async () => {
    try {
      setShowLoader(true)
      const response = await loginMutation({ username: login, password: password }).unwrap()
      dispatch(setAccountId({ id: response.account_id }))

      const intervalId = setInterval(async () => {
        const newToken = await refresh()
        if (newToken) {
          dispatch(setAccessToken(newToken))
        }
      }, response.access_exp / 2)

      dispatch(
        setLoginData({
          access: response.access,
          accessTokenUpdateInterval: response.access_exp,
          csrf: getCookie('csrftoken'),
          updateProcess: true,
          intervalId: intervalId
        })
      )

      return response ? navigate('/navigation') : null
    } catch (error) {
      console.log(error)
    } finally {
      setShowLoader(false)
    }
  }

  // if (loginErrorStatus && 'status' in loginErrorStatus && (loginErrorStatus.status === 403 || loginErrorStatus.status === 401)) {
  //   clearCookieRefetch()
  // }
  //
  // useEffect(() => {
  //   if (loginErrorStatus && 'status' in loginErrorStatus && loginErrorStatus.status === 401 ) {
  //     deleteCookie('csrftoken')
  //     if (!clearCookieError) {
  //       // Assuming the clearCookieData is an object returned from the API call
  //       // and it confirms that cookies have been cleared successfully
  //       console.log('Cookies cleared successfully');
  //     }
  //   }
  // }, [clearCookieData, clearCookieError, loginErrorStatus]);

  return (
    <SignInContainer fixed>
      {loginErrorStatus && 'status' in loginErrorStatus && <>{loginErrorStatus.status !== 401 && <AlertDialog />}</>}
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
          error={loginErrorStatus && 'status' in loginErrorStatus && loginErrorStatus.status === 401}
          helperText={
            loginError && loginErrorStatus && 'status' in loginErrorStatus && loginErrorStatus.status === 401
              ? 'Неправильный логин или пароль'
              : ' '
          }
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
          error={loginErrorStatus && 'status' in loginErrorStatus && loginErrorStatus.status === 401}
          helperText={
            loginError && loginErrorStatus && 'status' in loginErrorStatus && loginErrorStatus.status === 401
              ? 'Неправильный логин или пароль'
              : ' '
          }
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
