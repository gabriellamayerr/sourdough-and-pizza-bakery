import { Badge, Box, Button, Container, Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function ShopPage() {
  const { t } = useTranslation()
  const products = t('shop.products', { returnObjects: true })

  return (
    <Container maxW="5xl" py={{ base: 8, md: 14 }}>
      <Stack spacing={6}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Heading color="orange.900" size={{ base: 'lg', md: 'xl' }} mb={2}>
            {t('shop.title')}
          </Heading>
          <Text color="gray.700">
            {t('shop.intro')}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {products.map((product) => (
            <Box key={product.name} bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
              <HStack justify="space-between" mb={2}>
                <Heading size="sm" color="orange.900">{product.name}</Heading>
                <Text fontWeight="bold" color="gray.800">{product.price}</Text>
              </HStack>
              <Badge colorScheme="orange" borderRadius="full" px={2} py={1}>
                {product.tag}
              </Badge>
            </Box>
          ))}
        </SimpleGrid>

        <Button alignSelf="start" colorScheme="orange" borderRadius="full">
          {t('shop.requestCatalog')}
        </Button>
      </Stack>
    </Container>
  )
}
