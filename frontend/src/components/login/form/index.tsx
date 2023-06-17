import { Button, Container, FormControl, TextField, Typography } from '@mui/material'

const LoginForm = () => {
  return (
    <>
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
            placeholder="Введите пароль"
            sx={{ width: 485, marginBottom: '67px' }}
          />

          <Button variant="contained" color="primary" sx={{ height: 50, width: 170 }}>
            Войти
          </Button>
        </FormControl>
      </Container>
    </>
  )
}

export default LoginForm
