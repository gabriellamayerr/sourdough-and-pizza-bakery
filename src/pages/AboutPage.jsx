import { Box, Container, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function AboutPage() {
  const { t } = useTranslation()
  const values = t('about.values', { returnObjects: true })

  return (
    <Container maxW="5xl" py={{ base: 8, md: 14 }}>
      <Stack spacing={8}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Stack spacing={4}>
            <Heading color="orange.900" size={{ base: 'lg', md: 'xl' }}>
              {t('about.title')}
            </Heading>
            <Text color="gray.700">
              {t('about.intro')}
            </Text>
          </Stack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {values.map((item) => (
            <Box key={item.title} bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
              <Heading size="sm" color="orange.900" mb={2}>
                {item.title}
              </Heading>
              <Text color="gray.700" fontSize="sm">
                {item.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
