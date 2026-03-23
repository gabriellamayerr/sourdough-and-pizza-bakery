import { Box, Button, Container, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <Container maxW="4xl" py={{ base: 8, md: 14 }}>
      <Stack spacing={6}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Heading color="orange.900" size={{ base: 'lg', md: 'xl' }} mb={2}>
            {t('contact.title')}
          </Heading>
          <Text color="gray.700">
            {t('contact.intro')}
          </Text>
        </Box>

        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Stack spacing={4}>
            <Input placeholder={t('contact.fields.name')} />
            <Input type="email" placeholder={t('contact.fields.email')} />
            <Input placeholder={t('contact.fields.subject')} />
            <Textarea placeholder={t('contact.fields.message')} minH="140px" resize="vertical" />
            <Button colorScheme="orange" alignSelf="start" borderRadius="full">
              {t('contact.send')}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
