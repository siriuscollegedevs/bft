import { CircularProgress, FormControl, IconButton, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import { useClearCookieQuery, useLoginMutation, useLogoutMutation } from '../../__data__/service/auth.api'
import { useNavigate } from 'react-router-dom'
import { LoginButton, PasswordTextField, SignInContainer, SignInTextField, TitleTypography } from '../../styles/login'
import { clearAuth, setAccessToken, setLoginData } from '../../__data__/states/auth'
import { useDispatch } from 'react-redux'
import { clearAccount, setAccountId } from '../../__data__/states/account'
import { deleteCookie, getCookie } from '../../utils/cookie-parser'
import { useRefreshToken } from '../../hooks/refresh-token'
import { AlertDialog } from './alert-dialog'
import { VisibilityOff, Visibility } from '@mui/icons-material'

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loginMutation, { isLoading: loginLoading, isError: loginError, error: loginErrorStatus }] = useLoginMutation()
  const dispatch = useDispatch()
  const refresh = useRefreshToken()
  const [logoutMutation] = useLogoutMutation()
  const { refetch: clearCookieRefetch } = useClearCookieQuery()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async () => {
    try {
      setShowLoader(true)
      dispatch(clearAccount())
      dispatch(clearAuth())
      deleteCookie('csrftoken')
      await clearCookieRefetch()

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
          intervalId: intervalId,
          login: true
        })
      )

      return response ? navigate('/navigation') : null
    } catch (error) {
      console.log(error)
    } finally {
      setShowLoader(false)
    }
  }

  useEffect(() => {
    if (loginErrorStatus && 'status' in loginErrorStatus) {
      if (loginErrorStatus.status === 401 || loginErrorStatus.status === 403) {
        logoutMutation()
        dispatch(clearAuth())
        deleteCookie('csrftoken')
        clearCookieRefetch()
      }
    }
  }, [loginErrorStatus])

  return (
    <SignInContainer
      fixed
      sx={{
        '& .MuiFormHelperText-root': {
          marginLeft: 0
        }
      }}
    >
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          margin="dense"
          color="primary"
          focused
          type={showPassword ? 'text' : 'password'}
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
