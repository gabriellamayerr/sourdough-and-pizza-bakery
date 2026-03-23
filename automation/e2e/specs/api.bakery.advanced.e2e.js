import bakeryApi from '../api/bakery.api.js'

describe('Bakery API (advanced contract)', () => {
  it('rejects QA state access without qa key', async () => {
    const response = await bakeryApi.client.request('/api/test/state')

    await expect(response.ok).toBe(false)
    await expect(response.status).toBe(401)
    await expect(response.payload.message).toBe('invalid QA API key')
  })

  it('rejects unknown QA seed scenario with available options', async () => {
    const response = await bakeryApi.seedQaState('unknown-scenario')

    await expect(response.ok).toBe(false)
    await expect(response.status).toBe(400)
    await expect(Array.isArray(response.payload.availableScenarios)).toBe(true)
    await expect(response.payload.availableScenarios).toContain('bakery-demo-day')
  })

  it('rejects batch calculation when one item is invalid', async () => {
    const response = await bakeryApi.batchCalculate([
      { flour: 1000, hydration: 70, starter: 20, salt: 2 },
      { flour: 0, hydration: 70, starter: 20, salt: 2 },
    ])

    await expect(response.ok).toBe(false)
    await expect(response.status).toBe(400)
    await expect(response.payload.message).toContain('invalid item at index 1')
  })

  it('rejects checkout for unsupported payment provider', async () => {
    const catalogResponse = await bakeryApi.listPremiumCatalog()
    await expect(catalogResponse.ok).toBe(true)

    const firstItem = catalogResponse.payload.items[0]
    const response = await bakeryApi.createPremiumCheckout({
      customer: {
        name: 'QA Customer',
        email: 'qa.customer@vatra.test',
        phone: '0712345678',
      },
      paymentProvider: 'stripe',
      items: [{ id: firstItem.id, quantity: 1 }],
    })

    await expect(response.ok).toBe(false)
    await expect(response.status).toBe(400)
    await expect(response.payload.message).toBe('unsupported payment provider')
  })

  it('handles repeated mock payment confirmation idempotently', async () => {
    const catalogResponse = await bakeryApi.listPremiumCatalog()
    await expect(catalogResponse.ok).toBe(true)

    const firstItem = catalogResponse.payload.items[0]
    const checkoutResponse = await bakeryApi.createPremiumCheckout({
      customer: {
        name: 'QA Customer',
        email: 'qa.customer@vatra.test',
        phone: '0712345678',
      },
      paymentProvider: 'netopia',
      items: [{ id: firstItem.id, quantity: 1 }],
    })

    await expect(checkoutResponse.ok).toBe(true)
    const orderId = checkoutResponse.payload.order.id

    const firstPaymentResponse = await bakeryApi.confirmMockNetopiaPayment(orderId)
    await expect(firstPaymentResponse.ok).toBe(true)
    await expect(firstPaymentResponse.payload.order.status).toBe('paid')

    const secondPaymentResponse = await bakeryApi.confirmMockNetopiaPayment(orderId)
    await expect(secondPaymentResponse.ok).toBe(true)
    await expect(secondPaymentResponse.payload.message).toBe('payment already confirmed')
    await expect(secondPaymentResponse.payload.order.status).toBe('paid')
  })
})