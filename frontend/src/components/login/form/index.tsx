import { Button, Container, FormControl, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useLoginMutation } from '../../../__data__/service/api'
import { useNavigate } from 'react-router-dom'

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [loginMutation, { isLoading, isError }] = useLoginMutation()

  const handleLogin = async () => {
    try {
      const { data } = await loginMutation({ login, password }).unwrap()
      return data.success ? navigate('/main-page') : null
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
        <Container fixed>
          <FormControl
            className="sign-in"
            color="primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 450,
              width: 600,
              margin: 'auto',
              border: '1.5px solid',
              borderColor: '#49547D',
              borderRadius: '20px',
              flexDirection: 'column',
              marginTop: '220px'
            }}
          >
            <Typography variant="h4" sx={{ marginTop: '30px', marginBottom: '62px' }}>
              Авторизация
            </Typography>

            <TextField
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
              sx={{ width: 485, marginBottom: '45px', color: 'white' }}
            />

            <TextField
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
              sx={{ width: 485, marginBottom: '67px' }}
            />

            <Button
              type="submit"
              onClick={handleLogin}
              variant="contained"
              color="primary"
              sx={{ height: 50, width: 170 }}
            >
              Войти
            </Button>
          </FormControl>
        </Container>
      )}
    </>
  )
}
