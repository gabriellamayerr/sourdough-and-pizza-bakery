import { Box, Button, Container, Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AccountPage() {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <Container maxW="md" py={{ base: 8, md: 14 }}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Stack spacing={4} textAlign="center">
            <Heading size="md" color="orange.900">{t('account.title')}</Heading>
            <Text color="gray.700">{t('account.pleaseLogin')}</Text>
            <Button as={RouterLink} to="/login" colorScheme="orange">
              {t('account.goToLogin')}
            </Button>
          </Stack>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="4xl" py={{ base: 8, md: 14 }}>
      <Stack spacing={6}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Heading size="lg" color="orange.900" mb={3}>{t('account.title')}</Heading>
          <Stack spacing={1}>
            <Text color="gray.800"><Text as="span" fontWeight="bold">{t('account.name')}</Text> {user.name}</Text>
            <Text color="gray.800"><Text as="span" fontWeight="bold">{t('account.email')}</Text> {user.email}</Text>
          </Stack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
            <Heading size="sm" color="orange.900" mb={2}>{t('account.savedTitle')}</Heading>
            <Text color="gray.700">{t('account.savedEmpty')}</Text>
          </Box>
          <Box bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
            <Heading size="sm" color="orange.900" mb={2}>{t('account.recentTitle')}</Heading>
            <Text color="gray.700">{t('account.lastLogin', { value: new Date(user.lastLoginAt).toLocaleString() })}</Text>
          </Box>
        </SimpleGrid>

        <HStack>
          <Button colorScheme="orange" variant="outline" onClick={handleLogout}>
            {t('nav.logout')}
          </Button>
        </HStack>
      </Stack>
    </Container>
  )
}
