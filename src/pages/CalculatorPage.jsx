import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function CalculatorPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    flour: 1000,
    hydration: 72,
    starter: 20,
    salt: 2,
  })
  const [apiResult, setApiResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const localResult = useMemo(() => {
    const flour = Number(form.flour) || 0
    const hydration = Number(form.hydration) || 0
    const starter = Number(form.starter) || 0
    const salt = Number(form.salt) || 0

    const water = (flour * hydration) / 100
    const starterWeight = (flour * starter) / 100
    const saltWeight = (flour * salt) / 100
    const totalDough = flour + water + starterWeight + saltWeight

    return {
      flour,
      water,
      starter: starterWeight,
      salt: saltWeight,
      totalDough,
    }
  }, [form])

  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }))
  }

  const hasInvalidForm = Number(form.flour) <= 0 || Number(form.hydration) < 0 || Number(form.starter) < 0 || Number(form.salt) < 0

  const handleApiCalculation = async () => {
    if (hasInvalidForm) {
      setErrorMessage(t('calculator.errors.invalid'))
      return
    }

    setErrorMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flour: Number(form.flour),
          hydration: Number(form.hydration),
          starter: Number(form.starter),
          salt: Number(form.salt),
        }),
      })

      if (!response.ok) {
        throw new Error(t('calculator.errors.failed'))
      }

      const payload = await response.json()
      setApiResult(payload.result)
    } catch (error) {
      setErrorMessage(error.message)
      setApiResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    { key: 'flour', label: t('calculator.fields.flour'), value: localResult.flour },
    { key: 'water', label: t('calculator.stats.water'), value: localResult.water },
    { key: 'starter', label: t('calculator.fields.starter'), value: localResult.starter },
    { key: 'salt', label: t('calculator.fields.salt'), value: localResult.salt },
    { key: 'totaldoughg', label: t('calculator.stats.total'), value: localResult.totalDough },
  ]

  return (
    <Box px={4} py={{ base: 6, md: 10 }}>
      <Container maxW="2xl">
        <Stack spacing={6} bg="white" p={{ base: 5, md: 8 }} borderRadius="2xl" boxShadow="sm" borderWidth="1px" borderColor="orange.100">
          <Stack spacing={3} textAlign="center" align="center">
            <Box
              as="img"
              src="/logo.png"
              alt="VATRA URBANĂ logo"
              boxSize={{ base: '96px', md: '112px' }}
              borderRadius="xl"
              objectFit="cover"
              mx="auto"
            />
            <Heading data-testid="app-title" size={{ base: 'lg', md: 'xl' }} color="orange.900" letterSpacing="wider">
              {t('calculator.title')}
            </Heading>
            <Text color="gray.700" maxW="xl">
              {t('calculator.subtitle')}
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Stack spacing={2}>
              <Text fontWeight="semibold" color="gray.800">{t('calculator.fields.flour')}</Text>
              <Input data-testid="flour-input" type="number" min="1" value={form.flour} onChange={handleChange('flour')} />
            </Stack>
            <Stack spacing={2}>
              <Text fontWeight="semibold" color="gray.800">{t('calculator.fields.hydration')}</Text>
              <Input data-testid="hydration-input" type="number" min="0" value={form.hydration} onChange={handleChange('hydration')} />
            </Stack>
            <Stack spacing={2}>
              <Text fontWeight="semibold" color="gray.800">{t('calculator.fields.starter')}</Text>
              <Input data-testid="starter-input" type="number" min="0" value={form.starter} onChange={handleChange('starter')} />
            </Stack>
            <Stack spacing={2}>
              <Text fontWeight="semibold" color="gray.800">{t('calculator.fields.salt')}</Text>
              <Input data-testid="salt-input" type="number" min="0" value={form.salt} onChange={handleChange('salt')} />
            </Stack>
          </SimpleGrid>

          <Button
            data-testid="calculate-api"
            bg="orange.900"
            color="white"
            _hover={{ bg: 'orange.800' }}
            alignSelf="center"
            px={8}
            onClick={handleApiCalculation}
            loading={isLoading}
          >
            {t('calculator.validate')}
          </Button>

          {errorMessage && (
            <Text color="red.600" textAlign="center" fontSize="sm">
              {errorMessage}
            </Text>
          )}

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            {stats.map((item) => (
              <Box key={item.key} p={4} borderWidth="1px" borderColor="orange.100" borderRadius="xl" boxShadow="xs">
                <Text color="gray.600" fontSize="sm">{item.label}</Text>
                <Text
                  color="orange.900"
                  fontWeight="bold"
                  fontSize="2xl"
                  data-testid={`result-${item.key}`}
                >
                  {item.value.toFixed(1)}
                </Text>
              </Box>
            ))}
          </Grid>

          {apiResult && (
            <Text data-testid="api-result" color="orange.900" textAlign="center" fontWeight="medium">
              {t('calculator.apiTotal', { value: apiResult.totalDough.toFixed(1) })}
            </Text>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
