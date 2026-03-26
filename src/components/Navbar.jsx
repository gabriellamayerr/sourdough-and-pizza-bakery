import { Box, Button, Container, HStack, Link, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavLinkItem({ to, label, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      as={RouterLink}
      to={to}
      onClick={onClick}
      px={4}
      py={2}
      borderRadius="full"
      fontSize="sm"
      fontWeight="medium"
      color={isActive ? 'orange.900' : 'gray.700'}
      bg={isActive ? 'white' : 'transparent'}
      borderWidth="1px"
      borderColor={isActive ? 'orange.200' : 'transparent'}
      _hover={{ textDecoration: 'none', bg: 'orange.50', borderColor: 'orange.200' }}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/premium', label: t('nav.premium') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/calculator', label: t('nav.calculator') },
    { to: '/account', label: t('nav.account') },
  ]

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMobileOpen(false)
    navigate('/')
  }

  return (
    <Box
      as="header"
      bg={isScrolled ? 'rgba(255, 247, 237, 0.85)' : 'orange.50'}
      borderBottomWidth="1px"
      borderBottomColor="orange.100"
      position="sticky"
      top="0"
      zIndex="10"
      backdropFilter={isScrolled ? 'saturate(150%) blur(10px)' : 'none'}
      transition="background-color 0.2s ease, backdrop-filter 0.2s ease"
    >
      <Container maxW="6xl" py={3}>
        <HStack
          justify="space-between"
          align="center"
          gap={4}
          bg="white"
          borderWidth="1px"
          borderColor="orange.100"
          borderRadius="full"
          px={{ base: 3, md: 4 }}
          py={2}
          boxShadow="sm"
        >
          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <HStack gap={3}>
              <Box
                as="img"
                src="/logo.png"
                alt="VATRA URBANĂ logo"
                boxSize={{ base: '34px', md: '40px' }}
                borderRadius="full"
                objectFit="cover"
                borderWidth="1px"
                borderColor="orange.200"
              />
              <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }} color="orange.900" letterSpacing="0.08em">
                VATRA URBANĂ
              </Text>
            </HStack>
          </Link>

          <HStack display={{ base: 'none', md: 'flex' }} gap={2}>
            {navLinks.map((item) => (
              <NavLinkItem key={item.to} to={item.to} label={item.label} />
            ))}
          </HStack>

          <HStack display={{ base: 'none', md: 'flex' }}>
            <HStack mr={2}>
              <Button
                variant={i18n.resolvedLanguage === 'en' ? 'solid' : 'outline'}
                colorScheme="orange"
                borderRadius="full"
                size="xs"
                onClick={() => i18n.changeLanguage('en')}
              >
                {t('language.en')}
              </Button>
              <Button
                variant={i18n.resolvedLanguage === 'ro' ? 'solid' : 'outline'}
                colorScheme="orange"
                borderRadius="full"
                size="xs"
                onClick={() => i18n.changeLanguage('ro')}
              >
                {t('language.ro')}
              </Button>
            </HStack>
            {isAuthenticated ? (
              <Button variant="outline" colorScheme="orange" borderRadius="full" size="sm" onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            ) : (
              <Button as={RouterLink} to="/login" colorScheme="orange" borderRadius="full" size="sm">
                {t('nav.login')}
              </Button>
            )}
          </HStack>

          <Button
            display={{ base: 'inline-flex', md: 'none' }}
            variant="outline"
            colorScheme="orange"
            borderRadius="full"
            size="sm"
            onClick={() => setIsMobileOpen((value) => !value)}
            aria-label={t('nav.openMenu')}
          >
            ☰
          </Button>
        </HStack>

        {isMobileOpen && (
          <Stack
            pt={3}
            pb={2}
            px={2}
            display={{ md: 'none' }}
            bg="white"
            borderWidth="1px"
            borderColor="orange.100"
            borderRadius="xl"
            mt={2}
            boxShadow="sm"
          >
            {navLinks.map((item) => (
              <NavLinkItem
                key={item.to}
                to={item.to}
                label={item.label}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}
            <HStack justify="center" pb={1}>
              <Button
                variant={i18n.resolvedLanguage === 'en' ? 'solid' : 'outline'}
                colorScheme="orange"
                borderRadius="full"
                size="xs"
                onClick={() => i18n.changeLanguage('en')}
              >
                {t('language.en')}
              </Button>
              <Button
                variant={i18n.resolvedLanguage === 'ro' ? 'solid' : 'outline'}
                colorScheme="orange"
                borderRadius="full"
                size="xs"
                onClick={() => i18n.changeLanguage('ro')}
              >
                {t('language.ro')}
              </Button>
            </HStack>
            {isAuthenticated ? (
              <Button variant="outline" colorScheme="orange" onClick={handleLogout}>
                {t('nav.logout')}
              </Button>
            ) : (
              <Button as={RouterLink} to="/login" colorScheme="orange" onClick={() => setIsMobileOpen(false)}>
                {t('nav.login')}
              </Button>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  )
}
