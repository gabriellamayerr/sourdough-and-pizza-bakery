import { useState } from 'react'
import { Alert, Box, Button, Container, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/account" replace />
  }

  const handleLogin = () => {
    setErrorMessage('')

    if (!email.includes('@')) {
      setErrorMessage(t('login.errors.invalidEmail'))
      return
    }

    if (password.length < 6) {
      setErrorMessage(t('login.errors.shortPassword'))
      return
    }

    const result = login({ email, password })
    if (!result.success) {
      setErrorMessage(result.message)
      return
    }

    navigate('/account')
  }

  return (
    <Container maxW="md" py={{ base: 8, md: 14 }}>
      <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
        <Stack spacing={4}>
          <Heading size="lg" color="orange.900" textAlign="center">
            {t('login.title')}
          </Heading>
          <Stack spacing={2}>
            <Text color="gray.800" fontWeight="medium">{t('login.email')}</Text>
            <Input
              data-testid="login-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('login.emailPlaceholder')}
            />
          </Stack>
          <Stack spacing={2}>
            <Text color="gray.800" fontWeight="medium">{t('login.password')}</Text>
            <Input
              data-testid="login-password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('login.passwordPlaceholder')}
            />
          </Stack>

          {errorMessage && (
            <Alert.Root status="error" data-testid="login-error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>{errorMessage}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {infoMessage && (
            <Alert.Root status="info">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>{infoMessage}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <Button colorScheme="orange" onClick={handleLogin} data-testid="login-submit">
            {t('login.login')}
          </Button>
          <Button
            variant="outline"
            colorScheme="orange"
            onClick={() => setInfoMessage(t('login.createInfo'))}
          >
            {t('login.create')}
          </Button>
          <Button as={RouterLink} to="/" variant="ghost" colorScheme="orange" size="sm">
            {t('login.backHome')}
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
