import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

export default function HomePage() {
  const { t } = useTranslation()
  const products = t('home.specialty.products', { returnObjects: true })
  const [slideStartIndex, setSlideStartIndex] = useState(0)
  const productsPerView = 3

  const visibleProducts = Array.from({ length: productsPerView }, (_, offset) => {
    const index = (slideStartIndex + offset) % products.length
    return products[index]
  })

  const goToPreviousProduct = () => {
    setSlideStartIndex((previous) => {
      const nextIndex = previous - productsPerView
      return nextIndex < 0 ? nextIndex + products.length : nextIndex
    })
  }

  const goToNextProduct = () => {
    setSlideStartIndex((previous) => (previous + productsPerView) % products.length)
  }

  return (
    <Container maxW="6xl" py={{ base: 8, md: 14 }}>
      <Stack spacing={{ base: 10, md: 14 }}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 10 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Stack spacing={{ base: 6, md: 8 }} textAlign="center" align="center">
            <Box
              as="img"
              src="/logo.png"
              alt="VATRA URBANĂ logo"
              boxSize={{ base: '104px', md: '130px' }}
              borderRadius="full"
              borderWidth="1px"
              borderColor="orange.200"
              boxShadow="sm"
              objectFit="cover"
              mx="auto"
            />
            <Box
              as="img"
              src="/home.jpg"
              alt="Friendly bakery atmosphere"
              w="full"
              h={{ base: '220px', md: '300px' }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor="orange.100"
              boxShadow="sm"
              objectFit="cover"
            />
            <Heading size={{ base: 'xl', md: '2xl' }} color="orange.900">
              {t('home.hero.title')}
            </Heading>
            <Text color="gray.700" maxW="2xl">
              {t('home.hero.subtitle')}
            </Text>
            <HStack gap={3} flexWrap="wrap" justify="center">
              <Button as={RouterLink} to="/calculator" colorScheme="orange">
                {t('home.hero.tryCalculator')}
              </Button>
              <Button as="a" href="#features" variant="outline" colorScheme="orange">
                {t('home.hero.learnMore')}
              </Button>
            </HStack>
          </Stack>
        </Box>

        <Box id="features">
          <Stack
            bg="white"
            borderRadius="2xl"
            p={{ base: 5, md: 7 }}
            borderWidth="1px"
            borderColor="orange.100"
            boxShadow="sm"
            spacing={6}
            mb={10}
          >
            <Heading size="lg" color="orange.900" textAlign="center">
              {t('home.artisan.title')}
            </Heading>
            <Text color="gray.700" textAlign="center" maxW="3xl" mx="auto">
              {t('home.artisan.description')}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box borderWidth="1px" borderColor="orange.100" borderRadius="xl" p={5} bg="orange.50">
                <Text color="orange.900" fontWeight="bold" mb={2}>
                  {t('home.artisan.breadTitle')}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  {t('home.artisan.breadText')}
                </Text>
              </Box>
              <Box borderWidth="1px" borderColor="orange.100" borderRadius="xl" p={5} bg="orange.50">
                <Text color="orange.900" fontWeight="bold" mb={2}>
                  {t('home.artisan.pizzaTitle')}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  {t('home.artisan.pizzaText')}
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>

          <Heading size="lg" color="orange.900" mb={5}>
            {t('home.specialty.title')}
          </Heading>
          <Stack
            bg="white"
            borderRadius="2xl"
            p={{ base: 4, md: 6 }}
            borderWidth="1px"
            borderColor="orange.100"
            boxShadow="sm"
            spacing={4}
          >
            <SimpleGrid columns={3} spacing={4}>
              {visibleProducts.map((product) => (
                <Box key={product.name} borderWidth="1px" borderColor="orange.100" borderRadius="xl" overflow="hidden" boxShadow="sm">
                  <Box
                    h={{ base: '120px', md: '160px' }}
                    bgImage={`url('${product.image}')`}
                    bgSize="cover"
                    bgPosition={product.imagePosition}
                  />
                  <Stack spacing={2} p={4}>
                    <Text color="orange.900" fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                      {product.name}
                    </Text>
                    <Text color="gray.700" fontSize="xs">
                      {product.description}
                    </Text>
                    <Text color="orange.800" fontWeight="semibold" fontSize="sm">
                      {product.price}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>

            <HStack justify="center" gap={3}>
              <Button variant="outline" colorScheme="orange" borderRadius="full" onClick={goToPreviousProduct}>
                ←
              </Button>
              <Text color="gray.600" fontSize="sm" minW="70px" textAlign="center">
                {t('home.specialty.counter', {
                  start: slideStartIndex + 1,
                  end: ((slideStartIndex + productsPerView - 1) % products.length) + 1,
                  total: products.length,
                })}
              </Text>
              <Button colorScheme="orange" borderRadius="full" onClick={goToNextProduct}>
                →
              </Button>
            </HStack>
          </Stack>
        </Box>

        <Box as="footer" borderTopWidth="1px" borderTopColor="orange.100" py={6}>
          <HStack justify="space-between" flexWrap="wrap" gap={3}>
            <Text color="gray.700">© {new Date().getFullYear()} VATRA URBANĂ</Text>
            <HStack gap={4}>
              <Button as={RouterLink} variant="ghost" to="/calculator" size="sm" colorScheme="orange">
                {t('footer.calculator')}
              </Button>
              <Button as={RouterLink} variant="ghost" to="/account" size="sm" colorScheme="orange">
                {t('footer.account')}
              </Button>
            </HStack>
          </HStack>
        </Box>

        <Text color="gray.700" fontWeight="medium" textAlign="center">
          {t('home.footerMessage')}
        </Text>

      </Stack>
    </Container>
  )
}
