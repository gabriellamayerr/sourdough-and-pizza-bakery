import { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function CurrencyRon({ value }) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PremiumPage() {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const [catalog, setCatalog] = useState([])
  const [paymentProviders, setPaymentProviders] = useState([])
  const [cart, setCart] = useState({})
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [checkoutOrder, setCheckoutOrder] = useState(null)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  })

  useEffect(() => {
    if (user) {
      setCustomer((previous) => ({
        ...previous,
        name: user.name || previous.name,
        email: user.email || previous.email,
      }))
    }
  }, [user])

  useEffect(() => {
    const loadCatalog = async () => {
      setIsLoadingCatalog(true)
      setCatalogError('')

      try {
        const response = await fetch('/api/premium/catalog')

        if (!response.ok) {
          throw new Error(t('premium.errors.catalogLoad'))
        }

        const payload = await response.json()
        setCatalog(payload.items || [])
        setPaymentProviders(payload.paymentProviders || [])
      } catch (error) {
        setCatalogError(error.message)
      } finally {
        setIsLoadingCatalog(false)
      }
    }

    loadCatalog()
  }, [t])

  const courses = useMemo(() => catalog.filter((item) => item.type === 'course'), [catalog])
  const exclusiveProducts = useMemo(
    () => catalog.filter((item) => item.type === 'exclusive-product'),
    [catalog],
  )

  const cartItems = useMemo(() => {
    return catalog
      .map((item) => ({
        ...item,
        quantity: Number(cart[item.id] || 0),
      }))
      .filter((item) => item.quantity > 0)
  }, [catalog, cart])

  const totalRon = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.priceRon * item.quantity, 0)
  }, [cartItems])

  const selectedProvider = paymentProviders.find((provider) => provider.id === 'netopia')

  const updateQuantity = (itemId, nextValue) => {
    setCart((previous) => {
      const quantity = Math.max(0, Number(nextValue) || 0)
      if (quantity === 0) {
        const nextCart = { ...previous }
        delete nextCart[itemId]
        return nextCart
      }

      return {
        ...previous,
        [itemId]: quantity,
      }
    })
  }

  const addOne = (itemId) => {
    updateQuantity(itemId, Number(cart[itemId] || 0) + 1)
  }

  const removeOne = (itemId) => {
    updateQuantity(itemId, Number(cart[itemId] || 0) - 1)
  }

  const handleCustomerChange = (field) => (event) => {
    setCustomer((previous) => ({
      ...previous,
      [field]: event.target.value,
    }))
  }

  const handleCheckout = async () => {
    if (!customer.name.trim() || !customer.email.trim()) {
      setCheckoutError(t('premium.errors.customerRequired'))
      return
    }

    if (cartItems.length === 0) {
      setCheckoutError(t('premium.errors.cartEmpty'))
      return
    }

    setCheckoutError('')
    setPaymentMessage('')
    setCheckoutOrder(null)
    setIsCheckoutLoading(true)

    try {
      const response = await fetch('/api/premium/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          paymentProvider: 'netopia',
          items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message || t('premium.errors.checkoutFailed'))
      }

      setCheckoutOrder({
        order: payload.order,
        paymentSession: payload.paymentSession,
      })
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  const handleMockPayment = async () => {
    if (!checkoutOrder?.order?.id) {
      return
    }

    setIsPaymentLoading(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/premium/payment/mock-netopia/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: checkoutOrder.order.id,
          cardToken: '4111111111111111',
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message || t('premium.errors.paymentFailed'))
      }

      setCheckoutOrder((previous) => ({
        ...previous,
        order: payload.order,
      }))
      setPaymentMessage(t('premium.checkout.paymentSuccess', { transactionId: payload.order.payment.transactionId }))
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      setIsPaymentLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Container maxW="md" py={{ base: 8, md: 14 }}>
        <Box bg="white" borderRadius="2xl" p={{ base: 6, md: 8 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Stack spacing={4} textAlign="center">
            <Heading size="md" color="orange.900">{t('premium.loginRequired.title')}</Heading>
            <Text color="gray.700">{t('premium.loginRequired.description')}</Text>
            <Button as={RouterLink} to="/login" colorScheme="orange">
              {t('premium.loginRequired.cta')}
            </Button>
          </Stack>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }} data-testid="premium-page">
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Heading color="orange.900">{t('premium.title')}</Heading>
          <Text color="gray.700">{t('premium.subtitle')}</Text>
          {selectedProvider && (
            <Text color="gray.600" fontSize="sm" data-testid="premium-provider">
              {t('premium.provider')}: {selectedProvider.label}
            </Text>
          )}
        </Stack>

        {isLoadingCatalog ? (
          <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="orange.100">
            <Text>{t('premium.loading')}</Text>
          </Box>
        ) : (
          <Stack spacing={8}>
            <Box>
              <Heading size="md" color="orange.900" mb={4}>{t('premium.coursesTitle')}</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {courses.map((item) => (
                  <Box key={item.id} bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="orange.100" boxShadow="sm" data-testid={`premium-card-${item.id}`}>
                    <Stack spacing={3}>
                      <Badge alignSelf="start" colorPalette="orange">{t('premium.labels.course')}</Badge>
                      <Heading size="sm" color="gray.900">{item.title}</Heading>
                      <Text color="gray.700" fontSize="sm">{item.description}</Text>
                      <Text fontWeight="bold" color="orange.900">{CurrencyRon({ value: item.priceRon })}</Text>
                      <Button colorScheme="orange" variant="outline" onClick={() => addOne(item.id)} data-testid={`premium-add-${item.id}`}>
                        {t('premium.addToCart')}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Box>
              <Heading size="md" color="orange.900" mb={4}>{t('premium.productsTitle')}</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {exclusiveProducts.map((item) => (
                  <Box key={item.id} bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="orange.100" boxShadow="sm" data-testid={`premium-card-${item.id}`}>
                    <Stack spacing={3}>
                      <Badge alignSelf="start" colorPalette="purple">{t('premium.labels.exclusiveProduct')}</Badge>
                      <Heading size="sm" color="gray.900">{item.title}</Heading>
                      <Text color="gray.700" fontSize="sm">{item.description}</Text>
                      <Text fontWeight="bold" color="orange.900">{CurrencyRon({ value: item.priceRon })}</Text>
                      <Button colorScheme="orange" variant="outline" onClick={() => addOne(item.id)} data-testid={`premium-add-${item.id}`}>
                        {t('premium.addToCart')}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        )}

        <Box bg="white" borderRadius="2xl" p={{ base: 5, md: 7 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
          <Stack spacing={5}>
            <Heading size="md" color="orange.900">{t('premium.checkout.title')}</Heading>

            {catalogError && <Text color="red.600">{catalogError}</Text>}

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              <Input placeholder={t('premium.checkout.customerName')} value={customer.name} onChange={handleCustomerChange('name')} data-testid="checkout-customer-name" />
              <Input placeholder={t('premium.checkout.customerEmail')} value={customer.email} onChange={handleCustomerChange('email')} data-testid="checkout-customer-email" />
              <Input placeholder={t('premium.checkout.customerPhone')} value={customer.phone} onChange={handleCustomerChange('phone')} data-testid="checkout-customer-phone" />
            </SimpleGrid>

            <Box borderTopWidth="1px" borderColor="orange.100" />

            <Stack spacing={3}>
              <Text fontWeight="semibold" color="gray.800">{t('premium.checkout.cartTitle')}</Text>
              {cartItems.length === 0 ? (
                <Text color="gray.600" data-testid="checkout-empty-cart">{t('premium.checkout.emptyCart')}</Text>
              ) : (
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Box key={item.id} borderWidth="1px" borderColor="orange.100" borderRadius="lg" p={3} data-testid={`checkout-item-${item.id}`}>
                      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
                        <Text color="gray.800">{item.title}</Text>
                        <Stack direction="row" align="center">
                          <Button size="xs" variant="outline" onClick={() => removeOne(item.id)}>-</Button>
                          <Text minW="24px" textAlign="center" data-testid={`checkout-qty-${item.id}`}>{item.quantity}</Text>
                          <Button size="xs" variant="outline" onClick={() => addOne(item.id)}>+</Button>
                          <Text minW="88px" textAlign="right" fontWeight="medium">{CurrencyRon({ value: item.priceRon * item.quantity })}</Text>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>

            <Text fontWeight="bold" color="orange.900" data-testid="checkout-total">
              {t('premium.checkout.total')}: {CurrencyRon({ value: totalRon })}
            </Text>

            {checkoutError && <Text color="red.600">{checkoutError}</Text>}

            <Button colorScheme="orange" onClick={handleCheckout} loading={isCheckoutLoading} data-testid="checkout-submit">
              {t('premium.checkout.submit')}
            </Button>

            {checkoutOrder && (
              <Box borderWidth="1px" borderColor="green.200" borderRadius="lg" p={4} bg="green.50" data-testid="checkout-order-result">
                <Stack spacing={2}>
                  <Text color="green.800" fontWeight="semibold">
                    {t('premium.checkout.orderCreated', { orderId: checkoutOrder.order.id })}
                  </Text>
                  <Text color="green.700" fontSize="sm">
                    {t('premium.checkout.orderStatus')}: {checkoutOrder.order.status}
                  </Text>
                  <Button
                    colorScheme="green"
                    variant="outline"
                    onClick={handleMockPayment}
                    loading={isPaymentLoading}
                    data-testid="checkout-mock-pay"
                  >
                    {t('premium.checkout.confirmMockPayment')}
                  </Button>
                  {paymentMessage && (
                    <Text color="green.800" fontWeight="medium" data-testid="checkout-payment-message">
                      {paymentMessage}
                    </Text>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
