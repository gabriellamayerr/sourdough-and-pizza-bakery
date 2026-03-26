import bakeryApi from '../api/bakery.api.js'
import { qaScenarios } from '../data/qa-scenarios.data.js'

describe('Bakery API (automation contract)', () => {
  it('is healthy and reachable', async () => {
    const response = await bakeryApi.health()

    await expect(response.ok).toBe(true)
    await expect(response.payload.status).toBe('ok')
  })

  it('seeds and returns deterministic QA state', async () => {
    const seedResponse = await bakeryApi.seedQaState(qaScenarios.bakeryDemoDay)
    await expect(seedResponse.ok).toBe(true)
    await expect(seedResponse.payload.state.calculations.length).toBe(2)

    const stateResponse = await bakeryApi.getQaState()
    await expect(stateResponse.ok).toBe(true)
    await expect(stateResponse.payload.state.scenario).toBe(qaScenarios.bakeryDemoDay)
  })

  it('supports batch calculation for data-driven assertions', async () => {
    const response = await bakeryApi.batchCalculate([
      { flour: 1000, hydration: 70, starter: 20, salt: 2 },
      { flour: 500, hydration: 65, starter: 15, salt: 2 },
    ])

    await expect(response.ok).toBe(true)
    await expect(response.payload.results.length).toBe(2)
    await expect(response.payload.results[0].totalDough).toBe(1920)
    await expect(response.payload.results[1].totalDough).toBe(910)
  })

  it('supports premium checkout with mock NETOPIA payment', async () => {
    const catalogResponse = await bakeryApi.listPremiumCatalog()
    await expect(catalogResponse.ok).toBe(true)
    await expect(Array.isArray(catalogResponse.payload.items)).toBe(true)
    await expect(catalogResponse.payload.items.length).toBeGreaterThan(0)

    const firstItem = catalogResponse.payload.items[0]

    const checkoutResponse = await bakeryApi.createPremiumCheckout({
      customer: {
        name: 'QA Customer',
        email: 'qa.customer@vatra.test',
        phone: '0712345678',
      },
      paymentProvider: 'netopia',
      items: [{ id: firstItem.id, quantity: 2 }],
    })

    await expect(checkoutResponse.ok).toBe(true)
    await expect(checkoutResponse.status).toBe(201)
    await expect(checkoutResponse.payload.order.status).toBe('pending_payment')

    const orderId = checkoutResponse.payload.order.id
    const paymentResponse = await bakeryApi.confirmMockNetopiaPayment(orderId)
    await expect(paymentResponse.ok).toBe(true)
    await expect(paymentResponse.payload.order.status).toBe('paid')

    const orderResponse = await bakeryApi.getPremiumOrder(orderId)
    await expect(orderResponse.ok).toBe(true)
    await expect(orderResponse.payload.order.status).toBe('paid')
  })

  after(async () => {
    await bakeryApi.resetQaState()
  })
})
