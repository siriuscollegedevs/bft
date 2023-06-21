import { Container, FormControl, FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import { CustomDefaultButton, CustomFormControl } from '../../../styles/settings'
import { CustomTypography } from '../../../styles/header'
import * as React from 'react'
import { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'

export const UserSettings = () => {
  const roles = {
    manager: 'manager',
    sb: 'sb',
    administrator: 'admin',
    security: 'security'
  }

  const [role, setRole] = React.useState('')

  useEffect(() => {
    // Fetch
    setRole(roles.manager)
  }, [])

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  const [passwordMatch, setPasswordMatch] = useState(true)

  const [formSubmitted, setFormSubmitted] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword)
  }

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  }

  const handleClickShowRepeatPassword = () => {
    setShowRepeatPassword(!showRepeatPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSave = () => {
    setFormSubmitted(true)

    if (newPassword !== repeatPassword) {
      setPasswordMatch(false)
      return
    } else {
      setPasswordMatch(true)
      return
    }
  }

  return (
    <>
      <Container
        fixed
        sx={{
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          mt: '150px'
        }}
      >
        <CustomFormControl color="primary">
          <CustomTypography variant="h6" sx={{ color: 'black' }}>
            Смена пароля
          </CustomTypography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '25px',
              width: '100%'
            }}
          >
            {role !== roles.administrator && (
              <FormControl sx={{ m: 1, width: '85%' }} variant="outlined" focused error={formSubmitted && !oldPassword}>
                <InputLabel htmlFor="outlined-adornment-password">Старый пароль</InputLabel>
                <OutlinedInput
                  id="old-password"
                  margin="dense"
                  color="primary"
                  placeholder="Введите старый пароль"
                  type={showOldPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Старый пароль"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                />
                {formSubmitted && !oldPassword && (
                  <FormHelperText error sx={{ ml: 0 }}>
                    Это поле обязательно.
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <FormControl sx={{ m: 1, width: '85%' }} variant="outlined" focused error={formSubmitted && !newPassword}>
              <InputLabel htmlFor="outlined-adornment-password">Новый пароль</InputLabel>
              <OutlinedInput
                id="new-password"
                margin="dense"
                color="primary"
                placeholder="Введите новый пароль"
                type={showNewPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Новый пароль"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              {formSubmitted && !newPassword && (
                <FormHelperText error sx={{ ml: 0 }}>
                  Это поле обязательно.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              sx={{ m: 1, width: '85%' }}
              variant="outlined"
              focused
              error={formSubmitted && !repeatPassword}
            >
              <InputLabel htmlFor="outlined-adornment-password">Новый пароль</InputLabel>
              <OutlinedInput
                id="new-password-repeat"
                margin="dense"
                color="primary"
                placeholder="Повторите новый пароль"
                type={showRepeatPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowRepeatPassword()}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Новый пароль"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                required
              />
              {formSubmitted && !repeatPassword && (
                <FormHelperText error sx={{ ml: 0 }}>
                  Это поле обязательно.
                </FormHelperText>
              )}
              {!passwordMatch && (
                <FormHelperText error sx={{ ml: 0 }}>
                  Пароли не совпадают.
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <CustomDefaultButton variant="contained" color="primary" onClick={handleSave}>
            Сохранить
          </CustomDefaultButton>
        </CustomFormControl>
      </Container>
    </>
  )
}
